import type { MehmaanCandidate } from '../lib/mehmaan';

export const MEHMAAN_CANDIDATES: MehmaanCandidate[] = [
  { productId: 'bhajiya', role: 'fried', serves: 6, minutes: 10 },
  { productId: 'gota', role: 'fried', serves: 8, minutes: 18 },
  { productId: 'guvar-papdi', role: 'fried', serves: 4, minutes: 12 },
  { productId: 'nylon-khaman', role: 'steamed', serves: 6, minutes: 18 },
  { productId: 'surti-locho', role: 'steamed', serves: 4, minutes: 15 },
  { productId: 'khichu', role: 'steamed', serves: 2, minutes: 8 },
  { productId: 'handwa', role: 'steamed', serves: 8, minutes: 25 },
  { productId: 'chatni-kadhi', role: 'chutney', serves: 8, minutes: 8 },
  { productId: 'gulab-jamun', role: 'sweet', serves: 8, minutes: 20 },
];

export const MEHMAAN_WINDOWS = [20, 35, 60] as const;
export const MEHMAAN_GUESTS = [4, 8, 12] as const;

/** Set a city and cutoff hour when same-day delivery is a real promise. */
export const SAME_DAY_DELIVERY: { city: string; cutoffHour: number; note: string } | null = null;
