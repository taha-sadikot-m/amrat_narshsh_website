'use client';

import { useEffect, useState } from 'react';
import {
  BLEND_LEVELS,
  blendCode,
  blendDisplayName,
  packingNote,
  parseBlendCode,
  type BlendLevel,
} from '../../lib/apna-mix';

const STORAGE_KEY = 'amrat_narsih_blends_v1';

function readBlends(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function ApnaMixControls({
  productId,
  productName,
  customerName,
  onChange,
}: {
  productId: string;
  productName: string;
  customerName?: string | null;
  onChange: (blend: { blendCode: string; blendName: string; packingNote: string } | null) => void;
}) {
  const [spice, setSpice] = useState<BlendLevel>('medium');
  const [sour, setSour] = useState<BlendLevel>('medium');
  const [sweet, setSweet] = useState<BlendLevel>('medium');
  const [enabled, setEnabled] = useState(false);
  const [savedCode, setSavedCode] = useState<string | null>(null);

  useEffect(() => {
    const saved = readBlends()[productId] ?? null;
    setSavedCode(saved);
    setEnabled(false);
    setSpice('medium');
    setSour('medium');
    setSweet('medium');
  }, [productId]);

  useEffect(() => {
    if (!enabled) {
      onChange(null);
      return;
    }
    const selection = { spice, sour, sweet };
    const code = blendCode(selection);
    const blendName = blendDisplayName(customerName, productName, spice);
    onChange({ blendCode: code, blendName, packingNote: packingNote(blendName, selection) });
    const next = { ...readBlends(), [productId]: code };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSavedCode(code);
  }, [enabled, spice, sour, sweet, customerName, productName, productId, onChange]);

  const applySaved = () => {
    const parsed = savedCode ? parseBlendCode(savedCode) : null;
    if (!parsed) return;
    setSpice(parsed.spice);
    setSour(parsed.sour);
    setSweet(parsed.sweet);
    setEnabled(true);
  };

  const slider = (label: string, value: BlendLevel, setValue: (next: BlendLevel) => void) => (
    <label className="block text-xs font-bold text-[#3E2723]">
      {label}
      <input
        type="range"
        min={0}
        max={2}
        step={1}
        value={BLEND_LEVELS.indexOf(value)}
        onChange={(event) => {
          setEnabled(true);
          setValue(BLEND_LEVELS[Number(event.target.value)] ?? 'medium');
        }}
        className="mt-1 w-full accent-[#D46A1E]"
      />
      <span className="font-semibold text-[#8D6E63]">{value}</span>
    </label>
  );

  return (
    <div className="rounded-2xl border border-[#F0E4D0] bg-[#FFFBF5] p-4">
      <p className="text-sm font-bold text-[#3E2723]">Apna Mix</p>
      <p className="mt-1 text-xs text-[#8D6E63]">Three stops each for spice, sour, and sweet. The packer writes your blend on this pack.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {slider('Spice', spice, setSpice)}
        {slider('Sour', sour, setSour)}
        {slider('Sweet', sweet, setSweet)}
      </div>
      {enabled && (
        <p className="mt-3 text-sm font-semibold text-[#D46A1E]">
          {blendDisplayName(customerName, productName, spice)}
        </p>
      )}
      {savedCode && (
        <button type="button" onClick={applySaved} className="mt-3 text-xs font-bold text-[#3E2723] underline">
          Reorder your last blend
        </button>
      )}
    </div>
  );
}
