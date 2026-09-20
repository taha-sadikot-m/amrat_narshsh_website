export function safeNextPath(raw: unknown, fallback = '/account'): string {
  const value = String(raw ?? '').trim();
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return fallback;
  }
  if (value.includes('://')) return fallback;
  if (value === '/login' || value.startsWith('/login?') || value.startsWith('/login/')) {
    return fallback;
  }
  return value;
}
