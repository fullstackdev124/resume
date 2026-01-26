# resume (Next.js + TypeScript)

Development

```bash
cd resume
npm install
npm run dev
```

Build

```bash
npm run build
npm start
```

### Windows executable (Electron)

The app can run as a Windows desktop exe. Downloads (resume PDF, cover letter .docx/.txt) are saved to your **Downloads** folder and **overwrite** existing files with the same name (no `"file (1).pdf"`).

- **Dev (Electron + Next):** `npm run electron:dev` — starts Electron and the Next dev server.
- **Build exe:** `npm run electron:build` — produces a portable `.exe` in `dist/` (run `npm install` first to get `electron` and `electron-builder`).

Notes

- App scaffolded with `create-next-app` (TypeScript template).
 - App scaffolded with `create-next-app` (TypeScript template).
 - UI: `src/app/page.tsx`, components in `src/components`.

Run dev server already uses port 3333.

Claude / Anthropic setup

- Create a file named `.env.local` at the project root and add your API key:

```bash
ANTHROPIC_API_KEY=sk-xxxx
```

- Optionally set `ANTHROPIC_MODEL` to override the model used by the server.
- The project uses `src/app/api/route.ts` as a Route Handler that calls the Anthropic SDK.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
