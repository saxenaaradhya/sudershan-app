# TokenApp

A dark-themed token-based web application built with React + Vite.

## Features

- Sign Up / Sign In with session persistence
- Home page with category grid
- Wallet system with token purchase (10 / 50 / 100 tokens)
- Profile page with edit and logout
- Category detail pages with token-gated content

## Requirements

- Node.js v18+ (tested on v24.17.0)
- npm

## Installation

```bash
# Clone or download the project
cd tokenapp

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## Run (Development)

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Build (Production)

```bash
npm run build
```

Output is in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel
1. Push code to GitHub
2. Import repo on vercel.com
3. Framework: Vite (auto-detected)
4. Add environment variables from `.env.example`
5. Deploy

### Netlify
1. Push code to GitHub
2. Import repo on netlify.com
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

## Troubleshooting

**`npm install` fails**
- Ensure Node.js v18+ is installed: `node -v`
- Delete `node_modules` and `package-lock.json`, then re-run `npm install`

**Blank page after `npm run dev`**
- Check browser console for errors
- Ensure `index.html` is in the root folder, not inside `src/`

**Styles not loading**
- Ensure `tailwind.config.js` content paths include `./src/**/*.{js,jsx}`
- Ensure `index.css` is imported in `main.jsx`

**Routes return 404 on Vercel/Netlify**
- Vercel: add `vercel.json` with rewrites to `index.html`
- Netlify: add `_redirects` file in `public/` with `/* /index.html 200`
