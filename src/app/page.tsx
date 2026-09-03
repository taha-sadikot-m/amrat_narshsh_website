'use client';

import { HeroSection } from '../components/home/HeroSection';
import { ShopByCategory } from '../components/home/ShopByCategory';
import { BestsellersCarousel } from '../components/home/BestsellersCarousel';
import { PacketToPlate } from '../components/home/PacketToPlate';
import { WhyAmratNarsih } from '../components/home/WhyAmratNarsih';
import { MakeItYoursDiscovery } from '../components/home/MakeItYoursDiscovery';
import { SocialProofReviews } from '../components/home/SocialProofReviews';
import { FinalCTA } from '../components/home/FinalCTA';

export default function HomePage() {
  return (
    <main id="home-view" className="space-y-0">
      <HeroSection />
      <ShopByCategory />
      <BestsellersCarousel />
      <PacketToPlate />
      <WhyAmratNarsih />
      <MakeItYoursDiscovery />
      <SocialProofReviews />
      <FinalCTA />
    </main>
  );
}
