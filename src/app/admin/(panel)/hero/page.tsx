'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/types';

type Slide = {
  id: string;
  productId: string | null;
  desktopImageUrl: string;
  mobileImageUrl: string;
  altText: string;
  active: boolean;
  sortOrder: number;
};

async function upload(file: File, folder: string) {
  const data = new FormData();
  data.set('file', file);
  data.set('folder', folder);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Upload failed');
  return json.url as string;
}

function DesktopPreview({ src, alt }: { src?: string; alt?: string }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#EADFCB] bg-[#FCFAF5] aspect-video">
      {src ? (
        <img src={src} alt={alt || ''} className="h-full w-full object-contain" />
      ) : (
        <div className="flex h-full items-center justify-center text-xs font-semibold text-gray-400">
          No desktop image
        </div>
      )}
    </div>
  );
}

function MobilePreview({ src, alt }: { src?: string; alt?: string }) {
  return (
    <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-[1.75rem] border border-[#EADFCB] bg-[#FCFAF5] aspect-[9/16] shadow-sm">
      {src ? (
        <img src={src} alt={alt || ''} className="h-full w-full object-contain" />
      ) : (
        <div className="flex h-full items-center justify-center px-4 text-center text-xs font-semibold text-gray-400">
          No mobile image
        </div>
      )}
    </div>
  );
}

export default function AdminHeroPage() {
  const [overlay, setOverlay] = useState(28);
  const [autoplayMs, setAutoplayMs] = useState(4500);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState('');
  const [draftDesktop, setDraftDesktop] = useState('');
  const [draftMobile, setDraftMobile] = useState('');
  const [draftProductId, setDraftProductId] = useState('');
  const [draftAlt, setDraftAlt] = useState('');

  const load = async () => {
    const [heroRes, productRes] = await Promise.all([
      fetch('/api/admin/hero'),
      fetch('/api/products'),
    ]);
    const heroJson = await heroRes.json();
    const productJson = await productRes.json();
    setOverlay(heroJson.hero?.overlayOpacity ?? 28);
    setAutoplayMs(heroJson.hero?.autoplayIntervalMs ?? 4500);
    setSlides(heroJson.slides || []);
    setProducts(productJson.products || []);
    if (!draftProductId && productJson.products?.[0]?.id) {
      setDraftProductId(productJson.products[0].id);
    }
  };

  useEffect(() => {
    load().catch(() => setStatus('Could not load hero settings.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSettings = async () => {
    setStatus('Saving settings…');
    const res = await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overlayOpacity: overlay, autoplayIntervalMs: autoplayMs }),
    });
    setStatus(res.ok ? 'Settings saved.' : 'Could not save settings.');
  };

  const saveSlide = async (slide: Partial<Slide> & { id: string }) => {
    const res = await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slide),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || 'Could not update slide.');
    }
    await load();
  };

  const moveSlide = async (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const current = slides[index];
    const neighbor = slides[target];
    await saveSlide({ id: current.id, sortOrder: neighbor.sortOrder });
    await saveSlide({ id: neighbor.id, sortOrder: current.sortOrder });
  };

  const addSlide = async () => {
    if (!draftDesktop || !draftMobile) {
      setStatus('Upload both a desktop and a mobile image before adding a slide.');
      return;
    }
    setStatus('Adding slide…');
    const res = await fetch('/api/admin/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        desktopImageUrl: draftDesktop,
        mobileImageUrl: draftMobile,
        productId: draftProductId || null,
        altText: draftAlt,
        active: true,
      }),
    });
    if (!res.ok) {
      setStatus('Could not add slide.');
      return;
    }
    setDraftDesktop('');
    setDraftMobile('');
    setDraftAlt('');
    setStatus('Slide added.');
    await load();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl">Hero carousel</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage multiple full-bleed banners. Desktop images should keep the left side open for homepage copy; mobile images should keep space at the top.
        </p>
      </div>

      <section className="bg-white rounded-3xl border border-[#EADFCB] p-6 space-y-5">
        <h2 className="font-display font-bold text-lg">Playback</h2>
        <label className="block text-sm font-bold">
          Overlay darkness ({overlay}%)
          <input type="range" min={0} max={80} value={overlay} onChange={(e) => setOverlay(Number(e.target.value))} className="w-full mt-2" />
        </label>
        <label className="block text-sm font-bold">
          Autoplay interval ({Math.round(autoplayMs / 1000)}s)
          <input
            type="range"
            min={2500}
            max={12000}
            step={500}
            value={autoplayMs}
            onChange={(e) => setAutoplayMs(Number(e.target.value))}
            className="w-full mt-2"
          />
        </label>
        <button type="button" onClick={saveSettings} className="btn-vibrant-cta px-6 py-3 rounded-2xl text-xs font-black uppercase">
          Save playback
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display font-bold text-lg">Slides</h2>
        {slides.length === 0 && (
          <p className="text-sm text-gray-500">No slides yet. The homepage will use the cream background until you add one.</p>
        )}
        {slides.map((slide, index) => (
          <article key={slide.id} className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-4">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Desktop · 16:9</div>
                <DesktopPreview src={slide.desktopImageUrl} alt={slide.altText} />
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 text-sm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await upload(file, 'hero');
                      await saveSlide({ id: slide.id, desktopImageUrl: url });
                      setStatus('Desktop image updated.');
                    } catch (error) {
                      setStatus(error instanceof Error ? error.message : 'Upload failed.');
                    }
                  }}
                />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Mobile · 9:16</div>
                <MobilePreview src={slide.mobileImageUrl} alt={slide.altText} />
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 text-sm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await upload(file, 'hero');
                      await saveSlide({ id: slide.id, mobileImageUrl: url });
                      setStatus('Mobile image updated.');
                    } catch (error) {
                      setStatus(error instanceof Error ? error.message : 'Upload failed.');
                    }
                  }}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <label className="text-sm font-bold">
                Linked product
                <select
                  className="mt-1 w-full rounded-xl border border-[#EADFCB] px-3 py-2 font-medium"
                  value={slide.productId ?? ''}
                  onChange={async (e) => {
                    await saveSlide({ id: slide.id, productId: e.target.value || null });
                  }}
                >
                  <option value="">None</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Alt text
                <input
                  className="mt-1 w-full rounded-xl border border-[#EADFCB] px-3 py-2 font-medium"
                  defaultValue={slide.altText}
                  onBlur={async (e) => {
                    if (e.target.value !== slide.altText) {
                      await saveSlide({ id: slide.id, altText: e.target.value });
                    }
                  }}
                />
              </label>
              <label className="text-sm font-bold flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={slide.active}
                  onChange={async (e) => {
                    await saveSlide({ id: slide.id, active: e.target.checked });
                  }}
                />
                Active
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => moveSlide(index, -1)} className="rounded-xl border border-[#EADFCB] px-3 py-2 text-xs font-black uppercase">
                Move up
              </button>
              <button type="button" onClick={() => moveSlide(index, 1)} className="rounded-xl border border-[#EADFCB] px-3 py-2 text-xs font-black uppercase">
                Move down
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm('Delete this slide?')) return;
                  await fetch(`/api/admin/hero?id=${slide.id}`, { method: 'DELETE' });
                  setStatus('Slide deleted.');
                  await load();
                }}
                className="rounded-xl border border-[#C90018] text-[#C90018] px-3 py-2 text-xs font-black uppercase"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-white rounded-3xl border border-[#EADFCB] p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Add slide</h2>
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
          <label className="block text-sm font-bold">
            Desktop · 16:9
            <div className="mt-2">
              <DesktopPreview src={draftDesktop || undefined} />
            </div>
            <input type="file" accept="image/*" className="mt-2 font-medium" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                setDraftDesktop(await upload(file, 'hero'));
              } catch (error) {
                setStatus(error instanceof Error ? error.message : 'Upload failed.');
              }
            }} />
          </label>
          <label className="block text-sm font-bold">
            Mobile · 9:16
            <div className="mt-2">
              <MobilePreview src={draftMobile || undefined} />
            </div>
            <input type="file" accept="image/*" className="mt-2 font-medium" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                setDraftMobile(await upload(file, 'hero'));
              } catch (error) {
                setStatus(error instanceof Error ? error.message : 'Upload failed.');
              }
            }} />
          </label>
        </div>
        <label className="block text-sm font-bold">
          Linked product
          <select className="mt-1 w-full rounded-xl border border-[#EADFCB] px-3 py-2 font-medium" value={draftProductId} onChange={(e) => setDraftProductId(e.target.value)}>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold">
          Alt text
          <input className="mt-1 w-full rounded-xl border border-[#EADFCB] px-3 py-2 font-medium" value={draftAlt} onChange={(e) => setDraftAlt(e.target.value)} />
        </label>
        <button type="button" onClick={addSlide} className="btn-vibrant-cta px-6 py-3 rounded-2xl text-xs font-black uppercase">
          Add slide
        </button>
      </section>

      {status && <p className="text-sm font-semibold">{status}</p>}
    </div>
  );
}
