import { redirect } from 'next/navigation';
import { getCustomerSession } from '@/lib/customer-auth';
import { safeNextPath } from '@/lib/safe-next-path';
import { LoginClient } from './LoginClient';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNextPath((await searchParams).next);
  const customer = await getCustomerSession();
  if (customer) redirect(next);
  return <LoginClient next={next} />;
}
