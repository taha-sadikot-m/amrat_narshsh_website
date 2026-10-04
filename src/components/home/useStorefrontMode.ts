'use client';

import { useEffect, useState } from 'react';
import { FARALI_DATES_2026 } from '../../data/farali-dates';
import { rainingFromCurrent, resolveStorefrontMode, type StorefrontMode } from '../../lib/storefront-mode';

const RAIN_KEY = 'amrat_rain';

export function useStorefrontMode() {
  const [now, setNow] = useState<Date | null>(null);
  const [raining, setRaining] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const cached = window.sessionStorage.getItem(RAIN_KEY);
    if (cached === '1' || cached === '0') {
      setRaining(cached === '1');
      return;
    }
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const url = new URL('https://api.open-meteo.com/v1/forecast');
          url.searchParams.set('latitude', String(position.coords.latitude));
          url.searchParams.set('longitude', String(position.coords.longitude));
          url.searchParams.set('current', 'precipitation');
          const response = await fetch(url);
          if (!response.ok) throw new Error('forecast failed');
          const body = (await response.json()) as { current?: { precipitation?: number | null } };
          const rain = rainingFromCurrent(body.current ?? {});
          window.sessionStorage.setItem(RAIN_KEY, rain ? '1' : '0');
          if (!cancelled) setRaining(rain);
        } catch {
          if (!cancelled) setRaining(false);
        }
      },
      () => {
        if (!cancelled) setRaining(false);
      },
      { maximumAge: 30 * 60 * 1000, timeout: 8000 },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const mode: StorefrontMode = now
    ? resolveStorefrontMode({ now, faraliDates: FARALI_DATES_2026, raining })
    : 'default';

  return { mode, raining };
}
