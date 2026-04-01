# Farcaster Frames (SIDL)

This UI service exposes a minimal Farcaster Frames surface backed by the Conxian Gateway `/api/v1` API.

## Endpoints

- sBTC monitor frame: `GET /api/frames/sbtc`
- sBTC monitor image: `GET /api/frames/sbtc/image`
- Governance vote frame: `GET /api/frames/governance`
- Governance vote image: `GET /api/frames/governance/image`

## Local dev

1. Start the stack:

```bash
make auth
make start
```

2. Open the Frames URLs (they return HTML with `fc:frame:*` meta tags):

- `http://localhost:3000/api/frames/sbtc`
- `http://localhost:3000/api/frames/governance`

## Configuration

Frames fetch Gateway telemetry from:

- `CONXIAN_GATEWAY_URL` (preferred)
- `NEXT_PUBLIC_CORE_API_URL` (fallback)

In Docker Compose, `NEXT_PUBLIC_CORE_API_URL` is already wired for the UI container, so local usage should work without additional configuration.
