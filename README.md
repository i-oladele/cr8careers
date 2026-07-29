# Cr8Careers

Cr8Careers is a Vite/React learning and recruitment application backed by Supabase. It includes a public course catalogue, authenticated learner progress, server-graded quizzes, certificates, job listings, contact submissions, and an administrator dashboard.

## Requirements

- Node.js 20 or newer
- npm
- A Supabase project
- Supabase CLI for applying migrations

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

The application expects these browser-safe variables:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never expose a Supabase service-role key through a `VITE_` variable. Service-role credentials are only used by the local admin-creation script.

## Database setup

Apply migrations in `supabase/migrations` in timestamp order:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The security migrations enforce the following boundaries:

- Public users can read course catalogue metadata, not lesson content or quiz answers.
- Authenticated learners receive answer-free lesson content.
- Quiz grading and progress calculations run in database RPC functions.
- Learners cannot directly update certificate-eligibility fields.
- Lesson attachments are private and delivered through one-hour signed URLs.
- Admin authorization is based on immutable `app_metadata.role`, not user-editable metadata.

Create an administrator from a trusted local shell:

```bash
SUPABASE_SERVICE_ROLE_KEY='...' node scripts/create-admin.mjs admin@example.com 'strong-password'
```

Do not place the service-role key in `.env` used by Vite or commit it to source control.

## Commands

```bash
npm run dev        # local development server
npm run typecheck  # TypeScript checks, including strict null checks
npm run lint       # ESLint
npm test           # Vitest regression tests
npm run build      # production build
```

Run all four validation commands before deploying.

## Deployment

The project is configured for Vercel in `vercel.json`. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project, apply Supabase migrations first, and then deploy the application.

The Vercel configuration supplies a Content Security Policy, frame protection, MIME sniffing protection, a restrictive permissions policy, and a referrer policy. If a new external API, image host, font host, or embedded media provider is introduced, update the CSP deliberately rather than disabling it.

## Storage

- `course-thumbnails`: public catalogue thumbnails.
- `course-assets`: private lesson attachments.

New attachments store their object path in course JSON and resolve a short-lived signed URL when course content is loaded. Existing objects created before the private-storage migration should be checked after deployment; legacy thumbnails may be moved to `course-thumbnails` during operational cleanup.

## Testing and security checks

Unit tests currently cover local progress/certificate fallback behavior and collision-resistant authoring IDs. Supabase RLS and RPC behavior should additionally be exercised against a disposable local Supabase instance before changes to authorization policies are deployed.

Dependency advisories can be checked with:

```bash
npm audit --omit=dev
```

React Router may report advisories limited to React Server Components. This application is a client-only Vite SPA, but router upgrades should still be reviewed as patched compatible versions become available.
