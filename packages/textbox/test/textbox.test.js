import { html, fixture, expect } from '@open-wc/testing';

import '../textbox.js';

describe('Textbox', () => {
  it('has no default title', async () => {
    const el = await fixture(html`<lfr-textbox></lfr-textbox>`);

    expect(el.title).to.equal('');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html`<lfr-textbox></lfr-textbox>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
