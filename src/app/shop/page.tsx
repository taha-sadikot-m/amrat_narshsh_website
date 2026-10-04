import { ShopPage } from '../../components/shop/ShopPage';
import { getProducts } from '../../lib/catalog';
import { filterStorefrontProducts } from '../../lib/storefront-catalog';

export default async function ShopRoute() {
  const products = await filterStorefrontProducts(await getProducts());
  return <ShopPage products={products} />;
}
