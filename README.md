# Hydroponic Nutrient Calculator

Free, open-source web calculator for hydroponic nutrient solutions. Enter fertilizer salts and instantly see ion concentrations in ppm and me/L — no signup required.

**Live:** [hydro-nutrient-calc.pages.dev](https://hydro-nutrient-calc.pages.dev)

## Features

- **Preset Recipes** — Hoagland, Modified Hoagland, Yamazaki Lettuce/Tomato/Strawberry
- **Chemical Input Mode** — manually enter fertilizer salt amounts, see resulting ion concentrations
- **Target Solver** — specify desired ion targets, auto-calculate optimal chemical mix (NNLS solver)
- **Stock Solution Helper** — calculate concentrate volumes for Tank A / Tank B setups
- **Ion Visualization** — bar charts for concentration breakdown by chemical
- **Nutrient Ratios** — N:P:K, Ca:Mg, NO₃:NH₄, K:Ca diagnostic ratios
- **EC Estimation** — estimated electrical conductivity (mS/cm)
- **Unit Switching** — toggle between ppm (mg/L) and me/L
- **Water Volume Scaling** — set litre amount, see grams per chemical
- **Custom Recipes** — save/load via localStorage
- **Export** — copy text or download CSV
- **i18n** — English, 繁體中文, 简体中文
- **Dark / Light Mode** — system-aware with manual toggle
- **Responsive** — works on mobile and desktop

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | [Astro](https://astro.build) + [React](https://react.dev) |
| Language | TypeScript |
| Styling | CSS Modules + CSS custom properties |
| Testing | [Vitest](https://vitest.dev) + Testing Library (289 tests, 92% coverage) |
| Linting | [Biome](https://biomejs.dev) |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com) |
| CI | GitHub Actions |

## Development

```bash
# Install dependencies
npm install

# Start dev server (localhost:4321)
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The project is configured for Cloudflare Pages.

### Environment Variables (optional)

| Variable | Purpose |
|----------|---------|
| `PUBLIC_GA_ID` | Google Analytics 4 measurement ID (`G-XXXXXXXXXX`) |
| `PUBLIC_ADSENSE_ID` | Google AdSense publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) |

## Project Structure

```
src/
├── components/     # React components + tests
├── data/           # Chemical & recipe data
├── engine/         # Calculation engine + NNLS solver
├── i18n/           # Locale files (en, zh-TW, zh-CN)
└── pages/          # Astro page (index.astro)
public/
├── favicon.svg
├── og-image.svg
├── robots.txt
└── _headers        # Cloudflare security headers
```

## License

MIT
