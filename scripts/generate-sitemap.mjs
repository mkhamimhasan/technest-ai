/**
 * Generates public/sitemap.xml from every published post in Firestore.
 *
 * Setup (one-time):
 *   1. Firebase Console > Project Settings > Service Accounts > Generate new private key.
 *   2. Save the downloaded JSON somewhere OUTSIDE the repo, e.g. ~/technest-ai-service-account.json
 *      (never commit a service account key).
 *   3. Set an env var before running: export GOOGLE_APPLICATION_CREDENTIALS=~/technest-ai-service-account.json
 *
 * Run:
 *   npm run generate-sitemap
 *
 * This writes public/sitemap.xml, which Vite then copies into the build
 * output automatically since anything in /public is served as-is.
 * Re-run this after publishing new posts, or wire it into a CI job that
 * runs on a schedule (e.g. GitHub Actions cron) for full automation.
 */
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const SITE_URL = process.env.VITE_SITE_URL || 'https://technest-ai-kappa.vercel.app';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function initAdmin() {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath) {
    const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
    return initializeApp({ credential: cert(serviceAccount) });
  }
  return initializeApp({ credential: applicationDefault() });
}

async function main() {
  initAdmin();
  const db = getFirestore();

  const snap = await db.collection('posts').where('status', '==', 'published').get();
  const posts = snap.docs.map((d) => d.data());

  const staticUrls = [
    { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE_URL}/categories`, changefreq: 'weekly', priority: '0.5' },
    { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.3' },
    { loc: `${SITE_URL}/contact`, changefreq: 'monthly', priority: '0.3' },
  ];

  const postUrls = posts.map((p) => ({
    loc: `${SITE_URL}/blog/${p.slug}`,
    lastmod: (p.updatedAt?.toDate?.() || new Date()).toISOString(),
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const allUrls = [...staticUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`✅ sitemap.xml written with ${allUrls.length} URLs -> ${outPath}`);
}

// Minimal slugify — mirrors src/utils/slugify.js without pulling in the
// `slugify` npm package for this one-off script.
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

main().catch((err) => {
  console.error('❌ Failed to generate sitemap:', err.message);
  process.exit(1);
});
