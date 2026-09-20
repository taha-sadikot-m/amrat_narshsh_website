import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { indianPhoneDigits, normalizeIndianE164, phonesMatch } from './phone';

describe('normalizeIndianE164', () => {
  it('accepts 10-digit Indian mobiles', () => {
    assert.equal(normalizeIndianE164('9876543210'), '+919876543210');
  });

  it('accepts +91 and 91 prefixes', () => {
    assert.equal(normalizeIndianE164('+91 98765 43210'), '+919876543210');
    assert.equal(normalizeIndianE164('919876543210'), '+919876543210');
  });

  it('rejects non-Indian and short numbers', () => {
    assert.equal(normalizeIndianE164('+14155552671'), null);
    assert.equal(normalizeIndianE164('12345'), null);
    assert.equal(normalizeIndianE164(''), null);
  });
});

describe('phonesMatch', () => {
  it('matches stored 10-digit order phones with E.164 customers', () => {
    assert.equal(phonesMatch('+919876543210', '9876543210'), true);
    assert.equal(phonesMatch('+919876543210', '9876500000'), false);
  });
});

describe('indianPhoneDigits', () => {
  it('returns the national 10-digit number', () => {
    assert.equal(indianPhoneDigits('+919876543210'), '9876543210');
  });
});
