'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ImageIcon,
  Megaphone,
  Package,
  ShoppingBag,
  Ticket,
  Inbox,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hero', label: 'Hero images', icon: ImageIcon },
  { href: '/admin/offers', label: 'Offers', icon: Megaphone },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/inbox', label: 'Inbox', icon: Inbox },
];

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FCFAF5] text-[#191919] font-sans flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[#191919] text-[#FFF8EC] min-h-screen">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#F4C400]">Amrat Narsih</div>
          <div className="font-display font-black text-lg mt-1">Studio</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active ? 'bg-[#C90018] text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-[#F4C400]">
            <ExternalLink className="w-3.5 h-3.5" /> View storefront
          </a>
          <button type="button" onClick={logout} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-white">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#191919] text-white">
          <span className="font-display font-black">Studio</span>
          <button type="button" onClick={logout} className="text-xs">Sign out</button>
        </header>
        <div className="md:hidden overflow-x-auto bg-white border-b border-[#EADFCB]">
          <div className="flex gap-1 px-2 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold ${
                  pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                    ? 'bg-[#C90018] text-white'
                    : 'bg-[#FCFAF5] text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
