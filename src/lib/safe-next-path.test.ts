import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { safeNextPath } from './safe-next-path';

describe('safeNextPath', () => {
  it('allows same-origin relative paths', () => {
    assert.equal(safeNextPath('/checkout'), '/checkout');
    assert.equal(safeNextPath('/account/orders'), '/account/orders');
  });

  it('rejects open redirects', () => {
    assert.equal(safeNextPath('https://evil.com'), '/account');
    assert.equal(safeNextPath('//evil.com'), '/account');
    assert.equal(safeNextPath('/\\evil.com'), '/account');
    assert.equal(safeNextPath(''), '/account');
  });

  it('does not send authenticated users back to login', () => {
    assert.equal(safeNextPath('/login?next=/shop'), '/account');
  });
});
