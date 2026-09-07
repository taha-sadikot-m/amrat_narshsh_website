import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '../components/AppProviders';
import { getCategories, getProducts } from '../lib/catalog';
import '../index.css';

export const metadata: Metadata = {
  title: 'Amrat Narsih | Authentic Gujarati Instant Mixes & Traditional Foods',
  description:
    'Generations of flavour since 1956. Discover Amrat Narsih authentic Gujarati instant mixes, traditional snacks, and festive specialities crafted for the modern kitchen.',
  openGraph: {
    title: 'Amrat Narsih | Authentic Gujarati Instant Mixes & Traditional Foods',
    description:
      'The taste of Gujarat, made simple. Heritage instant mixes since 1956 - Bhajiya, Dalwada, Gota, Handwa, Surti Locho, Khichu and more.',
    type: 'website',
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Noto+Sans+Gujarati:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FFFBF5] text-[#3E2723] font-sans antialiased selection:bg-[#D46A1E] selection:text-white">
        <AppProviders products={products} categories={categories}>{children}</AppProviders>
      </body>
    </html>
  );
}
