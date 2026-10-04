export type StorefrontMode = 'tiffin' | 'nashta' | 'default' | 'farali' | 'rain';

export type ShelfProduct = {
  id: string;
  name: string;
  moodTags: readonly string[];
  slug?: string;
  category?: string;
};

const KOLKATA = 'Asia/Kolkata';

function kolkataParts(now: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: KOLKATA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return {
    dateKey: `${read('year')}-${read('month')}-${read('day')}`,
    hour: Number(read('hour')),
  };
}

export function kolkataDateKey(now: Date) {
  return kolkataParts(now).dateKey;
}

export function resolveStorefrontMode(input: {
  now: Date;
  faraliDates: readonly string[];
  raining?: boolean;
}): StorefrontMode {
  const { dateKey, hour } = kolkataParts(input.now);
  if (input.faraliDates.includes(dateKey)) return 'farali';
  if (input.raining) return 'rain';
  if (hour < 11) return 'tiffin';
  if (hour >= 16 && hour < 19) return 'nashta';
  return 'default';
}

export function rainingFromCurrent(current: { precipitation?: number | null }) {
  return Number(current.precipitation ?? 0) > 0;
}

export function isFaraliProduct(product: Pick<ShelfProduct, 'id' | 'name' | 'slug'>) {
  const hay = `${product.id} ${product.slug ?? ''} ${product.name}`.toLowerCase();
  return hay.includes('farali');
}

export function isRainSnack(product: Pick<ShelfProduct, 'id' | 'name'>) {
  const hay = `${product.id} ${product.name}`.toLowerCase();
  return /bhajiya|pakoda|bhajji|gota/.test(hay);
}

function lead<T extends ShelfProduct>(products: T[], match: (product: T) => boolean) {
  const first = products.filter(match);
  const rest = products.filter((product) => !match(product));
  return [...first, ...rest];
}

function matchesMode(product: ShelfProduct, mode: StorefrontMode) {
  if (mode === 'tiffin') return product.moodTags.includes('breakfast');
  if (mode === 'nashta') return product.moodTags.includes('evening-snack');
  if (mode === 'farali') return isFaraliProduct(product);
  if (mode === 'rain') return isRainSnack(product);
  return true;
}

export function orderProductsForMode<T extends ShelfProduct>(products: readonly T[], mode: StorefrontMode): T[] {
  const list = [...products];
  if (mode === 'default') return list;
  return lead(list, (product) => matchesMode(product, mode));
}

export function shelfForMode<T extends ShelfProduct>(products: readonly T[], mode: StorefrontMode, limit = 5): T[] {
  const ordered = orderProductsForMode(products, mode);
  if (mode === 'default') return ordered.slice(0, limit);
  return ordered.filter((product) => matchesMode(product, mode)).slice(0, limit);
}

export const MODE_COPY: Record<StorefrontMode, { title: string; body: string } | null> = {
  tiffin: {
    title: 'Tiffin mode',
    body: 'Morning shelf: breakfast mixes first, ready before the tiffin leaves.',
  },
  nashta: {
    title: 'Nashta mode',
    body: 'Four to seven is chai time. Evening snacks are at the front.',
  },
  farali: {
    title: 'Farali picks',
    body: 'Today is a fasting day on our list. Farali mixes are first.',
  },
  rain: {
    title: 'Rain shelf',
    body: 'It is raining near you. Bhajiya and pakoda mixes are first.',
  },
  default: null,
};
