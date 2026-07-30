// main.js
import './editor.js';
import { formatDuration, isRingingAnswered } from './utils.js';
import en from '../translations/en.json';
import de from '../translations/de.json';
import { FritzboxVoicemail } from './voicemail.js';

const DEFAULT_TITLE = 'Fritz!Box Calls';
const DEFAULT_MAX_CALLS = 10;
const DEFAULT_MAX_HOURS = 24;
const DEFAULT_FONT_SIZE = 13;
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 24;
const ACTIVE_CALL_STATES = new Set(['talking', 'dialing', 'ringing']);

class FritzboxCallCard extends HTMLElement {
  langs = { en, de };

  static getConfigElement() {
    return document.createElement("fritzbox-call-card-editor");
  }

  static getStubConfig() {
    return {
      call_entities: [],
      voicemail_entity: null,
      max_calls: DEFAULT_MAX_CALLS,
      max_hours: DEFAULT_MAX_HOURS,
      font_size: null,
      title: DEFAULT_TITLE,
    };
  }

  setConfig(config) {
    if (!config || !Array.isArray(config.call_entities)) {
      throw new Error("Invalid configuration: 'call_entities' must be an array.");
    }

    const parsedMaxCalls = this._parseInteger(config.max_calls, DEFAULT_MAX_CALLS);
    const parsedMaxHours = this._parseInteger(config.max_hours, DEFAULT_MAX_HOURS);
    const parsedFontSize = this._parseOptionalFontSize(config.font_size);

    this.config = {
      ...config,
      title: config.title || DEFAULT_TITLE,
      voicemail_entity: config.voicemail_entity || null,
      max_calls: parsedMaxCalls,
      max_hours: parsedMaxHours,
      font_size: parsedFontSize,
    };

    this.calls = [];
    this._lastEntityStates = {};
    this._loading = false;
    this._initialized = false;
    this._filter = 'all';
    this.voicemail = new FritzboxVoicemail(this);
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.config || !Array.isArray(this.config.call_entities)) return;

