import Link from 'next/link';
import { PASSPORT_REGIONS } from '../../data/passport';
import { getProducts } from '../../lib/catalog';
import { getCustomerSession } from '../../lib/customer-auth';
import { passportProgress } from '../../lib/passport';
import { purchasedProductIds } from '../../lib/storefront-catalog';

export default async function PassportPage() {
  const [customer, products] = await Promise.all([getCustomerSession(), getProducts()]);
  const purchased = await purchasedProductIds(customer?.id ?? null);
  const progress = passportProgress(purchased, PASSPORT_REGIONS);
  const nameOf = (id: string) => products.find((product) => product.id === id)?.name ?? id;

  return (
    <main id="snack-passport" className="bg-[#FFFBF5] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D46A1E]">Snack Passport</p>
        <h1 className="font-display mt-2 text-4xl font-bold text-[#3E2723]">A map of this kitchen</h1>
        <p className="mt-3 max-w-2xl text-[#8D6E63]">
          Each region is a snack this brand already makes. An order stamps the region. The reward stays off the shop shelf until then.
        </p>
        {!customer && (
          <p className="mt-4 text-sm text-[#3E2723]">
            <Link href="/login?next=/passport" className="font-bold text-[#D46A1E]">Sign in</Link> to see stamps from your orders.
          </p>
        )}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {progress.map((region) => (
            <article key={region.id} className="rounded-3xl bg-white p-5 ring-1 ring-[#F0E4D0]">
              <p className="text-xs font-bold uppercase tracking-wide text-[#D46A1E]">{region.stamped ? 'Stamped' : 'Open'}</p>
              <h2 className="font-display mt-1 text-2xl font-bold text-[#3E2723]">{region.label}</h2>
              <ul className="mt-3 space-y-1 text-sm">
                {region.productIds.map((id) => (
                  <li key={id}>
                    <Link href={`/product/${id}`} className="font-semibold text-[#3E2723] hover:text-[#D46A1E]">
                      {nameOf(id)}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-[#8D6E63]">
                Reward: {nameOf(region.rewardProductId)}{' '}
                {region.stamped ? (
                  <Link href={`/product/${region.rewardProductId}`} className="font-bold text-[#D46A1E]">
                    is unlocked
                  </Link>
                ) : (
                  'is locked'
                )}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
