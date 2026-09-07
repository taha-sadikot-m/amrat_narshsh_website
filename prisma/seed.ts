import { PrismaClient } from '@prisma/client';
import { CATEGORIES, PRODUCTS } from '../src/data/products';

const prisma = new PrismaClient();

const COUPONS = [
  {
    code: 'GUJARAT10',
    discountPercentage: 10,
    minOrderValue: 200,
    description: '10% OFF on all Gujarati Instant Mixes',
  },
  {
    code: 'HERITAGE1956',
    discountPercentage: 15,
    minOrderValue: 499,
    description: '15% OFF on celebration orders above ₹499',
  },
  {
    code: 'TASTEOFHOME',
    discountPercentage: 20,
    minOrderValue: 799,
    description: '20% OFF on family pantry orders above ₹799',
  },
];

const OFFERS = [
  {
    id: 'seed-heritage',
    text: 'Generations of Flavour Since 1956 — Authentic Gujarati Heritage',
    ctaLabel: 'Explore All 11 Mixes',
    href: '/shop',
    active: true,
    sortOrder: 0,
  },
  {
    id: 'seed-delivery',
    text: 'FREE Express Delivery on all orders above ₹499 across India',
    ctaLabel: 'Shop Now',
    href: '/shop',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'seed-coupon',
    text: 'Use code GUJARAT10 for 10% OFF your first order',
    ctaLabel: 'Claim Discount',
    href: '/shop',
    active: true,
    sortOrder: 2,
  },
];

const PACKSHOT_IMAGES: Record<string, string> = {
  bhajiya: '/images/products/bhajiya.webp',
  dalwada: '/images/products/dalwada.webp',
  'farali-atta': '/images/products/farali-atta.webp',
  gobapuri: '/images/products/gobapuri.webp',
  gota: '/images/products/gota.webp',
  'gulab-jamun': '/images/products/gulab-jamun.webp',
  handwa: '/images/products/handwa.webp',
  'idli-idla': '/images/products/idli-idla.webp',
  khatawada: '/images/products/khatawada.webp',
  khichu: '/images/products/khichu.webp',
  'surti-locho': '/images/products/surti-locho.webp',
};

async function main() {
  for (const [sortOrder, category] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: { ...category, sortOrder },
    });
  }

  for (const p of PRODUCTS) {
    const packSizes = p.packSizes.map((pack) => ({
      ...pack,
      stock: pack.isDefault ? p.stockCount : 0,
    }));

    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        gujaratiName: p.gujaratiName,
        hindiName: p.hindiName ?? null,
        category: p.category,
        categoryName: p.categoryName,
        tagline: p.tagline,
        description: p.description,
        culinaryStory: p.culinaryStory,
        heroColor: p.heroColor,
        accentColor: p.accentColor,
        badgeColor: p.badgeColor ?? null,
        packSizes: JSON.parse(JSON.stringify(packSizes)),
        defaultWeight: p.defaultWeight,
        defaultPrice: p.defaultPrice,
        compareAtPrice: p.compareAtPrice ?? null,
        rating: p.rating,
        reviewCount: p.reviewCount,
        makesText: p.makesText,
        badges: JSON.parse(JSON.stringify(p.badges)),
        ingredients: JSON.parse(JSON.stringify(p.ingredients)),
        verifiedNutrition: JSON.parse(JSON.stringify(p.verifiedNutrition)),
        preparationSteps: JSON.parse(JSON.stringify(p.preparationSteps)),
        cookingTimeMinutes: p.cookingTimeMinutes,
        difficulty: p.difficulty,
        servingSuggestion: p.servingSuggestion,
        pairingChutney: p.pairingChutney,
        allergens: JSON.parse(JSON.stringify(p.allergens)),
        shelfLife: p.shelfLife,
        moodTags: JSON.parse(JSON.stringify(p.moodTags)),
        isBestseller: p.isBestseller ?? false,
        isFeatured: p.isFeatured ?? false,
        isNew: p.isNew ?? false,
        inStock: p.inStock,
        stockCount: p.stockCount,
        imageUrl: PACKSHOT_IMAGES[p.id] ?? null,
      },
    });
  }

  for (const c of COUPONS) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  for (const offer of OFFERS) {
    await prisma.offer.upsert({
      where: { id: offer.id },
      update: {},
      create: offer,
    });
  }

  const COMBOS = [
    {
      id: 'combo-festival',
      name: 'Festival Mix Box',
      tagline: 'Bhajiya, Gota, and Gulab Jamun for celebration tables',
      price: 289,
      sortOrder: 0,
      productIds: ['bhajiya', 'gota', 'gulab-jamun'],
    },
    {
      id: 'combo-chai',
      name: 'Chai-Time Snack Pack',
      tagline: 'Dalwada, Handwa, and Khichu for evening plates',
      price: 220,
      sortOrder: 1,
      productIds: ['dalwada', 'handwa', 'khichu'],
    },
    {
      id: 'combo-farali',
      name: 'Farali Fasting Kit',
      tagline: 'Farali Atta, Gobapuri, and Khatawada for vrat days',
      price: 278,
      sortOrder: 2,
      productIds: ['farali-atta', 'gobapuri', 'khatawada'],
    },
  ];

  for (const combo of COMBOS) {
    await prisma.combo.upsert({
      where: { id: combo.id },
      update: {},
      create: {
        id: combo.id,
        name: combo.name,
        tagline: combo.tagline,
        price: combo.price,
        active: true,
        sortOrder: combo.sortOrder,
        items: {
          create: combo.productIds.map((productId) => ({ productId, quantity: 1 })),
        },
      },
    });
  }

  await prisma.heroSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default', overlayOpacity: 28, autoplayIntervalMs: 4500 },
  });

  const HERO_SLIDES = [
    {
      id: 'hero-bhajiya',
      productId: 'bhajiya',
      desktopImageUrl: '/images/hero/bhajiya-desktop.png',
      mobileImageUrl: '/images/hero/bhajiya-mobile.png',
      altText: 'Amrat Narsih Bhajiya Mix editorial banner',
      sortOrder: 0,
    },
    {
      id: 'hero-surti-locho',
      productId: 'surti-locho',
      desktopImageUrl: '/images/hero/surti-locho-desktop.png',
      mobileImageUrl: '/images/hero/surti-locho-mobile.png',
      altText: 'Amrat Narsih Surti Locho Mix editorial banner',
      sortOrder: 1,
    },
    {
      id: 'hero-gulab-jamun',
      productId: 'gulab-jamun',
      desktopImageUrl: '/images/hero/gulab-jamun-desktop.png',
      mobileImageUrl: '/images/hero/gulab-jamun-mobile.png',
      altText: 'Amrat Narsih Gulab Jamun Mix editorial banner',
      sortOrder: 2,
    },
  ];

  for (const slide of HERO_SLIDES) {
    await prisma.heroSlide.upsert({
      where: { id: slide.id },
      update: {},
      create: { ...slide, active: true },
    });
  }

  console.log(
    `Seeded missing records: ${PRODUCTS.length} products, ${CATEGORIES.length} categories, ${COUPONS.length} coupons, ${OFFERS.length} offers, ${COMBOS.length} combos, ${HERO_SLIDES.length} hero slides, and hero settings.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
