import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildMehmaanPlatter, cookingTimeline, parseDurationMinutes } from './mehmaan';
import type { MehmaanCandidate } from './mehmaan';

const candidates: MehmaanCandidate[] = [
  { productId: 'bhajiya', role: 'fried', serves: 6, minutes: 10 },
  { productId: 'handwa', role: 'steamed', serves: 6, minutes: 20 },
  { productId: 'nylon-khaman', role: 'steamed', serves: 8, minutes: 40 },
  { productId: 'chatni-kadhi', role: 'chutney', serves: 8, minutes: 10 },
  { productId: 'gulab-jamun', role: 'sweet', serves: 8, minutes: 20 },
];

const products = candidates.map((candidate) => ({
  id: candidate.productId,
  inStock: candidate.productId !== 'nylon-khaman',
  cookingTimeMinutes: candidate.minutes,
}));

describe('parseDurationMinutes', () => {
  it('reads a minute count and uses the longer end of a range', () => {
    assert.equal(parseDurationMinutes('2 mins'), 2);
    assert.equal(parseDurationMinutes('4-5 mins'), 5);
    assert.equal(parseDurationMinutes('Instant'), 0);
  });
});

describe('buildMehmaanPlatter', () => {
  it('keeps snacks that fit the window and sizes packs to the guest count', () => {
    const platter = buildMehmaanPlatter({ products, candidates, minutes: 20, guests: 8 });
    const ids = platter.map((item) => item.productId);
    assert.deepEqual(ids, ['bhajiya', 'handwa', 'chatni-kadhi']);
    assert.equal(platter.find((item) => item.productId === 'bhajiya')?.quantity, 2);
    assert.equal(platter.find((item) => item.productId === 'gulab-jamun'), undefined);
  });

  it('adds a sweet when the window is 35 minutes or more', () => {
    const platter = buildMehmaanPlatter({ products, candidates, minutes: 35, guests: 4 });
    assert.equal(platter.some((item) => item.productId === 'gulab-jamun'), true);
    assert.equal(platter.find((item) => item.productId === 'bhajiya')?.quantity, 1);
  });
});

describe('cookingTimeline', () => {
  it('walks preparation steps backward so the last step ends at arrival', () => {
    const arrival = new Date('2026-10-04T13:30:00.000Z');
    const timeline = cookingTimeline(arrival, [
      {
        name: 'Bhajiya',
        steps: [
          { title: 'Pour & Mix', duration: '2 mins' },
          { title: 'Golden Fry', duration: '5 mins' },
        ],
      },
    ]);
    assert.equal(timeline[0]?.label, 'Pour & Mix');
    assert.equal(timeline[0]?.at.toISOString(), '2026-10-04T13:23:00.000Z');
    assert.equal(timeline[1]?.label, 'Golden Fry');
    assert.equal(timeline[1]?.at.toISOString(), '2026-10-04T13:25:00.000Z');
    assert.equal(timeline[1]?.endsAt.toISOString(), '2026-10-04T13:30:00.000Z');
  });
});
