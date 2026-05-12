import './editor.js';
import { formatDuration, isRingingAnswered } from './utils.js';

class FritzboxCallCard extends HTMLElement {
  static getConfigElement() {
    
    return document.createElement("fritzbox-call-card-editor");
  }

  static getStubConfig() {
    return {
      entities: [],
      max_calls: 10,
      max_hours: 24,
      title: "📞 Call History",
    }
  }

  setConfig(config) {
    if (!config || !Array.isArray(config.entities)) {
      throw new Error("Invalid configuration: 'entities' must be an array.");
    }

    this.config = {
      title: config.title || "📞 Call History",
      max_calls: Number.isInteger(config.max_calls)
        ? config.max_calls
        : parseInt(config.max_calls, 10) || 10,
      max_hours: Number.isFinite(config.max_hours)
        ? config.max_hours
        : parseInt(config.max_hours, 10) || 24,
      ...config,
    };
    this.calls = [];
    this._lastEntityStates = {};
    this._loading = false;
    this._initialized = false;
  }

  set hass(hass) {
    this._hass = hass;

    if (!this.config || !Array.isArray(this.config.entities)) {
      return;
    }

    let changed = false;

    this.config.entities.forEach((entityConfig) => {
      const entityId = entityConfig?.entity || entityConfig;
      const state = hass.states[entityId];
      if (!state) {
        console.warn("Entity not found in HA:", entityId);
        return;
      }

      const previous = this._lastEntityStates[entityId];
      const stateChanged =
        !previous ||
        previous.state !== state.state ||
        previous.last_changed !== state.last_changed;

      if (stateChanged) {
        changed = true;
        this._lastEntityStates[entityId] = {
          state: state.state,
          last_changed: state.last_changed,
        };
      }
    });

    if (!this._initialized || changed) {
      this._initialized = true;
      this._loading = true;
      this.render();
      this._updateHistory();
    } else {
      this.render();
    }
  }

  connectedCallback() {
    if (this._hass) {
      this.render();
    }
  }

  async _updateHistory() {
    if (!this._hass || !Array.isArray(this.config.entities)) {
      return;
    }

    const end = new Date();
    const start = new Date(end.getTime() - this.config.max_hours * 3600000);

    const historyPromises = this.config.entities.map((entityConfig) =>
      this._fetchEntityHistory(entityConfig, start, end),
    );

    const histories = await Promise.all(historyPromises);
    const allCalls = histories.flatMap((history, index) =>
      this._buildCallEntries(history, this.config.entities[index]),
    );

    this.calls = this._mergeCallEntries(allCalls);
    this._loading = false;
    this.render();
  }

  async _fetchEntityHistory(entityConfig, start, end) {
    const entityId = entityConfig?.entity || entityConfig;
    if (!this._hass || !entityId) {
      return [];
    }

    try {
      let url = `history/period/${start.toISOString()}?filter_entity_id=${entityId}`;
      url += `&end_time=${end.toISOString()}`;

      const result = await this._hass.callApi('GET', url);
      if (Array.isArray(result) && Array.isArray(result[0])) {
        return result[0];
      }
      return [];
    } catch (err) {
      const entityId = entityConfig?.entity || entityConfig;
      console.warn('Failed to fetch history for', entityId, err);
      return [];
    }
  }

  _buildCallEntries(history, entityConfig) {
    if (!Array.isArray(history)) {
      return [];
    }

    const entityId = entityConfig?.entity || entityConfig;
    const sorted = [...history].sort(
      (a, b) => new Date(a.last_changed) - new Date(b.last_changed),
    );

    const entries = [];
    for (let i = 0; i < sorted.length; i += 1) {
      const item = sorted[i];
      if (!['talking', 'dialing', 'ringing'].includes(item.state)) {
        continue;
      }

      if (item.state === 'ringing' && isRingingAnswered(sorted, i)) {
        continue;
      }

      const start = new Date(item.last_changed);
      const next = sorted[i + 1];
      const end = next ? new Date(next.last_changed) : new Date();
      const durationMs = Math.max(0, end - start);

      entries.push({
        id: `${entityId}-${item.state}-${item.last_changed || item.last_updated || ''}`,
        number: this._extractNumber(item, entityConfig),
        headline: this._extractNumber(item, entityConfig),
        label: this._extractLabel(item, entityConfig),
        state: item.state,
        time:
          item.state === 'talking'
            ? item.attributes?.accepted
              ? new Date(item.attributes.accepted)
              : start
            : item.state === 'dialing'
            ? item.attributes?.initiated
              ? new Date(item.attributes.initiated)
              : start
            : start,
        duration: formatDuration(durationMs),
      });
    }

    return entries;
  }

