import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rescueLeftovers, type LeftoverRecipe } from './leftovers';

const recipes: LeftoverRecipe[] = [
  { slug: 'batata-bhajiya', title: 'Batata Bhajiya', productId: 'bhajiya', required: ['potato'] },
  { slug: 'moong-dalwada', title: 'Moong Dalwada', productId: 'dalwada', required: ['onion'] },
  { slug: 'dudhi-handwa', title: 'Dudhi Handwa', productId: 'handwa', required: ['curd'] },
];

describe('rescueLeftovers', () => {
  it('returns recipes whose kitchen ingredients are all ticked', () => {
    const result = rescueLeftovers(['potato', 'chilli'], recipes);
    assert.deepEqual(result.matches.map((item) => item.slug), ['batata-bhajiya']);
    assert.equal(result.suggestion, null);
  });

  it('names the one extra ingredient that would unlock a recipe', () => {
    const result = rescueLeftovers(['bread'], recipes);
    assert.deepEqual(result.matches, []);
    assert.equal(result.suggestion?.pantry, 'potato');
    assert.equal(result.suggestion?.recipe.slug, 'batata-bhajiya');
  });

  it('asks for a selection before suggesting anything', () => {
    const result = rescueLeftovers([], recipes);
    assert.deepEqual(result.matches, []);
    assert.equal(result.suggestion, null);
  });
});
