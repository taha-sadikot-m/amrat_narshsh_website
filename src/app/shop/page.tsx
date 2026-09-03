import { ShopPage } from '../../components/shop/ShopPage';
import { getProducts } from '../../lib/catalog';

export default async function ShopRoute() {
  const products = await getProducts();
  return <ShopPage products={products} />;
}
