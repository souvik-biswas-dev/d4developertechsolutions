# Deployment Guide: Cloudflare Pages

This site is configured for a **Fully Static Export** on Cloudflare Pages. 
There are no Node.js backend requirements or server actions.

## Deployment Steps

1. **Push to GitHub**
   Ensure your code is pushed to your GitHub repository.

2. **Connect to Cloudflare**
   - Log into [Cloudflare Dashboard](https://dash.cloudflare.com/).
   - Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
   - Select your repository.

3. **Configure Build Settings**
   - **Project Name:** `d4developertechsolutions` (This ensures your URL is exactly `d4developertechsolutions.pages.dev`).
   - **Framework preset:** `Next.js (Static HTML Export)`.
   - **Build command:** `npm run build`
   - **Build output directory:** `out`

4. **Environment Variables (Optional)**
   - If you eventually use a custom domain, add `NEXT_PUBLIC_SITE_URL=https://d4developertechsolutions.com`. For now, it defaults to `https://d4developertechsolutions.pages.dev`.

5. **Deploy!**
   - Click "Save and Deploy". Cloudflare will automatically build and publish your site statically.

---

## Quick commands

### A) Git + GitHub (needs the GitHub CLI: https://cli.github.com)
```bash
git init -b main
git add .
git commit -m "Initial commit: D4Developer website"
gh auth login
gh repo create d4developertechsolutions --public --source=. --remote=origin --push
```

### B) Direct deploy to Cloudflare Pages (no dashboard)
```bash
npm run build
npx wrangler login
npx wrangler pages project create d4developertechsolutions --production-branch=main
npx wrangler pages deploy out --project-name=d4developertechsolutions --branch=main
```
Live at https://d4developertechsolutions.pages.dev (if the name is taken, Cloudflare adds a suffix).