    let changed = false;
    for (const entityConfig of this.config.call_entities) {
      const entityId = this._resolveEntityId(entityConfig);
      const state = hass.states[entityId];
      if (!state) continue;

      const previous = this._lastEntityStates[entityId];
      if (!previous || previous.state !== state.state || previous.last_changed !== state.last_changed) {
        changed = true;
        this._lastEntityStates[entityId] = { state: state.state, last_changed: state.last_changed };
      }
    }

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
    if (this._hass) this.render();
  }

  async _updateHistory() {
    if (!this._hass || !Array.isArray(this.config.call_entities)) return;

    const end = new Date();
    const maxHoursMs = this.config.max_hours * 60 * 60 * 1000;
    const start = new Date(end.getTime() - maxHoursMs);

    const histories = await Promise.all(
      this.config.call_entities.map((entityConfig) =>
        this._fetchEntityHistory(entityConfig, start, end),
      ),
    );

    const allCalls = histories.flatMap((history, index) =>
      this._buildCallEntries(history, this.config.call_entities[index]),
    );

    this.calls = this._mergeCallEntries(allCalls);
    this._loading = false;
    this.render();
  }

  async _fetchEntityHistory(entityConfig, start, end) {
    const entityId = this._resolveEntityId(entityConfig);
    if (!this._hass || !entityId) return [];

    try {
      const result = await this._hass.callApi('GET', `history/period/${start.toISOString()}?filter_entity_id=${entityId}&end_time=${end.toISOString()}`);
      return Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
    } catch {
      return [];
    }
  }

  _buildCallEntries(history, entityConfig) {
    if (!Array.isArray(history)) return [];

    const entityId = this._resolveEntityId(entityConfig);
    const sorted = [...history].sort((a, b) => new Date(a.last_changed) - new Date(b.last_changed));
    const entries = [];

    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      if (!ACTIVE_CALL_STATES.has(item.state)) continue;
      if (item.state === 'ringing' && isRingingAnswered(sorted, i)) continue;

      const start = new Date(item.last_changed);
      const end = this._getHistoryEndTime(sorted, i, entityId);
      entries.push({
        id: `${entityId}-${item.state}-${item.last_changed || item.last_updated || ''}`,
        number: this._extractNumber(item),
        headline: this._extractNumber(item),
        label: this._extractLabel(item, entityConfig),
        state: item.state,
        type: item.attributes?.type || '',
        time: this._resolveCallTime(item, start),
        duration: formatDuration(Math.max(0, end - start)),
      });
    }

    return entries;
  }

  _mergeCallEntries(entries) {
    const unique = {};
    [...entries]
      .sort((a, b) => b.time - a.time)
      .forEach((entry) => {
        if (!unique[entry.id]) {
          unique[entry.id] = entry;
        }
      });

    return Object.values(unique).slice(0, this.config.max_calls);
  }

  _getHistoryEndTime(sorted, index, entityId) {
    const item = sorted[index];
    for (let j = index + 1; j < sorted.length; j++) {
      if (sorted[j].state !== item.state) return new Date(sorted[j].last_changed || sorted[j].last_updated || Date.now());
    }

    const cur = this._hass?.states?.[entityId];
    return cur && !ACTIVE_CALL_STATES.has(cur.state)
      ? new Date(cur.last_changed || cur.last_updated || Date.now())
      : new Date();
  }

  _resolveCallTime(item, fallbackDate) {
    if (item.state === 'talking' && item.attributes?.accepted) {
      return new Date(item.attributes.accepted);
    }
    if (item.state === 'dialing' && item.attributes?.initiated) {
      return new Date(item.attributes.initiated);
    }
    return fallbackDate;
  }

  _extractNumber(state) {
    const attrs = state.attributes || {};
    const incomeKeys = ['from_name', 'from', 'with_name', 'to', 'from', 'caller_id', 'called_number', 'number', 'from_number', 'to_number'];
    const outgoKeys = ['to_name', 'with_name', 'with', 'to', 'from', 'caller_id', 'called_number', 'number', 'from_number', 'to_number'];
    const keys = state.state === 'ringing' ? incomeKeys : outgoKeys;

    for (const k of keys) {
      if (!k) continue;
      const val = attrs[k];
      if (typeof val === 'string' && val.trim() && val.trim().toLowerCase() !== 'unknown') return val.trim();
    }

    return state.entity_id;
  }

  _extractLabel(state, entityConfig) {
    const { attributes: attrs = {}, state: currentState } = state || {};
    const type = String(attrs.type || '').toLowerCase();

    const hasValidName = (val) =>
      typeof val === 'string' &&
      val.trim() !== '' &&
      val.toLowerCase() !== 'unknown';

    const caller = hasValidName(attrs.from_name)
      ? attrs.from_name
      : hasValidName(attrs.with_name)
      ? attrs.with_name
      : attrs.from || attrs.with;

    const isKnownTarget = attrs.to_name && attrs.to_name.toLowerCase() !== 'unknown';
    const target = isKnownTarget ? attrs.to_name : attrs.to;

    const isOutgoing = type === 'outgoing' || !!target;
    const localizedState = this._localize(`state.${currentState}`);
    let label = localizedState ?? currentState;

    if (state.state === 'dialing') {
      label = this._formatTranslation(
        this._localize(isOutgoing ? 'call.outgoing_to' : 'call.incoming_from'),
        { name: target || attrs.from || this._localize('common.unknown') },
      );
    } else if (state.state === 'ringing') {
      label = caller
        ? this._formatTranslation(this._localize('call.missed_from'), { name: caller })
        : this._localize('call.missed_call');
    } else if (state.state === 'talking') {
      label = this._formatTranslation(
        this._localize(isOutgoing ? 'call.outgoing_to' : 'call.incoming_from'),
        {
          name: isOutgoing
            ? target || caller
            : (caller || attrs.from) || this._localize('common.unknown'),
        },
      );
    }

    return (label || entityConfig?.label || attrs.call_type || attrs.direction || attrs.source || attrs.destination || state.state).trim();
  }

  _formatTranslation(template, values = {}) {
    return typeof template === 'string' ? template.replace(/\{(\w+)\}/g, (_, k) => typeof values[k] !== 'undefined' ? values[k] : `{${k}}`) : template;
  }

  _iconForCall(call) {
    const isMissed = call.state === 'ringing';
    const isOutgoing = call.type === 'outgoing' || call.state === 'dialing';
    const color = isMissed ? 'var(--error-color, #e53935)' : isOutgoing ? 'var(--primary-color, #1e88e5)' : 'var(--success-color, #43a047)';
    return `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:12px; flex-shrink:0;">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.05.37 2.07.73 3.03a2 2 0 0 1-.45 2.11L8.91 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.36 1.98.61 3.03.73A2 2 0 0 1 22 16.92z"/>
      </svg>
    `;
  }

  _setFilter(filter) {
    if (this._filter === filter) return;
    this._filter = filter;
    this.render();
  }

  _resolveEntityId(entityConfig) {
    return entityConfig?.entity || entityConfig;
  }

  _parseInteger(value, fallback) {
    const parsed = Number.isInteger(value) ? value : parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  _parseOptionalFontSize(value) {
    if (value === null || typeof value === 'undefined' || value === '') {
      return null;
    }

    const parsed = this._parseInteger(value, null);
    if (!Number.isFinite(parsed)) return null;
    return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, parsed));
  }

  _getBaseFontSize() {
    return this._parseOptionalFontSize(this.config?.font_size) ?? DEFAULT_FONT_SIZE;
  }

  _isToday(date) {
    const now = new Date();
    return date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate();
  }

  _formatCallTimestamp(date) {
    const locale = this._hass?.locale?.language;
    const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    if (this._isToday(date)) {
      return time;
    }

    const dateText = date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return `${dateText} ${time}`;
  }

  _getFilteredCalls() {
    if (this._filter === 'all') return this.calls;

    return this.calls.filter((call) => {
      if (this._filter === 'missed') return call.state === 'ringing';
      if (this._filter === 'outgoing') return call.type === 'outgoing' || call.state === 'dialing';
      if (this._filter === 'incoming') return !(call.type === 'outgoing' || call.state === 'dialing') && call.state !== 'ringing';
      return true;
    });
  }

  _localize(key, lang = this._hass?.locale?.language || 'en') {
    const code = lang.split('-')[0];
    let a = this.langs[code] || this.langs['en'];
    for (const k of key.split('.')) {
      if (!a || typeof a[k] === 'undefined') return key.split('.')[0] === 'weather_state' ? key.split('.')[1] : this.langs['en']?.[key.split('.')[0]]?.[key.split('.')[1]] || key;
      a = a[k];
    }
    return a;
  }

  render() {
    const title = this.config?.title || this._localize('common.call_history');
    const filteredCalls = this._getFilteredCalls();
    const baseFontSize = this._getBaseFontSize();
    const contentStyle = `font-size:${baseFontSize}px;`;

    const chipBase = 'padding:0.3em 0.8em; border-radius:12px; border:1px solid var(--divider-color, #ddd); background:var(--card-background-color, #fff); color:var(--primary-text-color); cursor:pointer; font-size:0.85em; font-weight:500; transition: all 0.2s;';
    const chipSel = 'background:var(--primary-color, #1e88e5); color:#fff; border-color:var(--primary-color, #1e88e5);';

    if (this._loading) {
      this.innerHTML = `<ha-card header="${title}"><div style="padding:16px; min-height:80px; color:var(--secondary-text-color); ${contentStyle}">${this._localize('common.loading') || 'Loading...'}</div></ha-card>`;
      return;
    }

    this.innerHTML = `
      <ha-card header="${title}">
        <div style="padding:0 16px 12px 16px; display:flex; flex-direction:column; gap:8px; ${contentStyle}">
          ${this.config?.voicemail_entity ? `<div>${this.voicemail.render(baseFontSize)}</div>` : ''}
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="fbc-chip" data-filter="all" style="${chipBase} ${this._filter === 'all' ? chipSel : ''}">${this._localize('common.all') || 'All'}</button>
            <button class="fbc-chip" data-filter="missed" style="${chipBase} ${this._filter === 'missed' ? chipSel : ''}">${this._localize('call.missed') || 'Missed'}</button>
            <button class="fbc-chip" data-filter="outgoing" style="${chipBase} ${this._filter === 'outgoing' ? chipSel : ''}">${this._localize('call.outgoing') || 'Outgoing'}</button>
            <button class="fbc-chip" data-filter="incoming" style="${chipBase} ${this._filter === 'incoming' ? chipSel : ''}">${this._localize('call.incoming') || 'Incoming'}</button>
          </div>
          ${filteredCalls.length === 0 ? `<div style="padding:8px 0; color:var(--secondary-text-color);">${this._localize('common.no_calls')}</div>` : ''}
          <ul style="list-style:none; padding:0; margin:0;">
            ${filteredCalls.map(c => `
              <li style="padding:6px 0; border-bottom:1px solid var(--divider-color, #eee); display:flex; align-items:center;">
                ${this._iconForCall(c)}
                <div style="flex-grow:1; min-width:0;">
                  <strong style="display:block; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.headline || this._localize('common.unknown')}</strong>
                  <small style="display:block; font-size:0.85em; color:var(--secondary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.label} · ${this._formatCallTimestamp(c.time)} · ${c.duration}</small>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      </ha-card>
    `;

    this.querySelectorAll('.fbc-chip').forEach((el) => {
      el.onclick = (e) => this._setFilter(e.currentTarget.dataset.filter);
    });
    if (this.voicemail) this.voicemail.attachEvents(this);
  }
}
customElements.define('fritzbox-call-card', FritzboxCallCard);