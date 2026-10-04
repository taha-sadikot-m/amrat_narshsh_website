/** National 10-digit Indian mobile, or null. */
export function indianPhoneDigits(input: string): string | null {
  const digits = String(input ?? '').replace(/\D/g, '');
  let national = digits;
  if (digits.length === 12 && digits.startsWith('91')) national = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) national = digits.slice(1);
  if (national.length !== 10) return null;
  if (!/^[6-9]/.test(national)) return null;
  return national;
}

export function normalizeIndianE164(input: string): string | null {
  const digits = indianPhoneDigits(input);
  return digits ? `+91${digits}` : null;
}

/** True only when the number is a valid Indian mobile and the captcha is solved. */
export function canRequestOtp(phone: string, captchaSolved: boolean): boolean {
  return Boolean(captchaSolved && normalizeIndianE164(phone));
}

export function phonesMatch(a: string, b: string): boolean {
  const left = indianPhoneDigits(a);
  const right = indianPhoneDigits(b);
  return Boolean(left && right && left === right);
}
