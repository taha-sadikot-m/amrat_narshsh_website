export type ProductCategory = 'instant-mixes' | 'traditional-favourites' | 'sweet-moments';

export interface Category {
  id: ProductCategory;
  name: string;
  gujaratiName: string;
  description: string;
  color: string;
  tagline: string;
  sortOrder: number;
}

export type MoodTag = 'crispy' | 'savoury' | 'sweet' | 'breakfast' | 'evening-snack' | 'fast-easy' | 'festive' | 'gluten-free' | 'traditional';

export type DietaryFilterId =
  | 'all'
  | 'gluten-free'
  | 'high-protein'
  | 'fasting-farali'
  | 'steamed-low-fat'
  | 'quick-prep'
  | 'zero-preservatives';

export type SortOptionId =
  | 'popularity'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'cooking-time'
  | 'name-asc';

export interface ProductPackSize {
  weight: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  makesCount?: string;
  isDefault?: boolean;
  stock?: number;
}

export interface NutritionItem {
  name: string;
  amount: string;
  dailyValue?: string;
}

export interface HowToPrepareStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface Product {
  id: string;
  name: string;
  gujaratiName: string;
  hindiName?: string;
  slug: string;
  category: ProductCategory;
  categoryName: string;
  tagline: string;
  description: string;
  culinaryStory: string;
  heroColor: string; // packaging background color
  accentColor: string;
  badgeColor?: string;
  packSizes: ProductPackSize[];
  defaultWeight: string;
  defaultPrice: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  makesText: string;
  badges: string[];
  ingredients: string[];
  verifiedNutrition: NutritionItem[];
  preparationSteps: HowToPrepareStep[];
  cookingTimeMinutes: number;
  difficulty: 'Easy' | 'Moderate' | 'Quick';
  servingSuggestion: string;
  pairingChutney: string;
  allergens: string[];
  shelfLife: string;
  moodTags: MoodTag[];
  isBestseller?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  inStock: boolean;
  stockCount: number;
  imageUrl?: string;
}

export interface PublicComboItem {
  productId: string;
  quantity: number;
  name: string;
  slug: string;
  imageUrl?: string;
  weight: string;
  price: number;
  makesText: string;
  heroColor: string;
  gujaratiName: string;
}

export interface PublicCombo {
  id: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice: number;
  discount: number;
  sortOrder: number;
  items: PublicComboItem[];
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  gujaratiTitle: string;
  slug: string;
  productId: string;
  productName: string;
  heroDishColor: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  difficulty: 'Easy' | 'Intermediate' | 'Quick';
  category: string;
  description: string;
  ingredients: {
    sectionTitle?: string;
    items: string[];
  }[];
  steps: RecipeStep[];
  chefTips: string[];
  pairing: string;
  tags: string[];
}

export interface CartItem {
  id: string; // product-id + weight, or combo-{comboId}-{productId}-{weight}
  productId: string;
  name: string;
  gujaratiName: string;
  weight: string;
  price: number;
  quantity: number;
  heroColor: string;
  makesText?: string;
  comboId?: string;
  comboName?: string;
  comboUnitQty?: number;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minOrderValue: number;
  description: string;
}

export interface OrderAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  address: OrderAddress;
  paymentMethod: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  productName: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export type PageView = 
  | 'home'
  | 'about'
  | 'products'
  | 'shop'
  | 'product-detail'
  | 'journey'
  | 'our-story'
  | 'contact'
  | 'where-to-buy'
  | 'partner'
  | 'faq'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'order-tracking'
  | 'privacy'
  | 'terms'
  | 'shipping'
  | 'returns'
  | 'combos';
