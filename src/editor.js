import { LitElement, html, css } from "lit";
import en from "../translations/en.json";
import de from '../translations/de.json';


class FritzboxCallCardEditor extends LitElement {
  static properties = {
    hass: {},
    _config: {},
  };

  static langs = { en, de };

  static styles = css`
    .integration-info {
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      font-size: 13px;
      line-height: 1.4;
      border-left: 4px solid var(--primary-color, #03a9f4);
    }
    .integration-info a {
      color: var(--primary-color, #03a9f4);
      font-weight: 500;
      text-decoration: none;
    }
    .integration-info a:hover {
      text-decoration: underline;
    }
  `;

  setConfig(config) {
    this._config = {
      title: "",
      call_entities: [],
      voicemail_entity: "",
      font_size: null,
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
                  integration: "fritzbox_callmonitor",
                },
              ],
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
                  integration: "fritzbox_voicemail",
                },
              ],
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
          name: "font_size",
          selector: {
            number: {
              min: 10,
              max: 24,
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
      font_size: "editor.font_size",
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

    const language = this._config?.language || this.hass?.locale?.language || "en";

    const loc = (key) => FritzboxCallCardEditor._localize(key, language);

    return html`
    <!-- Custom HTML to show integration infos -->
      <div class="integration-info">
        <strong>${loc("editor.info.header")}</strong>
        <ul>
          <li .innerHTML=${loc("editor.info.call_entities")}></li>
          <li .innerHTML=${loc("editor.info.voicemail_entity")}></li>
        </ul>
      </div>

      <!-- HA native form -->
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
  name: "FRITZ!Box Call Card",
  preview: true,
  description: "Fritzbox call card editor",
  documentationURL:
    "https://github.com/mrtncode/ha-fritzbox-call-card",
});