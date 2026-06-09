# UTCC ENG Passbook

Cyberpunk event check-in passbook for UTCC Engineering activities, powered by UTCC AIoT Sphere.

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

1. Create a Firebase project.
2. Enable Firebase Authentication with Email/Password and Google providers.
3. Create Cloud Firestore in production mode.
4. Add a web app and copy config into `.env.local`.
5. Deploy rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## First Admin

1. Register/sign in once from the app.
2. In Firestore, open `users/{uid}`.
3. Set `globalRole` to `admin`.
4. Reload the app and open `/admin`.

Event Managers use `globalRole: "eventManager"`.

## Demo Seed

Use `seed/demo-seed.json` as a manual Firestore reference for:

- `UTCC AIoT Sphere Mini Open House`
- AIBI Lab
- AIX Pavilion
- AIX Studio
- AI Training Center
- `AIoT Sphere Explorer` badge
- completion reward config

For real QR codes, create stations through `/admin/events/{eventId}/stations`; the app generates unreadable `stationSecrets` and public station `qrUrl` values.

## Security Model

- All Firebase writes use the client SDK.
- No Next.js API Routes, Server Actions, middleware, or SSR runtime are used.
- QR station tokens are stored under `events/{eventId}/stationSecrets/{stationId}`.
- Participants cannot read station secrets.
- Firestore Rules compare the submitted check-in token against the secret doc.
- Reward claim status and check-in invalidation are staff-controlled.
- Audit logs are append-only.

## GitHub Pages

This repository is named `utcc-aiotsphere/eng-passbook`, so the GitHub Pages base path is `/eng-passbook`.

Deployment is handled by `.github/workflows/deploy.yml`. Add the Firebase public config values as GitHub Actions secrets.

For `https://utcc-aiotsphere.github.io/eng-passbook`, configure the repository Pages source to **GitHub Actions**. The build writes `out/.nojekyll` so GitHub Pages serves Next.js `/_next` assets correctly.

## Useful Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
```

`npm run build` outputs static files to `out/`.

## MVP Limitations

- Dynamic GitHub Pages URLs depend on static export behavior; QR URLs are generated in the required route format, but arbitrary deep-link refresh support may need a GitHub Pages fallback strategy in a later hardening pass.
- Admin user management is documented bootstrap-first; bulk role management UI can be expanded later.
- Charts are wired with production components and demo aggregates; deeper analytics queries can be added once event data volume is known.
