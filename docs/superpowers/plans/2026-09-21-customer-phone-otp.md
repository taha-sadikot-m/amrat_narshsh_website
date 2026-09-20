# Customer phone OTP Implementation Plan

> Executed inline in the same session as the spec (2026-09-21).

**Goal:** Guest cart stays; checkout and account require Firebase phone OTP and a Prisma `Customer`.

**Architecture:** Firebase verifies SMS; `POST /api/auth/session` upserts the customer, links guest orders by phone digits, and sets `amrat_customer_session`. Order APIs require that cookie.

**Tech stack:** Next.js 15, Prisma, firebase, firebase-admin, jose.
