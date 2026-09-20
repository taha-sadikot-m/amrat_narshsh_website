import { prisma } from './prisma';
import { DEFAULT_HOME_MERCH } from './home-catalog';
import type { HomeMerchConfig } from '../types';

export { DEFAULT_HOME_MERCH };

function asIdList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const ids = value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  return ids.length ? ids : fallback;
}

export function parseHomeMerch(row: {
  featuredIds: unknown;
  bestsellers: unknown;
  arrivals: unknown;
  festival: unknown;
} | null): HomeMerchConfig {
  if (!row) return DEFAULT_HOME_MERCH;
  return {
    featuredIds: asIdList(row.featuredIds, DEFAULT_HOME_MERCH.featuredIds),
    bestsellers: asIdList(row.bestsellers, DEFAULT_HOME_MERCH.bestsellers),
    arrivals: asIdList(row.arrivals, DEFAULT_HOME_MERCH.arrivals),
    festival: asIdList(row.festival, DEFAULT_HOME_MERCH.festival),
  };
}

export async function getHomeMerch(): Promise<HomeMerchConfig> {
  const row = await prisma.homeMerch.findUnique({ where: { id: 'default' } });
  return parseHomeMerch(row);
}
