// Create (or promote) a Supabase admin user for the CR8Careers LMS.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY='your-service-role-key' \
//     node scripts/create-admin.mjs admin@example.com 'YourStrongPassword'
//
// The service-role key lives in Supabase Dashboard > Project Settings > API.
// Pass it inline as shown — do NOT add it to .env (that file is exposed to the browser).
import { readFileSync } from 'node:fs';

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error("Usage: SUPABASE_SERVICE_ROLE_KEY='...' node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY (Dashboard > Project Settings > API > service_role).');
  process.exit(1);
}

const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const url = (env.match(/^VITE_SUPABASE_URL=(.+)$/m)?.[1] ?? '').trim();
if (!url) {
  console.error('VITE_SUPABASE_URL not found in .env');
  process.exit(1);
}

const res = await fetch(`${url}/auth/v1/admin/users`, {
  method: 'POST',
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  },
  // email_confirm bypasses any confirmation step; app_metadata.role is what the app checks.
  body: JSON.stringify({ email, password, email_confirm: true, app_metadata: { role: 'admin' } }),
});

const data = await res.json();
if (!res.ok) {
  console.error('Failed to create admin:', data);
  process.exit(1);
}

console.log(`Created admin user: ${data.email} (id ${data.id})`);
console.log('Sign in at /admin/login with that email and password.');
