# Maya AI Studio

Production-oriented full-stack AI image generation platform scaffold using:
- **Frontend:** Next.js 14 + React + Tailwind
- **Backend:** Node.js + Express + Socket.IO
- **Database:** PostgreSQL
- **Auth:** JWT
- **Generation:** Stable Diffusion API compatible (`/sdapi/v1/txt2img`)
- **Storage:** S3-compatible abstraction (replaceable adapter)
- **Deployment:** Docker Compose

> This implementation is intentionally safety-oriented and suitable for policy-compliant image generation workflows.

## Features
- Prompt-based text-to-image generation with advanced controls.
- Style presets (realistic, anime, fantasy, cinematic, portrait, illustration, waifu).
- Character creator with persistent reusable character profiles.
- Prompt builder API endpoint.
- User gallery (download/delete/favorite).
- Credit system with free + paid plans.
- Admin dashboard endpoints for users/stats/moderation.
- Queue-based generation execution + WebSocket status updates.

## Project structure

```text
/backend
  /src
    /config
    /middleware
    /routes
    /services
/frontend
  /app
  /lib
/postgres/schema.sql
/docker
/docker-compose.yml
```

## Run locally

1. Copy env files and adjust values if needed:
   - `backend/.env.example`
   - `frontend/.env.example`
2. Start services:

```bash
docker compose up --build
```

3. Open:
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:4000/health`

## Admin bootstrap
Use `ADMIN_EMAIL` in `backend/.env.example` so that this account is auto-created with admin role at registration.

## Stable Diffusion backend
Set `STABLE_DIFFUSION_API_URL` to:
- local AUTOMATIC1111 service (`http://host.docker.internal:7860` from Docker), or
- a hosted SD-compatible endpoint.

## Important hardening before production
- Replace data-URL storage adapter with real S3 SDK upload + signed URLs.
- Add rate limiting, request validation (zod/joi), and audit logs.
- Add background worker (BullMQ/Redis) for horizontal scaling.
- Add payment integration for plan billing.
- Add moderation/safety filters and policy enforcement.
