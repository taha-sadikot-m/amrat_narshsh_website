import { notFound } from 'next/navigation';
import { ProductDetailPage } from '../../../components/product/ProductDetailPage';
import { getProductBySlug, getProducts } from '../../../lib/catalog';
import { getRecipesByProductId } from '../../../lib/recipes';

export default async function ProductRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = (await getProducts()).filter((p) => p.id !== product.id).slice(0, 4);
  const recipes = await getRecipesByProductId(product.id);
  return <ProductDetailPage product={product} relatedProducts={related} recipes={recipes} />;
}
