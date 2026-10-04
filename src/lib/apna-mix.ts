export const BLEND_LEVELS = ['low', 'medium', 'high'] as const;
export type BlendLevel = (typeof BLEND_LEVELS)[number];
export type BlendSelection = { spice: BlendLevel; sour: BlendLevel; sweet: BlendLevel };

const HEAT_LABEL: Record<BlendLevel, string> = {
  high: 'Teekha',
  medium: 'Madhyam',
  low: 'Narma',
};

export function blendCode(selection: BlendSelection) {
  return `spice-${selection.spice}-sour-${selection.sour}-sweet-${selection.sweet}`;
}

export function parseBlendCode(code: string): BlendSelection | null {
  const match = /^spice-(low|medium|high)-sour-(low|medium|high)-sweet-(low|medium|high)$/.exec(code);
  if (!match) return null;
  return { spice: match[1] as BlendLevel, sour: match[2] as BlendLevel, sweet: match[3] as BlendLevel };
}

export function blendDisplayName(customerName: string | null | undefined, productName: string, spice: BlendLevel) {
  const who = customerName?.trim();
  const owner = who ? `${who}'s` : 'Your';
  const short = productName.replace(/\s+(Instant|Dessert)\s+Mix$/i, '').trim();
  return `${owner} ${HEAT_LABEL[spice]} ${short} Mix`;
}

export function packingNote(displayName: string, selection: BlendSelection) {
  return `${displayName} — spice ${selection.spice}, sour ${selection.sour}, sweet ${selection.sweet}`;
}
