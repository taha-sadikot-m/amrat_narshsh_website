import type { PageView, ProductCategory, MoodTag, DietaryFilterId, Product } from '../types';

export type NavigateParams = {
  productId?: string;
  category?: ProductCategory | 'all';
  mood?: MoodTag;
  search?: string;
  dietary?: DietaryFilterId;
  orderId?: string;
};

export function hrefForPage(page: PageView, params?: NavigateParams, products: Product[] = []): string {
  switch (page) {
    case 'home':
      return '/';
    case 'shop':
    case 'products': {
      const q = new URLSearchParams();
      if (params?.category && params.category !== 'all') q.set('category', params.category);
      if (params?.mood) q.set('mood', params.mood);
      if (params?.dietary && params.dietary !== 'all') q.set('dietary', params.dietary);
      if (params?.search) q.set('q', params.search);
      const qs = q.toString();
      return qs ? `/shop?${qs}` : '/shop';
    }
    case 'product-detail': {
      const product = products.find((p) => p.id === params?.productId || p.slug === params?.productId);
      return `/product/${product?.slug ?? params?.productId ?? ''}`;
    }
    case 'about':
    case 'our-story':
      return '/our-story';
    case 'journey':
      return '/journey';
    case 'checkout':
      return '/checkout';
    case 'contact':
    case 'partner':
    case 'where-to-buy':
      return '/contact';
    case 'order-tracking':
      return params?.orderId ? `/track-order/${encodeURIComponent(params.orderId)}` : '/track-order';
    case 'faq':
      return '/faq';
    case 'privacy':
      return '/privacy';
    case 'terms':
      return '/terms';
    case 'shipping':
      return '/shipping';
    case 'returns':
      return '/returns';
    case 'cart':
      return '/checkout';
    case 'account':
      return '/';
    default:
      return '/';
  }
}

export function pageFromPathname(pathname: string): PageView {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/shop')) return 'shop';
  if (pathname.startsWith('/product/')) return 'product-detail';
  if (pathname.startsWith('/our-story')) return 'our-story';
  if (pathname.startsWith('/journey')) return 'journey';
  if (pathname.startsWith('/checkout')) return 'checkout';
  if (pathname.startsWith('/contact')) return 'contact';
  if (pathname.startsWith('/track-order')) return 'order-tracking';
  if (pathname.startsWith('/faq')) return 'faq';
  if (pathname.startsWith('/privacy')) return 'privacy';
  if (pathname.startsWith('/terms')) return 'terms';
  if (pathname.startsWith('/shipping')) return 'shipping';
  if (pathname.startsWith('/returns')) return 'returns';
  return 'home';
}
