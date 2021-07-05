import { html, fixture, expect } from '@open-wc/testing';

import '../checkbox.js';

describe('Checkbox', () => {
  it('has no default title', async () => {
    const el = await fixture(html`<lfr-checkbox></lfr-checkbox>`);

    expect(el.title).to.equal('');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html`<lfr-checkbox></lfr-checkbox>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
