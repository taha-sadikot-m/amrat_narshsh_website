import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rankForks, validateRecipeFork } from './recipe-forks';

const parentIngredients = ['200g Amrat Narsih Bhajiya Instant Mix', '2 medium potatoes', 'Oil for deep frying'];

describe('validateRecipeFork', () => {
  it('accepts a title, steps, and extras already on the parent recipe', () => {
    const result = validateRecipeFork({
      title: 'Bhajiya with extra lemon',
      steps: [{ instruction: 'Fry until gold.' }],
      chefTips: ['Serve hot.'],
      extras: ['lemon'],
      parentIngredients,
      allowedExtras: ['lemon', 'corn'],
    });
    assert.equal(result.ok, true);
  });

  it('rejects an extra that is not on the parent recipe or the allowed list', () => {
    const result = validateRecipeFork({
      title: 'Raw egg bhajiya',
      steps: [{ instruction: 'Add egg.' }],
      chefTips: [],
      extras: ['raw egg'],
      parentIngredients,
      allowedExtras: ['lemon', 'corn'],
    });
    assert.equal(result.ok, false);
  });

  it('rejects an empty title or empty steps', () => {
    const result = validateRecipeFork({
      title: '   ',
      steps: [],
      chefTips: [],
      extras: [],
      parentIngredients,
      allowedExtras: ['lemon'],
    });
    assert.equal(result.ok, false);
  });
});

describe('rankForks', () => {
  it('ranks approved forks by how many later forks point at them', () => {
    const ranked = rankForks([
      { id: 'a', status: 'approved', parentForkId: null },
      { id: 'b', status: 'approved', parentForkId: 'a' },
      { id: 'c', status: 'pending', parentForkId: 'a' },
      { id: 'd', status: 'approved', parentForkId: null },
    ]);
    assert.deepEqual(ranked.map((fork) => fork.id), ['a', 'b', 'd']);
    assert.equal(ranked[0]?.forkCount, 2);
  });
});
