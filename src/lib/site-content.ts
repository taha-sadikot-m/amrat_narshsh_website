import { prisma } from './prisma';

const MIN_AUTOPLAY_MS = 2500;
const MAX_AUTOPLAY_MS = 12000;

export function clampAutoplayInterval(ms: number) {
  if (!Number.isFinite(ms)) return 4500;
  return Math.min(MAX_AUTOPLAY_MS, Math.max(MIN_AUTOPLAY_MS, Math.round(ms)));
}

export async function getHeroSetting() {
  return prisma.heroSetting.findUnique({ where: { id: 'default' } });
}

export async function getActiveHeroSlides() {
  return prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getHeroCarousel() {
  const [setting, slides] = await Promise.all([getHeroSetting(), getActiveHeroSlides()]);
  return {
    overlayOpacity: setting?.overlayOpacity ?? 45,
    autoplayIntervalMs: clampAutoplayInterval(setting?.autoplayIntervalMs ?? 4500),
    slides: slides.map((slide) => ({
      id: slide.id,
      productId: slide.productId,
      desktopImageUrl: slide.desktopImageUrl,
      mobileImageUrl: slide.mobileImageUrl,
      altText: slide.altText,
      sortOrder: slide.sortOrder,
    })),
  };
}

export async function getActiveOffers() {
  const now = new Date();
  const rows = await prisma.offer.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  });
  return rows.filter((offer) => {
    if (offer.startsAt && offer.startsAt > now) return false;
    if (offer.endsAt && offer.endsAt < now) return false;
    return true;
  });
}
