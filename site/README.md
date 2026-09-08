Actress Film Library – a minimal site to host and browse a curated set of films featuring a specific actress.

## Getting Started

1. Install dependencies
```
npm install
```
2. Run the development server
```
npm run dev
```
3. Open the app
```
http://localhost:3000
```

## Project Structure
- `src/app` – App Router pages (`/`, `/movies`, `/movies/[slug]`, `/about`)
- `src/data/movies.ts` – Actress profile and movies seed data
- `public/` – Static assets

## Customization
- Edit actress info and movies in `src/data/movies.ts`
- Replace `posterUrl` and `videoUrl` with your own assets
- Update SEO in `src/app/layout.tsx` metadata

## Build & Deploy
```
npm run build
npm start
```
Deploy to any Node-compatible host or Vercel.

## Gallery S3 Storage & Instagram Sync

The gallery uses an S3-compatible object storage bucket to store images and a versioned manifest at `gallery/manifest.json`.

### Architecture & Read Model
1. **Server-Side Read**: The `/gallery` route reads `gallery/manifest.json` from S3. If S3 is unreachable, misconfigured, or times out (`GALLERY_READ_TIMEOUT_MS`), it safely falls back to the bundled images in `site/src/data/gallery.ts`.
2. **Instagram Adapter**: `site/src/lib/instagram/public-profile.ts` extracts public profile images and carousels from the configured profile (`INSTAGRAM_TARGET_URL`). Only HTTPS Instagram CDN URLs are allowed.
3. **Direct Streaming Upload**: `site/src/lib/gallery/sync.ts` downloads missing media from Instagram and streams the response directly to S3 without writing temporary files to disk.
4. **Idempotency**: Existing S3 objects are checked via `HeadObjectCommand` and skipped. The manifest is updated only after all image uploads succeed.

### Environment Variables
Configure the following in `.env` (or via `docker-compose.yml`):

| Variable | Description | Default |
|---|---|---|
| `S3_ENDPOINT` | Custom S3 endpoint URL (e.g. MinIO, CMC Cloud S3) | *(empty for AWS)* |
| `S3_REGION` | AWS / S3 region | `us-east-1` |
| `S3_BUCKET` | S3 bucket name | *(required)* |
| `S3_ACCESS_KEY_ID` | S3 access key | *(runtime injection)* |
| `S3_SECRET_ACCESS_KEY` | S3 secret key | *(runtime injection)* |
| `S3_FORCE_PATH_STYLE` | Set to `true` for MinIO / path-style S3 | `false` |
| `S3_PUBLIC_BASE_URL` | Base public URL for serving images (e.g. CDN or public bucket URL) | *(required for public URLs)* |
| `INSTAGRAM_TARGET_URL` | Target Instagram profile URL | `https://www.instagram.com/lamthanhmy/` |
| `GALLERY_SYNC_TOKEN` | Secret authorization token for the sync API | *(required for sync)* |
| `GALLERY_READ_TIMEOUT_MS` | Manifest retrieval timeout before fallback | `3000` |
| `INSTAGRAM_TIMEOUT_MS` | Profile fetch timeout | `10000` |
| `INSTAGRAM_DOWNLOAD_TIMEOUT_MS` | Media download timeout | `15000` |
| `INSTAGRAM_MAX_RESPONSE_BYTES` | Maximum HTML response bytes from profile | `5000000` |
| `INSTAGRAM_MAX_IMAGES` | Max images to extract per sync | `200` |
| `GALLERY_MAX_IMAGES` | Max images allowed in the manifest | `500` |

### Triggering Gallery Sync
Send a `POST` request to `/api/gallery/sync` with the secret token:

```bash
curl -X POST https://your-domain.com/api/gallery/sync \
  -H "x-gallery-sync-token: YOUR_SECRET_TOKEN"
```

Response:
```json
{
  "ok": true,
  "timestamp": "2026-09-08T14:40:00.000Z",
  "discovered": 12,
  "uploaded": 3,
  "skipped": 9,
  "failed": 0,
  "images": 12
}
```

### Legacy Migration
To migrate local images in `site/public/gallery_images/` to S3 and merge them into the manifest:

```bash
# Dry run to preview actions:
npm run gallery:migrate-legacy -- --dry-run

# Run migration (uploads images to gallery/legacy/* and updates manifest):
npm run gallery:migrate-legacy
```

