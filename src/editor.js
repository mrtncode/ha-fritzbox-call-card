import { LitElement, html } from "lit";

class FritzboxCallCardEditor extends LitElement {
  static properties = {
    hass: {},
    _config: {},
  };

  setConfig(config) {
    this._config = {
      title: "",
      entities: [],
      max_calls: 10,
      ...config,
    };
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
          name: "entities",
          selector: {
            entity: {
              multiple: true,
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
      ],
    };
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
console.log("EDITOR!!")
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