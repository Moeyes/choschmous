This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Supabase persistence (Registrations)

This project can persist registrations using Supabase instead of writing to the local mock JSON files.

Environment variables (add these in Vercel or locally):

- SUPABASE_URL - your Supabase project URL
- SUPABASE_SERVICE_ROLE_KEY - service role key (server-side writes)
- SUPABASE_ANON_KEY - optional (public client)
- SUPABASE_BUCKET - storage bucket name for photos (e.g., `uploads`)

How it works:

- When Supabase env vars are present, `/api/registrations` will write registrations to the `registrations` table and upload photos to Supabase storage.
- For team registrations, a `teams` row is created and member rows are added to `registrations`.
- A convenience script is available to export registrations from the DB to the local mock JSON file:

```bash
npm run export-registrations
```

This will write `lib/data/mock/registrations.json` with the current registrations from Supabase.

If Supabase is not configured, the API falls back to using the local `lib/data/mock/*.json` files (current behavior).

### Quick local test steps

1. Copy `.env.example` -> `.env.local` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (and `SUPABASE_BUCKET` if using storage).
2. npm install && npm run dev
3. From the UI or using curl/postman, submit a registration via `/register` (or POST to `/api/registrations`).
4. Verify registration rows in Supabase table `registrations` and photos in the specified bucket.
5. Optionally run `npm run export-registrations` to write `lib/data/mock/registrations.json` locally.


