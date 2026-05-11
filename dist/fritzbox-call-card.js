import { LitElement as e, html as t } from "lit";
//#region src/editor.js
var n = class n extends e {
	static properties = {
		hass: {},
		_config: {}
	};
	setConfig(e) {
		this._config = {
			title: "",
			entities: [],
			max_calls: 10,
			...e
		};
	}
	static getConfigForm() {
		return { schema: [
			{
				name: "title",
				selector: { text: {} }
			},
			{
				name: "entities",
				selector: { entity: { multiple: !0 } }
			},
			{
				name: "max_calls",
				selector: { number: {
					min: 1,
					max: 50,
					step: 1
				} }
			}
		] };
	}
	render() {
		return !this.hass || !this._config ? t`` : t`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${n.getConfigForm().schema}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
	}
	_valueChanged(e) {
		let t = e.detail.value;
		this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: t },
			bubbles: !0,
			composed: !0
		}));
	}
};
customElements.define("fritzbox-call-card-editor", n);
//#endregion
//#region src/utils.js
function r(e) {
	if (!Number.isFinite(e) || e < 0) return "unknown";
	let t = Math.floor(e / 1e3), n = Math.floor(t / 60), r = t % 60;
	return n > 0 ? `${n}m ${r.toString().padStart(2, "0")}s` : `${r}s`;
}
function i(e, t) {
	for (let n = t + 1; n < e.length; n += 1) {
		if (e[n].state === "talking") return !0;
		if (e[n].state === "ringing" || e[n].state === "dialing") return !1;
	}
	return !1;
}
//#endregion
//#region src/main.js
var a = class extends HTMLElement {
	static getConfigElement() {
		return document.createElement("fritzbox-call-card-editor");
	}
	static getStubConfig() {
		return {
			entities: [],
			max_calls: 10,
			hours_to_show: 24,
			title: "📞 Call History"
		};
	}
	setConfig(e) {
		if (!e || !Array.isArray(e.entities)) throw Error("Invalid configuration: 'entities' must be an array.");
		this.config = {
			title: e.title || "📞 Call History",
			max_calls: Number.isInteger(e.max_calls) ? e.max_calls : parseInt(e.max_calls, 10) || 10,
			hours_to_show: Number.isFinite(e.hours_to_show) ? e.hours_to_show : parseInt(e.hours_to_show, 10) || 24,
			...e
		}, this.calls = [], this._lastEntityStates = {}, this._loading = !1, this._initialized = !1;
	}
	set hass(e) {
		if (this._hass = e, !this.config || !Array.isArray(this.config.entities)) return;
		let t = !1;
		this.config.entities.forEach((n) => {
			let r = n?.entity || n, i = e.states[r];
			if (!i) {
				console.warn("Entity not found in HA:", r);
				return;
			}
			let a = this._lastEntityStates[r];
			(!a || a.state !== i.state || a.last_changed !== i.last_changed) && (t = !0, this._lastEntityStates[r] = {
				state: i.state,
				last_changed: i.last_changed
			});
		}), !this._initialized || t ? (this._initialized = !0, this._loading = !0, this.render(), this._updateHistory()) : this.render();
	}
	connectedCallback() {
		this._hass && this.render();
	}
	async _updateHistory() {
		if (!this._hass || !Array.isArray(this.config.entities)) return;
		let e = /* @__PURE__ */ new Date(), t = /* @__PURE__ */ new Date(e.getTime() - this.config.hours_to_show * 36e5), n = this.config.entities.map((n) => this._fetchEntityHistory(n, t, e)), r = (await Promise.all(n)).flatMap((e, t) => this._buildCallEntries(e, this.config.entities[t]));
		this.calls = this._mergeCallEntries(r), this._loading = !1, this.render();
	}
	async _fetchEntityHistory(e, t, n) {
		let r = e?.entity || e;
		if (!this._hass || !r) return [];
		try {
			let e = `history/period/${t.toISOString()}?filter_entity_id=${r}`;
			e += `&end_time=${n.toISOString()}`;
			let i = await this._hass.callApi("GET", e);
			return Array.isArray(i) && Array.isArray(i[0]) ? i[0] : [];
		} catch (t) {
			let n = e?.entity || e;
			return console.warn("Failed to fetch history for", n, t), [];
		}
	}
	_buildCallEntries(e, t) {
		if (!Array.isArray(e)) return [];
		let n = t?.entity || t, a = [...e].sort((e, t) => new Date(e.last_changed) - new Date(t.last_changed)), o = [];
		for (let e = 0; e < a.length; e += 1) {
			let s = a[e];
			if (![
				"talking",
				"dialing",
				"ringing"
			].includes(s.state) || s.state === "ringing" && i(a, e)) continue;
			let c = new Date(s.last_changed), l = a[e + 1], u = l ? new Date(l.last_changed) : /* @__PURE__ */ new Date(), d = Math.max(0, u - c);
			o.push({
				id: `${n}-${s.state}-${s.last_changed || s.last_updated || ""}`,
				number: this._extractNumber(s, t),
				headline: this._extractNumber(s, t),
				label: this._extractLabel(s, t),
				state: s.state,
				time: s.state === "talking" ? s.attributes?.accepted ? new Date(s.attributes.accepted) : c : s.state === "dialing" && s.attributes?.initiated ? new Date(s.attributes.initiated) : c,
				duration: r(d)
			});
		}
		return o;
	}
	_mergeCallEntries(e) {
		let t = {};
		return [...e].sort((e, t) => t.time - e.time).forEach((e) => {
			t[e.id] || (t[e.id] = e);
		}), Object.values(t).slice(0, this.config.max_calls);
	}
	_extractNumber(e, t) {
		let n = e.attributes || {}, r = [
			t?.number_attribute,
			"with_name",
			"to_name",
			"with",
			"to",
			"from",
			"caller_id",
			"called_number",
			"number",
			"from_number",
			"to_number"
		];
		for (let t of r) {
			if (!t) continue;
			let r = t === "friendly_name" ? e.attributes?.friendly_name : n[t];
			if (typeof r == "string" && r.trim()) {
				let e = r.trim();
				if (e.toLowerCase() === "unknown") continue;
				return e;
			}
		}
		return e.entity_id;
	}
	_extractLabel(e, t) {
		let n = e.attributes || {}, r = n.with_name, i = n.with, a = n.to_name, o = n.to, s = n.from, c = (n.type || "").toLowerCase(), l = r && r.toLowerCase() !== "unknown" ? r : i, u = a && a.toLowerCase() !== "unknown" ? a : o, d = e.state;
		return e.state === "dialing" ? d = c === "outgoing" || u ? `Outgoing call to ${u || s || "unknown"}` : `Incoming call from ${s || "unknown"}` : e.state === "ringing" ? d = l ? `Missed call from ${l}` : "Missed call" : e.state === "talking" && (d = c === "outgoing" || u ? `Outgoing call to ${u || l || "unknown"}` : `Incoming call from ${l || s || "unknown"}`), (!d || typeof d != "string" || !d.trim()) && (d = t?.label || n.call_type || n.direction || n.source || n.destination || e.state), d.trim();
	}
	render() {
		let e = this.config?.title || "📞 Call History", t = this._loading ? "<div>Loading call history...</div>" : this.calls.length === 0 ? "<div>No calls yet</div>" : `<ul style="list-style: none; padding: 0; margin: 0;">
            ${this.calls.map((e) => `
              <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong style="display: block; margin-bottom: 4px;">${e.headline || "Unknown"}</strong>
                <small>${e.label} · ${e.time.toLocaleTimeString()} · ${e.duration}</small>
              </li>
            `).join("")}
          </ul>`;
		this.innerHTML = `
      <ha-card header="${e}">
        <div style="padding: 12px; min-height: 120px;">
          ${t}
        </div>
      </ha-card>
    `;
	}
};
customElements.define("fritzbox-call-card", a), window.customCards.push({
	type: "fritzbox-call-card",
	name: "Fritzbox Call Card",
	preview: !1,
	description: "Fritzbox call card editor",
	documentationURL: "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card"
});
//#endregion
