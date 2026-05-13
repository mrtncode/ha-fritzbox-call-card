import './editor.js';
import { formatDuration, isRingingAnswered } from './utils.js';
import en from '../translations/en.json';

class FritzboxCallCard extends HTMLElement {
  langs = { en };

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
      const end = this._getHistoryEndTime(sorted, i, entityId);
      const durationMs = Math.max(0, end - start);

      entries.push({
        id: `${entityId}-${item.state}-${item.last_changed || item.last_updated || ''}`,
        number: this._extractNumber(item, entityConfig),
        headline: this._extractNumber(item, entityConfig),
        label: this._extractLabel(item, entityConfig),
        state: item.state,
        type: item.attributes?.type || '',
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

  _getHistoryEndTime(sorted, index, entityId) {
    const item = sorted[index];
    for (let j = index + 1; j < sorted.length; j += 1) {
      if (sorted[j].state !== item.state) {
        return new Date(sorted[j].last_changed || sorted[j].last_updated || Date.now());
      }
    }

    const currentState = this._hass?.states?.[entityId];
    if (currentState && !['talking', 'dialing', 'ringing'].includes(currentState.state)) {
      return new Date(currentState.last_changed || currentState.last_updated || Date.now());
    }

    return new Date();
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

    let label = this._localize(`state.${state.state}`) || state.state;
    if (state.state === 'dialing') {
      if (type === 'outgoing' || dialTarget) {
        label = this._formatTranslation(
          this._localize('call.outgoing_to'),
          { name: dialTarget || dialFrom || this._localize('common.unknown') },
        );
      } else {
        label = this._formatTranslation(
          this._localize('call.incoming_from'),
          { name: dialFrom || this._localize('common.unknown') },
        );
      }
    } else if (state.state === 'ringing') {
      label = caller
        ? this._formatTranslation(this._localize('call.missed_from'), {
            name: caller,
          })
        : this._localize('call.missed_call');
    } else if (state.state === 'talking') {
      if (type === 'outgoing' || dialTarget) {
        label = this._formatTranslation(
          this._localize('call.outgoing_to'),
          { name: dialTarget || caller || this._localize('common.unknown') },
        );
      } else {
        label = this._formatTranslation(
          this._localize('call.incoming_from'),
          { name: caller || dialFrom || this._localize('common.unknown') },
        );
      }
    }

    if (!label || typeof label !== 'string' || !label.trim()) {
      label =
        entityConfig?.label ||
        attributes.call_type ||
        attributes.direction ||
        attributes.source ||
        attributes.destination ||
        this._localize(`state.${state.state}`) || state.state;
    }

    return label.trim();
  }

  _formatTranslation(template, values = {}) {
    if (typeof template !== 'string') {
      return template;
    }
    return template.replace(/\{(\w+)\}/g, (_, key) =>
      typeof values[key] !== 'undefined' ? values[key] : `{${key}}`,
    );
  }

  _iconForCall(call) {
    const isMissed = call.state === 'ringing';
    const isOutgoing = call.type === 'outgoing' || call.state === 'dialing';
    const color = isMissed ? '#e53935' : isOutgoing ? '#1e88e5' : '#43a047';
    const title = isMissed ? this._localize('call.missed') || 'Missed' : isOutgoing ? this._localize('call.outgoing') || 'Outgoing' : this._localize('call.incoming') || 'Incoming';
    return `
      <svg width="21" height="21" viewBox="0 0 24 24" aria-label="${title}" role="img" style="vertical-align:middle; margin-right:8px;">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.05.37 2.07.73 3.03a2 2 0 0 1-.45 2.11L8.91 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.36 1.98.61 3.03.73A2 2 0 0 1 22 16.92z" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  _localize(key, lang = this._hass?.locale?.language || 'en') {
    console.log("hass lang", this._hass?.locale?.language);
    const code = lang.split('-')[0];
    const keys = key.split('.');

    let a = this.langs[code];
    if (!a) a = this.langs['en'];

    for (const k of keys) {
      if (typeof a[k] === 'undefined') {
        if (keys[0] === 'weather_state') return keys[1];
        return this.langs['en'][keys[0]][keys[1]];
      }
      a = a[k];
    }
    return a;
  }

  render() {
    const title = this.config?.title || this._localize('common.call_history');
    const body = this._loading
      ? `<div>${this._localize('common.loading')}</div>`
      : this.calls.length === 0
      ? `<div>${this._localize('common.no_calls')}</div>`
      : `<ul style="list-style: none; padding: 0; margin: 0;">
            ${this.calls
              .map(
                (call) => `
              <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                ${this._iconForCall(call)}
                <div style="">
                  <strong style="display: block; margin-bottom: 4px;">${call.headline || this._localize('common.unknown')}</strong>
                  <small style="display:block;">${call.label} · ${call.time.toLocaleTimeString()} · ${call.duration}</small>
                </div>
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