export type MehmaanRole = 'fried' | 'steamed' | 'chutney' | 'sweet';

export type MehmaanCandidate = {
  productId: string;
  role: MehmaanRole;
  serves: number;
  minutes: number;
};

export type MehmaanProduct = {
  id: string;
  inStock: boolean;
  cookingTimeMinutes: number;
};

export type PlatterLine = {
  productId: string;
  role: MehmaanRole;
  quantity: number;
  serves: number;
};

export type TimelineStep = {
  productName: string;
  label: string;
  at: Date;
  endsAt: Date;
};

const ROLE_ORDER: MehmaanRole[] = ['fried', 'steamed', 'chutney', 'sweet'];

export function parseDurationMinutes(duration?: string) {
  if (!duration) return 0;
  const matches = duration.match(/\d+/g);
  if (!matches?.length) return 0;
  return Math.max(...matches.map(Number));
}

export function buildMehmaanPlatter(input: {
  products: readonly MehmaanProduct[];
  candidates: readonly MehmaanCandidate[];
  minutes: number;
  guests: number;
}): PlatterLine[] {
  const available = input.candidates.filter((candidate) => {
    const product = input.products.find((item) => item.id === candidate.productId);
    if (!product?.inStock) return false;
    return candidate.minutes <= input.minutes && product.cookingTimeMinutes <= input.minutes;
  });

  return ROLE_ORDER.flatMap((role) => {
    if (role === 'sweet' && input.minutes < 35) return [];
    const candidate = available.find((item) => item.role === role);
    if (!candidate) return [];
    return [
      {
        productId: candidate.productId,
        role,
        serves: candidate.serves,
        quantity: Math.max(1, Math.ceil(input.guests / Math.max(1, candidate.serves))),
      },
    ];
  });
}

export function cookingTimeline(
  arrival: Date,
  dishes: readonly { name: string; steps: readonly { title: string; duration?: string }[] }[],
): TimelineStep[] {
  const flat = dishes.flatMap((dish) =>
    dish.steps.map((step) => ({
      productName: dish.name,
      label: step.title,
      minutes: parseDurationMinutes(step.duration),
    })),
  );
  let cursor = arrival.getTime();
  const reversed: TimelineStep[] = [];
  for (let index = flat.length - 1; index >= 0; index -= 1) {
    const step = flat[index];
    const endsAt = new Date(cursor);
    const at = new Date(cursor - step.minutes * 60_000);
    reversed.push({ productName: step.productName, label: step.label, at, endsAt });
    cursor = at.getTime();
  }
  return reversed.reverse();
}
