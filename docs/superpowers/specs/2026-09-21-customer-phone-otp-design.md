# Spec: Customer phone OTP accounts (Amrat Narsih)

Date: 2026-09-21

## Problem

The store is catalog + guest cart + checkout with demo identity. There is no customer. Orders cannot be owned, addresses cannot be saved, and checkout cannot be trusted as a real person.

## Goals

- Browse, search, add to cart, wishlist without an account.
- Place an order only after proving a mobile number via SMS OTP (Firebase Phone Auth).
- One identity: phone. First OTP creates the customer; later OTPs log them in.
- Dedicated `/login` for navbar and account. Same OTP UI inlined on checkout so the bag is not abandoned.
- After login: profile name, saved addresses, order history; attach older guest orders that used the same phone.
- Server is source of truth for who is placing the order (ignore forged name/phone on the order payload for identity).

## Non-goals (v1)

- Email/password, forgot password, reset password, Google Sign-In.
- Server-synced cart or wishlist (keep localStorage).
- Loyalty, wallet, reviews, referrals.
- Admin impersonate customer. Admin remains env JWT.

## Identity and Firebase

- E.164 India numbers (`+91` + 10 digits). Reject other country codes in v1 unless already `+91`.
- Firebase JS SDK on the client: reCAPTCHA + `signInWithPhoneNumber`.
- Client receives Firebase ID token; `POST /api/auth/session` with `{ idToken }`.
- Server `firebase-admin` `verifyIdToken`; read `phone_number` and `uid`; upsert `Customer`.
- We do not send SMS ourselves. We do not store OTPs.
- Dev: Firebase test phone numbers. Production: Blaze billing.

Env: `NEXT_PUBLIC_FIREBASE_*` client config, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`, `FIREBASE_PROJECT_ID`, `CUSTOMER_SESSION_SECRET`.

## Session

- Cookie `amrat_customer_session`, httpOnly, `sameSite=lax`, `secure` in production, path `/`, ~30 days.
- JWT (`jose`) payload: `{ sub: customerId, phone }`. Different secret from admin.
- Middleware: `/account` and `/account/*` without cookie → `/login?next=<path>`.
- `/login` with a valid cookie → redirect to `next` or `/account`.
- `/checkout` stays public; order APIs return 401 without customer cookie.
- `POST /api/auth/logout` clears cookie. Firebase client `signOut` as well.

## Data model

**Customer:** `id` (cuid), `firebaseUid` unique, `phone` unique, `name` optional, `email` optional, timestamps.

**Address:** belongs to customer; shipping fields matching current order address; `isDefault`. At most one default per customer (app-enforced).

**Order:** nullable `customerId` FK `onDelete: SetNull`. On session create, attach unmatched orders whose phone digits match.

## APIs

- `POST /api/auth/session`, `POST /api/auth/logout`
- `GET/PATCH /api/me`
- `GET/POST /api/me/addresses`, `PUT/DELETE /api/me/addresses/[id]`
- `GET /api/me/orders`
- Order create and Razorpay order require session; phone = customer phone.
- `GET /api/orders/[id]` remains track-by-id for v1; account lists owner orders.

## Pages

- `/login` with `?next=` same-origin only.
- Checkout inlines `PhoneOtpForm` when logged out.
- `/account`, `/account/orders`, `/account/addresses`.
- Navbar Sign in / account menu.
- Remove demo checkout identity and demo cart seed.
