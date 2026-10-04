import type { PassportRegion } from '../lib/passport';

export const PASSPORT_REGIONS: PassportRegion[] = [
  { id: 'surat', label: 'Surat', productIds: ['surti-locho'], rewardProductId: 'khichu' },
  { id: 'ahmedabad', label: 'Ahmedabad', productIds: ['dalwada', 'nylon-khaman', 'loya-khaman'], rewardProductId: 'fafda' },
  { id: 'monsoon', label: 'Monsoon', productIds: ['bhajiya', 'gota'], rewardProductId: 'guvar-papdi' },
  { id: 'farali', label: 'Farali', productIds: ['farali-atta'], rewardProductId: 'papad-plain' },
  { id: 'sweets', label: 'Sweets', productIds: ['gulab-jamun'], rewardProductId: 'dahi-sharbati' },
];
