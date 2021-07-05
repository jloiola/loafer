import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default class Textbox extends LitElement {
  static get properties() {
    return {
      id: { type: String },
      name: { type: String },
      value: { type: String, attribute: true, reflect: true },
      label: { type: String },
      disabled: { type: Boolean },
      required: { type: Boolean },
      dirty: { type: Boolean, attribute: true, reflect: true },
      pristine: { type: Boolean, attribute: true, reflect: true },
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

      :host(:valid) {
        border-color: #198754;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
      }
/*
      :host([pristine]:valid) {
        border-color: inherit;
        background-image: none;
      } */

      label {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem;
      }
    `;
  }

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.disabled = false;
    this.required = false;
    this.value = this.value !== undefined ? this.value : '';
    this.dirty = false;
    this.pristine = true;
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
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
    this.input = this.shadowRoot.querySelector('input');
    this.internals.setFormValue(this.value);
    this.validate();
  }

  onchange(e) {
  }

  onfocus() {

  }

  onblur() {
    this.dirty = true;
    this.validate();
  }

  oninput(e) {
    this.value = this.input.value;
    this.internals.setFormValue(this.value);
    if(this.dirty) {
      this.validate();
    }
  }

  validate() {
    if (!this.value && this.required) {
      this.internals.setValidity(
        {
          valueMissing: true,
        },
        'This field is required',
        this.input
      );
    } else {
      this.internals.setValidity({});
    }
  }

  render() {
    return html`
      <label for=${ifDefined(this.id)}> ${this.label} </label>
      <input
        id=${ifDefined(this.id)}
        type="text"
        name=${ifDefined(this.name)}
        .value=${this.value}
        ?disabled=${this.disabled}
        ?required=${this.required}
        ?dirty=${this.dirty}
        ?pristine=${this.pristine}
        aria-required=${this.required}
        aria-labelledby=${this.id}
        @change=${this.onchange}
        @focus=${this.onfocus}
        @blur=${this.onblur}
        @input=${this.oninput}
        novalidate
      />
    `;
  }
}
