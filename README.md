# Amrat Narsih

Full-stack storefront: **Next.js** serves the UI and `/api` from one Node process.

## Run locally

**Prerequisites:** Node.js 20+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL and the admin values
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `npm run dev` — development (pages + API) on port 3000
- `npm run build` then `npm start` — production server; `npm start` listens on `PORT` and falls back to 3000

This app requires **PostgreSQL** (`provider = "postgresql"` in `prisma/schema.prisma`). Neon, Supabase, or any hosted Postgres works.

## Environment variables

All of these must be set in production. Never commit real values; `.env` is gitignored.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_EMAIL` | Admin studio login |
| `ADMIN_PASSWORD` | Admin studio login |
| `ADMIN_SESSION_SECRET` | Long random string used to sign the admin session |
| `RAZORPAY_KEY_ID` | Razorpay key (Test Mode for sandbox) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret; server-only, never sent to the browser |

## Deploy to Render

`render.yaml` in the repo root defines the service, so you can create it as a Blueprint or configure a Web Service manually with the same settings:

- **Build command:** `npm ci && npm run build`
- **Start command:** `npm start`
- **Node version:** 20+

Steps:

1. Push this repo to GitHub and point Render at it.
2. Add every variable from the table above in the Render dashboard. Render supplies `PORT` itself — do not set it.
3. Before the first deploy, create the schema on the production database. This project uses `db push`, not migrations:

   ```bash
   DATABASE_URL="<production url>" npx prisma db push
   DATABASE_URL="<production url>" npx prisma db seed   # optional, seeds catalog content
   ```

Images under `public/images/` are committed to the repo and ship with every deploy, so hero banners and product packshots work immediately.

### Known limitation: admin uploads

Images uploaded through `/admin` are written to `public/uploads` on the server's local disk. Render's filesystem is ephemeral, so those files disappear on the next deploy or restart, and `public/uploads` is gitignored. To add imagery permanently, commit files to `public/images/` and reference them by path.

## Other hosting

| Platform | How |
|---|---|
| **Vercel** | Connect the repo and set the environment variables above. Uploads to `public/uploads` do not persist on serverless. |
| **Any Node VPS** (Hostinger Node, GoDaddy VPS) | `npm ci && npm run build`, then `npm start`. Set `PORT` if you need a port other than 3000. |
| **Shared PHP hosting** (typical GoDaddy/Hostinger shared) | **Cannot run this app.** Those plans only serve static files and PHP. Use a Node VPS, Render, or Vercel. |

## Admin studio

Open [http://localhost:3000/admin](http://localhost:3000/admin), using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

If those are unset, local defaults are `admin@amratnarsih.com` / `amratnarsih-admin`. Change them before deploying.

Use Studio to manage hero backgrounds (desktop + mobile), marquee offers, products and stock, orders, coupons, and contact inbox. Uploads go to `public/uploads` — see the limitation noted under Deploy to Render.


## API

- `GET /api/products`
- `GET /api/products/[slug]`
- `POST /api/coupons/validate`
- `POST /api/contact`
- `POST /api/orders`
- `GET /api/orders/[id]`
- `POST /api/payments/razorpay/order`
- `POST /api/payments/razorpay/verify`
