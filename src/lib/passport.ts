export type PassportRegion = {
  id: string;
  label: string;
  productIds: readonly string[];
  rewardProductId: string;
};

export type PassportProgress = PassportRegion & {
  stamped: boolean;
  unlockedRewardId: string | null;
};

export function passportProgress(purchasedProductIds: readonly string[], regions: readonly PassportRegion[]): PassportProgress[] {
  const owned = new Set(purchasedProductIds);
  return regions.map((region) => {
    const stamped = region.productIds.some((id) => owned.has(id));
    return {
      ...region,
      stamped,
      unlockedRewardId: stamped ? region.rewardProductId : null,
    };
  });
}

export function visibleProducts<T extends { id: string }>(
  products: readonly T[],
  purchasedProductIds: readonly string[],
  regions: readonly PassportRegion[],
): T[] {
  const unlocked = new Set(
    passportProgress(purchasedProductIds, regions)
      .map((region) => region.unlockedRewardId)
      .filter((id): id is string => Boolean(id)),
  );
  const rewards = new Set(regions.map((region) => region.rewardProductId));
  return products.filter((product) => !rewards.has(product.id) || unlocked.has(product.id));
}
