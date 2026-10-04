'use client';

import { useMemo, useState } from 'react';
import { MEHMAAN_CANDIDATES, MEHMAAN_GUESTS, MEHMAAN_WINDOWS, SAME_DAY_DELIVERY } from '../../data/mehmaan';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { defaultPack } from '../../lib/home-catalog';
import { buildMehmaanPlatter, cookingTimeline } from '../../lib/mehmaan';

const clock = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: 'numeric',
  minute: '2-digit',
});

export function MehmaanPage() {
  const { products, showToast } = useStore();
  const { addItem } = useCart();
  const [minutes, setMinutes] = useState<(typeof MEHMAAN_WINDOWS)[number]>(35);
  const [guests, setGuests] = useState<(typeof MEHMAAN_GUESTS)[number]>(8);
  const [plannedAt, setPlannedAt] = useState(() => Date.now());

  const arrival = useMemo(() => new Date(plannedAt + minutes * 60_000), [plannedAt, minutes]);
  const platter = useMemo(
    () =>
      buildMehmaanPlatter({
        products: products.map((product) => ({
          id: product.id,
          inStock: product.inStock,
          cookingTimeMinutes: product.cookingTimeMinutes,
        })),
        candidates: MEHMAAN_CANDIDATES,
        minutes,
        guests,
      }),
    [products, minutes, guests],
  );

  const dishes = platter
    .map((line) => products.find((product) => product.id === line.productId))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .map((product) => ({ name: product.name, steps: product.preparationSteps }));
  const timeline = cookingTimeline(arrival, dishes);

  const chooseMinutes = (value: (typeof MEHMAAN_WINDOWS)[number]) => {
    setMinutes(value);
    setPlannedAt(Date.now());
  };

  const addPlatter = () => {
    for (const line of platter) {
      const product = products.find((item) => item.id === line.productId);
      if (!product) continue;
      const pack = defaultPack(product);
      addItem({
        productId: product.id,
        name: product.name,
        gujaratiName: product.gujaratiName,
        weight: pack?.weight ?? product.defaultWeight,
        price: pack?.price ?? product.defaultPrice,
        quantity: line.quantity,
        heroColor: product.heroColor,
        makesText: product.makesText,
      });
    }
    showToast('Platter added', 'The guest snacks are in your basket.', 'success');
  };

  return (
    <main id="mehmaan-page" className="bg-[#FFFBF5] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D46A1E]">Mehmaan Mode</p>
        <h1 className="font-display mt-2 text-4xl font-bold text-[#3E2723]">Guests coming?</h1>
        <p className="mt-3 text-[#8D6E63]">
          Tell us how long you have and how many people. We will keep the snacks that can be ready, and line up the cooking so the last step ends when the doorbell rings.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <fieldset>
            <legend className="text-sm font-bold text-[#3E2723]">Minutes until they arrive</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {MEHMAAN_WINDOWS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => chooseMinutes(value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    minutes === value ? 'bg-[#D46A1E] text-white' : 'bg-white text-[#3E2723] ring-1 ring-[#F0E4D0]'
                  }`}
                >
                  {value} min
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-bold text-[#3E2723]">People</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {MEHMAAN_GUESTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGuests(value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    guests === value ? 'bg-[#3E2723] text-white' : 'bg-white text-[#3E2723] ring-1 ring-[#F0E4D0]'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <p className="mt-8 text-lg font-semibold text-[#3E2723]">Doorbell at {clock.format(arrival)}</p>
        {SAME_DAY_DELIVERY ? (
          <p className="mt-2 text-sm text-[#8D6E63]">{SAME_DAY_DELIVERY.note}</p>
        ) : null}

        {platter.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-white p-5 text-sm text-[#8D6E63] ring-1 ring-[#F0E4D0]">
            Nothing in stock can be cooked in {minutes} minutes. Try a longer window.
          </p>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {platter.map((line) => {
                const product = products.find((item) => item.id === line.productId);
                if (!product) return null;
                return (
                  <li key={line.productId} className="rounded-2xl bg-white p-4 ring-1 ring-[#F0E4D0]">
                    <p className="font-semibold text-[#3E2723]">
                      {line.quantity}× {product.name}
                    </p>
                    <p className="text-sm text-[#8D6E63]">
                      {line.role} · about {product.cookingTimeMinutes} min · feeds {line.serves} per pack
                    </p>
                  </li>
                );
              })}
            </ul>
            <ol className="mt-6 space-y-2">
              {timeline.map((step) => (
                <li key={`${step.productName}-${step.label}-${step.at.toISOString()}`} className="text-sm text-[#3E2723]">
                  <span className="font-bold">{clock.format(step.at)}</span> {step.label} — {step.productName}
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={addPlatter}
              className="mt-8 rounded-lg bg-[#D46A1E] px-6 py-3 text-sm font-bold text-white"
            >
              Add platter to cart
            </button>
          </>
        )}
      </div>
    </main>
  );
}
