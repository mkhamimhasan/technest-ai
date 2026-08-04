# TechNest AI — Unified Site (Public + Admin CMS)

Your original public site (design untouched) merged with the Admin CMS.

```
/                current homepage — unchanged
/blog            now reads published posts from Firestore
/blog/:slug      single article — Markdown content from Firestore
/categories      categories — from Firestore
/about /contact  unchanged

/admin/login     admin sign-in
/admin           dashboard (protected — your email only)
/admin/posts     create / edit / delete / publish / schedule posts
/admin/categories, /admin/tags
```

## Setup

1. `npm install`
2. `cp .env.example .env` — already pre-filled with your Firebase project's
   admin email. Fill in the six `VITE_FIREBASE_*` values from
   **Firebase Console → Project Settings → General → Your apps → Web app**.
3. `npm run dev`
4. Visit `/admin/login` and sign in with `mkhamim1050100@gmail.com`
   (you'll need to create this user once under **Firebase Console →
   Authentication → Users → Add user**, if you haven't already).

## Deploy

- Push this folder to your existing GitHub repo (replacing the old `src/`
  and root config files) and let Vercel redeploy, or drag-and-drop deploy.
- `firestore.rules` and `storage.rules` here already match what you published
  earlier — no changes needed on that front.
- Firestore composite indexes: run `firebase deploy --only firestore:indexes`,
  or just click the link Firebase prints in the browser console the first
  time a query needs an index it doesn't have yet.

## ⚠️ Important: Image uploads need Firebase Storage (Blaze plan)

You chose to skip Firebase Storage for now (it requires the Blaze
pay-as-you-go plan). That means the **featured image / gallery upload**
button in the post editor won't work yet — you can still write and publish
posts, just without images, until either:

- You upgrade to Blaze (small blogs stay within the free quota), or
- You swap `src/services/storageService.js` for a free alternative like
  Cloudinary (ask me and I'll wire that in).

## What changed from the old site

- `Home.jsx`, `Blog.jsx`, `Article.jsx`, `Categories.jsx` — same design,
  now fetch from Firestore instead of `src/data/posts.js` (removed).
- Everything else (`Navbar`, `Footer`, `About`, `Contact`, `NotFound`,
  colors, fonts, layout) is untouched.
