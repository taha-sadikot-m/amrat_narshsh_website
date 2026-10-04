'use client';

import { HomeHeroSplit } from '../components/home/HomeHeroSplit';
import { HomeCategoryCircles } from '../components/home/HomeCategoryCircles';
import { HomeProductTabs } from '../components/home/HomeProductTabs';
import { HomeFeaturedDeal } from '../components/home/HomeFeaturedDeal';
import { HomeOccasionBanners } from '../components/home/HomeOccasionBanners';
import { HomeTrustBadges } from '../components/home/HomeTrustBadges';
import { useStorefrontMode } from '../components/home/useStorefrontMode';

export default function HomePage() {
  const { mode } = useStorefrontMode();

  return (
    <main id="home-view" data-storefront-mode={mode}>
      <HomeHeroSplit />
      <HomeCategoryCircles />
      <HomeProductTabs mode={mode} />
      <HomeFeaturedDeal />
      <HomeOccasionBanners />
      <HomeTrustBadges />
    </main>
  );
}
