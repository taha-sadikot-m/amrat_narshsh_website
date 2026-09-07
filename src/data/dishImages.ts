// Prepared-dish photography used behind the homepage hero, occasion banners and
// recipe tiles. Everything here must stay vegetarian — the brand is 100% veg.
export const DISH_IMAGES = {
  bhajiya: '/images/dishes/bhajiya.webp',
  handwa: '/images/dishes/handwa.webp',
  gota: '/images/dishes/gota.webp',
  dalwada: '/images/dishes/dalwada.webp',
  'gulab-jamun': '/images/dishes/gulab-jamun.webp',
  khichu: '/images/dishes/khichu.webp',
  breakfast: '/images/dishes/breakfast.webp',
} as const;

export type DishImageKey = keyof typeof DISH_IMAGES;
