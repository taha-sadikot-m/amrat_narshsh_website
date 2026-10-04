import { notFound } from 'next/navigation';
import { ProductDetailPage } from '../../../components/product/ProductDetailPage';
import { getProductBySlug, getProducts } from '../../../lib/catalog';
import { getRecipesByProductId } from '../../../lib/recipes';
import { filterStorefrontProducts, isLockedReward, purchasedProductIds } from '../../../lib/storefront-catalog';
import { getCustomerSession } from '../../../lib/customer-auth';

export default async function ProductRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const customer = await getCustomerSession();
  const purchased = await purchasedProductIds(customer?.id ?? null);
  if (isLockedReward(product.id, purchased)) notFound();
  const related = (await filterStorefrontProducts(await getProducts())).filter((item) => item.id !== product.id).slice(0, 4);
  const recipes = await getRecipesByProductId(product.id);
  return <ProductDetailPage product={product} relatedProducts={related} recipes={recipes} />;
}
