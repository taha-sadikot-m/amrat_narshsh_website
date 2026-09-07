'use client';

import { HomeHeroSplit } from '../components/home/HomeHeroSplit';
import { HomeCategoryCircles } from '../components/home/HomeCategoryCircles';
import { HomeProductTabs } from '../components/home/HomeProductTabs';
import { HomeFeaturedDeal } from '../components/home/HomeFeaturedDeal';
import { HomeOccasionBanners } from '../components/home/HomeOccasionBanners';
import { HomeTrustBadges } from '../components/home/HomeTrustBadges';

export default function HomePage() {
  return (
    <main id="home-view">
      <HomeHeroSplit />
      <HomeCategoryCircles />
      <HomeProductTabs />
      <HomeFeaturedDeal />
      <HomeOccasionBanners />
      <HomeTrustBadges />
    </main>
  );
}
