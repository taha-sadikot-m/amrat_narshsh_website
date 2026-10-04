import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { passportProgress, visibleProducts } from './passport';

const regions = [
  { id: 'surat', label: 'Surat', productIds: ['surti-locho'], rewardProductId: 'khichu' },
  { id: 'monsoon', label: 'Monsoon', productIds: ['bhajiya', 'gota'], rewardProductId: 'guvar-papdi' },
];

describe('passportProgress', () => {
  it('stamps a region only when an order contains one of its products', () => {
    const progress = passportProgress(['bhajiya'], regions);
    assert.equal(progress.find((region) => region.id === 'monsoon')?.stamped, true);
    assert.equal(progress.find((region) => region.id === 'surat')?.stamped, false);
    assert.deepEqual(progress.find((region) => region.id === 'monsoon')?.unlockedRewardId, 'guvar-papdi');
  });
});

describe('visibleProducts', () => {
  it('hides reward products until that region is stamped', () => {
    const products = [{ id: 'bhajiya' }, { id: 'khichu' }, { id: 'guvar-papdi' }];
    assert.deepEqual(
      visibleProducts(products, [], regions).map((item) => item.id),
      ['bhajiya'],
    );
    assert.deepEqual(
      visibleProducts(products, ['surti-locho'], regions).map((item) => item.id),
      ['bhajiya', 'khichu'],
    );
  });
});
