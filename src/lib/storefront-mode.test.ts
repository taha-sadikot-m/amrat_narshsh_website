import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isFaraliProduct,
  isRainSnack,
  kolkataDateKey,
  orderProductsForMode,
  rainingFromCurrent,
  shelfForMode,
  resolveStorefrontMode,
} from './storefront-mode';

const FARALI = ['2026-10-06', '2026-10-22'];

describe('resolveStorefrontMode', () => {
  it('uses tiffin before 11:00 in Kolkata', () => {
    const mode = resolveStorefrontMode({
      now: new Date('2026-10-04T04:30:00.000Z'),
      faraliDates: FARALI,
      raining: false,
    });
    assert.equal(mode, 'tiffin');
  });

  it('uses nashta from 16:00 until 19:00 in Kolkata', () => {
    const mode = resolveStorefrontMode({
      now: new Date('2026-10-04T11:00:00.000Z'),
      faraliDates: FARALI,
      raining: false,
    });
    assert.equal(mode, 'nashta');
    const ended = resolveStorefrontMode({
      now: new Date('2026-10-04T13:30:00.000Z'),
      faraliDates: FARALI,
      raining: false,
    });
    assert.equal(ended, 'default');
  });

  it('puts farali ahead of rain and time of day', () => {
    const mode = resolveStorefrontMode({
      now: new Date('2026-10-06T11:00:00.000Z'),
      faraliDates: FARALI,
      raining: true,
    });
    assert.equal(mode, 'farali');
    assert.equal(kolkataDateKey(new Date('2026-10-06T11:00:00.000Z')), '2026-10-06');
  });

  it('uses rain when it is raining and the day is not farali', () => {
    const mode = resolveStorefrontMode({
      now: new Date('2026-10-04T08:00:00.000Z'),
      faraliDates: FARALI,
      raining: true,
    });
    assert.equal(mode, 'rain');
  });
});

describe('rainingFromCurrent', () => {
  it('is raining only when precipitation is above zero', () => {
    assert.equal(rainingFromCurrent({ precipitation: 0.2 }), true);
    assert.equal(rainingFromCurrent({ precipitation: 0 }), false);
    assert.equal(rainingFromCurrent({}), false);
  });
});

describe('orderProductsForMode', () => {
  const products = [
    { id: 'idli-idla', name: 'Idli', moodTags: ['breakfast'] },
    { id: 'bhajiya', name: 'Bhajiya', moodTags: ['evening-snack', 'crispy'] },
    { id: 'farali-atta', name: 'Farali Atta', moodTags: ['festive'] },
    { id: 'gulab-jamun', name: 'Gulab Jamun', moodTags: ['sweet'] },
  ];

  it('leads with breakfast products in tiffin mode', () => {
    assert.deepEqual(
      orderProductsForMode(products, 'tiffin').map((item) => item.id),
      ['idli-idla', 'bhajiya', 'farali-atta', 'gulab-jamun'],
    );
  });

  it('leads with evening snacks in nashta mode', () => {
    assert.equal(orderProductsForMode(products, 'nashta')[0]?.id, 'bhajiya');
  });

  it('leads with farali products on a fasting day', () => {
    assert.equal(isFaraliProduct(products[2]), true);
    assert.equal(orderProductsForMode(products, 'farali')[0]?.id, 'farali-atta');
  });

  it('leads with bhajiya and pakoda snacks when it is raining', () => {
    assert.equal(isRainSnack(products[1]), true);
    assert.equal(orderProductsForMode(products, 'rain')[0]?.id, 'bhajiya');
  });

  it('keeps the mode shelf to products that match that mode', () => {
    assert.deepEqual(
      shelfForMode(products, 'tiffin').map((item) => item.id),
      ['idli-idla'],
    );
  });
});