  _mergeCallEntries(entries) {
    const unique = {};
    const sorted = [...entries].sort((a, b) => b.time - a.time);
    sorted.forEach((entry) => {
      if (!unique[entry.id]) {
        unique[entry.id] = entry;
      }
    });
    return Object.values(unique).slice(0, this.config.max_calls);
  }

  _extractNumber(state, entityConfig) {
    const attributes = state.attributes || {};
    const candidateKeys = [
      entityConfig?.number_attribute,
      'with_name',
      'to_name',
      'with',
      'to',
      'from',
      'caller_id',
      'called_number',
      'number',
      'from_number',
      'to_number',
    ];

    for (const key of candidateKeys) {
      if (!key) {
        continue;
      }

      const value =
        key === 'friendly_name'
          ? state.attributes?.friendly_name
          : attributes[key];

      if (typeof value === 'string' && value.trim()) {
        const trimmed = value.trim();
        if (trimmed.toLowerCase() === 'unknown') {
          continue;
        }
        return trimmed;
      }
    }

    return state.entity_id;
  }

  _extractLabel(state, entityConfig) {
    const attributes = state.attributes || {};
    const callerName = attributes.with_name;
    const callerNumber = attributes.with;
    const dialToName = attributes.to_name;
    const dialToNumber = attributes.to;
    const dialFrom = attributes.from;
    const type = (attributes.type || '').toLowerCase();

    const caller =
      callerName && callerName.toLowerCase() !== 'unknown'
        ? callerName
        : callerNumber;
    const dialTarget =
      dialToName && dialToName.toLowerCase() !== 'unknown'
        ? dialToName
        : dialToNumber;

    let label = state.state;
    if (state.state === 'dialing') {
      if (type === 'outgoing' || dialTarget) {
        label = `Outgoing call to ${dialTarget || dialFrom || 'unknown'}`;
      } else {
        label = `Incoming call from ${dialFrom || 'unknown'}`;
      }
    } else if (state.state === 'ringing') {
      label = caller ? `Missed call from ${caller}` : 'Missed call';
    } else if (state.state === 'talking') {
      if (type === 'outgoing' || dialTarget) {
        label = `Outgoing call to ${dialTarget || caller || 'unknown'}`;
      } else {
        label = `Incoming call from ${caller || dialFrom || 'unknown'}`;
      }
    }

    if (!label || typeof label !== 'string' || !label.trim()) {
      label =
        entityConfig?.label ||
        attributes.call_type ||
        attributes.direction ||
        attributes.source ||
        attributes.destination ||
        state.state;
    }

    return label.trim();
  }

  render() {
    const title = this.config?.title || '📞 Call History';
    const body = this._loading
      ? '<div>Loading call history...</div>'
      : this.calls.length === 0
      ? '<div>No calls yet</div>'
      : `<ul style="list-style: none; padding: 0; margin: 0;">
            ${this.calls
              .map(
                (call) => `
              <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong style="display: block; margin-bottom: 4px;">${call.headline || 'Unknown'}</strong>
                <small>${call.label} · ${call.time.toLocaleTimeString()} · ${call.duration}</small>
              </li>
            `,
              )
              .join('')}
          </ul>`;

    this.innerHTML = `
      <ha-card header="${title}">
        <div style="padding: 12px; min-height: 120px;">
          ${body}
        </div>
      </ha-card>
    `;
  }
}

customElements.define('fritzbox-call-card', FritzboxCallCard);