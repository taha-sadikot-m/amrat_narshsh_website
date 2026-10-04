import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { blendCode, blendDisplayName, packingNote, parseBlendCode } from './apna-mix';

describe('apna mix', () => {
  it('builds one of 27 blend codes and a packing note from the customer name', () => {
    const code = blendCode({ spice: 'high', sour: 'low', sweet: 'medium' });
    assert.equal(code, 'spice-high-sour-low-sweet-medium');
    assert.deepEqual(parseBlendCode(code), { spice: 'high', sour: 'low', sweet: 'medium' });
    assert.equal(parseBlendCode('spice-off-sour-low-sweet-medium'), null);
    const name = blendDisplayName('Priya', 'Khaman Instant Mix', 'high');
    assert.equal(name, "Priya's Teekha Khaman Mix");
    assert.equal(packingNote(name, { spice: 'high', sour: 'low', sweet: 'medium' }), 'Priya\'s Teekha Khaman Mix — spice high, sour low, sweet medium');
  });

  it('falls back when the customer has no name', () => {
    assert.equal(blendDisplayName(null, 'Bhajiya Instant Mix', 'low'), "Your Narma Bhajiya Mix");
  });
});
