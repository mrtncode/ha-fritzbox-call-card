import { LitElement, html } from "lit";
import en from "../translations/en.json";

class FritzboxCallCardEditor extends LitElement {
  static properties = {
    hass: {},
    _config: {},
  };

  static langs = { en };

  setConfig(config) {
    this._config = {
      title: "",
      call_entities: [],
      voicemail_entity: "",
      max_calls: 10,
      max_hours: 24,
      ...config,
    };
  }

  static _localize(key, lang = this._hass?.locale?.language || "en") {
    const code = String(lang || "en").split("-")[0];
    const keys = key.split(".");
    let a = this.langs[code] || this.langs["en"];

    for (const k of keys) {
      if (typeof a[k] === "undefined") {
        return this.langs["en"]?.[keys[0]]?.[keys[1]] || "";
      }
      a = a[k];
    }

    return a;
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "title",
          selector: {
            text: {},
          },
        },
        {
          name: "call_entities",
          selector: {
            entity: {
              multiple: true,
              filter: [
                {
                  domain: ["sensor"],
                  integration: "fritzbox_callmonitor" 
                }
              ]
            },
          },
        },
        {
          name: "voicemail_entity",
          selector: {
            entity: {
              multiple: false,
              filter: [
                {
                  domain: ["sensor"],
                  integration: "fritzbox_voicemail"
                }
              ]
            },
          },
        },
        {
          name: "max_calls",
          selector: {
            number: {
              min: 1,
              max: 50,
              step: 1,
            },
          },
        },
        {
          name: "max_hours",
          selector: {
            number: {
              min: 1,
              max: 72,
              step: 1,
            },
          },
        },
      ],
    };
  }

  _computeLabel(schema) {
    const language =
      this._config?.language || this.hass?.locale?.language || "en";

    const keys = {
      title: "editor.title",
      call_entities: "editor.call_entities",
      voicemail_entity: "editor.voicemail_entity",
      device: "editor.device",
      language: "editor.language",
      max_calls: "editor.max_calls",
      max_hours: "editor.max_hours",
    };

    return keys[schema.name]
      ? FritzboxCallCardEditor._localize(keys[schema.name], language)
      : undefined;
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${FritzboxCallCardEditor.getConfigForm().schema}
        .computeLabel=${this._computeLabel.bind(this)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  _valueChanged(ev) {
    const config = ev.detail.value;

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define(
  "fritzbox-call-card-editor",
  FritzboxCallCardEditor,
);

window.customCards = window.customCards || [];

window.customCards.push({
  type: "fritzbox-call-card",
  name: "Fritzbox Call Card",
  preview: false,
  description: "Fritzbox call card editor",
  documentationURL:
    "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card",
});