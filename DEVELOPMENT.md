# Development Guide

## Prerequisites

- [Node.js](https://nodejs.org) v20+
- [pnpm](https://pnpm.io) v10+

```bash
npm install -g pnpm
```

## Install dependencies

```bash
pnpm install
```

## Development

Start the dev server with hot reload (defaults to Chromium):

```bash
pnpm dev
```

Target a specific browser:

```bash
pnpm dev --browser=firefox
pnpm dev --browser=edge
```

## Build

| Command | Output |
|---|---|
| `pnpm build` | `dist/chromium/` |
| `pnpm build:firefox` | `dist/firefox/` |
| `pnpm build:edge` | `dist/edge/` |

Build all targets at once:

```bash
pnpm build && pnpm build:firefox && pnpm build:edge
```

## Load extension in browser

**Chrome / Edge**
1. Go to `chrome://extensions` or `edge://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `dist/chromium/`

**Firefox**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on** → select any file inside `dist/firefox/`

## Pack CRX (Chrome only)

Generate a private key once (keep it safe):

```bash
openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out key.pem
```

Pack the extension:

```bash
google-chrome --pack-extension=./dist/chromium --pack-extension-key=key.pem --no-message-box
```

This produces `dist/chromium.crx`. Using the same `key.pem` every time keeps the extension ID consistent.

> Do not commit `key.pem`. It is listed in `.gitignore`.

## Versioning

**Both files must have the same version before releasing**, or the CI will fail.

- `package.json` → `"version"`
- `src/manifest.json` → `"version"`

## Release

Releases are automated via GitHub Actions. To trigger one:

1. Bump the version in both `package.json` and `src/manifest.json`
2. Commit and push
3. Create and push a tag:

```bash
git tag v5.1.0
git push origin v5.1.0
```

The workflow will:
- Verify versions match
- Build Chromium and Firefox targets
- Pack a `.crx` using `CHROME_CRX_PRIVATE_KEY` secret
- Create a GitHub Release with three files attached:
  - `bandwidth-hero-vX.Y.Z.crx`
  - `bandwidth-hero-chromium-vX.Y.Z.zip`
  - `bandwidth-hero-firefox-vX.Y.Z.zip`

### Required secret

| Secret | Description |
|---|---|
| `CHROME_CRX_PRIVATE_KEY` | Contents of `key.pem` used to sign the CRX |
