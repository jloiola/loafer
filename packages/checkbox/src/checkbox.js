import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default class Checkbox extends LitElement {
  static get properties() {
    return {
      id: { type: String },
      name: { type: String },
      value: { type: String },
      checked: { type: Boolean },
      disabled: { type: Boolean },
      required: { type: Boolean },
      dirty: { type: Boolean, attribute: true, reflect: true },
    };
  }

  static get formAssociated() {
    return true;
  }

  static get styles() {
    return css`
      :host {
        cursor: default;
        user-select: none;
        display: flex;
        padding-right: calc(1.5em + 0.75rem);
        background-repeat: no-repeat;
        background-position: right calc(0.375em + 0.1875rem) center;
        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
      }

      :host([dirty]:invalid) {
        border-color: #dc3545;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
      }

      label {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem;
      }
      input[type='checkbox'] {
        margin: 0.25rem;
      }
    `;
  }

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.checked = false;
    this.disabled = false;
    this.required = false;
    this.value = 'on';
    this.dirty = false;
  }

  firstUpdated(keyValuePair) {
    super.firstUpdated(keyValuePairs);
    this.internals.setFormValue(this.value);
    this.validate();
    this.internals.form?.setAttribute('novalidate', 'novalidate');
    this.internals.form?.addEventListener(
      'submit',
      () => {
        this.dirty = true;
      },
      {
        once: true,
      }
    );
  }

  onchange() {
    this.checked = !this.checked;

    if (this.checked) {
      this.internals.setFormValue(this.value);
    } else {
      this.internals.setFormValue(undefined);
    }

    this.validate();
    this.dispatchEvent(new CustomEvent('change'));
  }

  onfocus() {
    this.dirty = true;
  }

  validate() {
    const input = this.shadowRoot.querySelector('input');
    if (!this.checked && this.required) {
      this.internals.setValidity(
        {
          valueMissing: true,
        },
        'Please check this box if you want to proceed',
        input
      );
    } else {
      this.internals.setValidity({});
    }
  }

  render() {
    return html`
      <label for=${ifDefined(this.id)}>
        <input
          id=${ifDefined(this.id)}
          type="checkbox"
          name=${ifDefined(this.name)}
          .value=${this.value}
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?dirty=${this.dirty}
          aria-checked=${this.checked}
          aria-required=${this.required}
          aria-labelledby=${this.id}
          @change=${this.onchange}
          @focus=${this.onfocus}
          novalidate
        />
        <slot></slot>
      </label>
    `;
  }
}
