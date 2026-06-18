# MozPay Frontend

[![Svelte](https://img.shields.io/badge/Svelte-5-%23ff3e00?logo=svelte)](https://svelte.dev)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-%23ff3e00?logo=svelte)](https://kit.svelte.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-%2306b6d4?logo=tailwindcss)](https://tailwindcss.com)

Mozambique-focused installment trust and reminder platform — Progressive Web App frontend.

**MozPay** records installment plans, payment records, reminders, consent, disputes, and trust signals between merchants and customers. It explicitly does **not** move money, hold funds, settle, lend, or collect debt.

This repository contains only the **SvelteKit 5 PWA frontend**. The Django + DRF backend lives at [`EritonNaife/mozpay`](https://github.com/EritonNaife/mozpay).

---

## Tech Stack

- **SvelteKit 5** with runes mode
- **Tailwind CSS 4** + Vite integration
- **TypeScript**
- **Vite PWA** (`@vite-pwa/sveltekit`) for offline support and installability
- **Node adapter** for production builds

---

## Prerequisites

- [Node.js 22](https://nodejs.org/)
- A running MozPay backend **or** enable the built-in mock API (see [Mock API](#mock-api))

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

| Variable | Purpose | Default |
|----------|---------|---------|
| `BACKEND_URL` | Django backend base URL | `http://localhost:8000` |
| `JWT_SIGNING_KEY` | Must match the backend `JWT_SIGNING_KEY` | `unsafe-local-jwt-signing-key-for-development-only` |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins for CSRF checks | `http://localhost:5173,http://localhost:8000` |
| `VITE_USE_MOCK_API` | Run the frontend with the built-in mock API (no backend needed) | `false` |

### 3. Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

All `/api` requests are proxied to the backend configured in `BACKEND_URL`, so no CORS setup is required in development.

---

## Mock API

The frontend ships with a built-in mock API layer so you can run it standalone without a backend. It covers auth, merchant/customer dashboards, plans, payments, notifications, disputes, and scoring.

To use it, set the environment variable before starting the dev server:

```bash
# In .env
VITE_USE_MOCK_API=true
```

Or inline:

```bash
VITE_USE_MOCK_API=true npm run dev
```

Mock data lives in `src/lib/api/mock/` and is shared in memory while the dev server is running. Create plans, register payments, and resolve disputes to see the UI update immediately.

---

## Build & Preview

### Production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Type check

```bash
npm run check
```

---

## Docker

Build and run the frontend as a container:

```bash
# Build image
docker build -t mozpay-frontend .

# Run container
docker run -p 3000:3000 mozpay-frontend
```

The container exposes port `3000` and serves the Node-adapter production build.

---

## Project Structure

```
mozpay_frontend/
├── src/
│   ├── app.html              # HTML template
│   ├── app.css               # Global styles + Tailwind imports
│   ├── hooks.server.ts       # Server-side hooks (auth refresh, CSRF)
│   ├── lib/
│   │   ├── api/              # Typed API clients + mock layer (auth, merchant, plans, payments, ...)
│   │   ├── components/       # Reusable Svelte components
│   │   ├── icons/            # SVG icon paths
│   │   ├── stores/           # Svelte 5 $state rune stores
│   │   ├── utils/            # Helpers (money, case, score)
│   │   ├── assets/           # Static assets used in components
│   │   ├── index.ts          # Public lib exports
│   │   └── nav.ts            # Navigation helpers
│   └── routes/               # SvelteKit routes (merchant + customer flows)
├── static/                   # Static assets (icons, logos, favicon)
├── vite.config.ts            # Vite + Tailwind + PWA + proxy config
├── svelte.config.js          # SvelteKit Node adapter + runes config
├── tsconfig.json             # TypeScript config
├── Dockerfile                # Multi-stage production image
└── .env.example              # Environment variable template
```

---

## Key Features

- **Merchant flows**: onboarding, sale creation, plan preview, customer management, payment registration, disputes, notifications.
- **Customer flows**: login with PIN/OTP, plan consent, dashboard, payment confirmation, dispute, trust score.
- **Progressive Web App**: offline-capable, installable on Android, mobile-first design for low-end devices.
- **Mobile-first UX**: designed for small screens, intermittent connectivity, and Mozambican Portuguese (`pt-MZ`) copy.

---

## Backend Integration

This frontend expects the MozPay Django backend to be running and reachable via `BACKEND_URL`. The backend repository includes API contracts under `schemas/` and implementation specs under `specs/`.

See:

- [`EritonNaife/mozpay`](https://github.com/EritonNaife/mozpay) — backend monorepo
- Backend API contracts — `schemas/openapi.yaml`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production app |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run Svelte type-checker |
| `npm run check:watch` | Run type-checker in watch mode |

---

## License

This project is part of the MozPay system. Refer to the main [`mozpay`](https://github.com/EritonNaife/mozpay) repository for license information.
