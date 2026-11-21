# MovaKT

Landing + sales site for Katerina's 3-lesson posture mini-course. Full spec: docs/SPEC.md. Product context: PRODUCT.md.

- Dev: `npm run dev` (http://localhost:4321)
- All copy lives in src/content/ru.json and src/content/en.json. No hardcoded strings in markup.
- Price and outbound links: src/config.ts only.
- Page: src/components/Landing.astro (takes `t` + `lang`). Service pages use src/components/Shell.astro.
- Design direction contract: .impeccable/surfaces/src-pages-index-astro.md. Palette «Молоко» (see DESIGN.md): light ground, ink, colour only in photos. Square corners, no shadows/gradients, 1px lines, Onest.

## Stage 2 (payments, access)
- Runs on Cloudflare Workers via @astrojs/cloudflare (static pages + server routes). Bindings in wrangler.jsonc, secrets in .dev.vars (template: .dev.vars.example).
- D1: `npx wrangler d1 migrations apply movakt --local` (migrations/).
- No STRIPE_SECRET_KEY → mock checkout (localhost only): purchase + token are created instantly, email is printed to the dev log.
- No RESEND_API_KEY → emails go to the dev log. No BUNNY_* → video placeholders on /watch.
- Signature test: `node --experimental-strip-types src/lib/stripe-sig.test.ts`.
- Deploy: `npx astro build && npx wrangler deploy` → https://movakt.dmrozenbergs.workers.dev. Remote D1 migrations: `npx wrangler d1 migrations apply movakt --remote`.
- Preview has `ALLOW_MOCK_CHECKOUT=1` in wrangler.jsonc vars (free mock checkout). Delete it before launch.
