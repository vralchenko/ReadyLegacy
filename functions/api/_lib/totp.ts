import * as OTPAuth from 'otpauth';

export function generateSecret(): string {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

export function generateUri(secret: string, email: string): string {
  const totp = new OTPAuth.TOTP({
    issuer: 'ReadyLegacy',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  return totp.toString();
}

export function verifyCode(secret: string, code: string): boolean {
  const totp = new OTPAuth.TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  // Allow 1 period window for clock skew
  const delta = totp.validate({ token: code, window: 1 });
  return delta !== null;
}

export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const arr = new Uint8Array(4);
    crypto.getRandomValues(arr);
    const num = ((arr[0] << 24) | (arr[1] << 16) | (arr[2] << 8) | arr[3]) >>> 0;
    codes.push(String(num % 100000000).padStart(8, '0'));
  }
  return codes;
}
