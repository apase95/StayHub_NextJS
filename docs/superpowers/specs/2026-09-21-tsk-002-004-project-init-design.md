# TSK-002 to TSK-004 Project Initialization Design

## Goal

Initialize StayHub as a minimal Next.js 15 App Router application using TypeScript strict mode, pnpm, Tailwind CSS v4, the StayHub design-system tokens, Inter font, and the required baseline shadcn/ui components so later Infra, Backend, and Frontend tasks can build on a consistent project foundation.

## Non-Goals

- Do not configure Docker, PostgreSQL, Prisma, migrations, or environment files.
- Do not implement NextAuth, middleware, route protection, sessions, or app providers.
- Do not add VNPay, Cloudinary, Nodemailer, React Query, Zustand, React Hook Form, Zod, Playwright, Jest, or other later-task dependencies unless an official setup command requires them for this scope.
- Do not build application pages, API route handlers, business logic, layouts beyond the scaffolded root shell, or feature components outside generated shadcn/ui files.
- Do not hand-edit generated shadcn/ui component internals after generation.

## Context

The repository currently contains documentation and git metadata, with no `src/` application tree or package manifest. `docs/tasklist/TaskList.md` defines TSK-002 as the Next.js 15 App Router, strict TypeScript, pnpm, package setup task; TSK-003 as Tailwind CSS v4 plus design-system CSS variables and Inter font; and TSK-004 as shadcn/ui setup with `Button`, `Input`, `Card`, `Badge`, `Dialog`, `Select`, `Tabs`, and `Skeleton`. `docs/architecture/2_TechStack.md` requires Next.js 15, Node 20+, pnpm only, Tailwind v4, per-component shadcn/ui installation, Lucide React alignment with shadcn/ui, and the `@/*` alias. `docs/contributors/Rules.md` requires TypeScript strictness, `@/` imports, kebab-case project files, named component exports except Next.js route files, and generated shadcn/ui files left as generated. `docs/ui/UXUI_DesignSystem.md` defines the colors, Inter typography, and radius values that must be exposed through CSS variables.

## Proposed Architecture

Use official CLIs as the source of truth for the scaffold instead of recreating config by hand. Because the repository already contains documentation, the implementation should run `create-next-app` with TypeScript, App Router, `src/`, pnpm, and `@/*` alias options in a temporary directory, then copy the generated application files into the repository. This keeps Next.js, ESLint defaults, TypeScript config, Tailwind v4 integration, and package scripts aligned with the current Next.js release without overwriting existing docs.

Tailwind should remain in the v4 shape emitted by the current Next.js scaffold. StayHub-specific design tokens should be added as CSS custom properties in `src/app/globals.css`, then used by Tailwind/shadcn-compatible variables where applicable. The required token set is limited to the approved design-system colors and radii: primary coral, primary dark, heading text, muted text, white surface, light background, border, success, warning, rating, card radius, control radius, and pill radius. Inter should be configured through `next/font/google` in the root layout so font loading stays native to Next.js and does not require extra CSS imports or packages.

Initialize shadcn/ui with its CLI after the Next.js scaffold is in place, using the project alias and CSS-variable mode. Add only the approved baseline components: button, input, card, badge, dialog, select, tabs, and skeleton. Accept the CLI-created support files such as `components.json`, `src/components/ui/*`, and `src/lib/utils.ts` when generated because shadcn components rely on that structure. Do not add feature components or broader folder scaffolding in this scope.

This architecture intentionally favors generated defaults and small token edits over custom setup. It satisfies Sprint 0 initialization while leaving Docker, Prisma, auth, API standards, utility helpers beyond shadcn's `cn()`, and feature UI for later tasks.

## Files To Change

New files expected from the Next.js scaffold, Tailwind integration, and shadcn setup:

- `package.json`
- `pnpm-lock.yaml`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `next-env.d.ts`
- `components.json`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/skeleton.tsx`
- `src/lib/utils.ts`
- Any scaffolded public assets created by `create-next-app`, if the CLI emits them.

Existing files that may be modified by scaffold integration:

- `.gitignore`

No files under `prisma/`, `.github/`, auth, payment, upload, email, API, service, schema, or domain type paths should be created for this scope.

## Testing Strategy

- Run `pnpm install` as part of CLI setup and keep only `pnpm-lock.yaml`; do not create npm or yarn lock files.
- Run `pnpm lint` to verify the scaffold and generated shadcn files pass the configured Next.js lint rules.
- Run `pnpm build` to verify Next.js compilation, Tailwind processing, Inter font setup, and TypeScript strict mode.
- Inspect `tsconfig.json` for `strict: true` and `@/*` path mapping.
- Inspect `src/app/globals.css` and `src/app/layout.tsx` to confirm StayHub tokens and Inter are wired without extra dependencies.
- Inspect `components.json` and `src/components/ui/` to confirm exactly the required baseline shadcn/ui components are present.

## Risks And Mitigations

- Risk: Next.js and shadcn CLIs may emit slightly different file shapes as their latest versions change. Mitigation: accept generated defaults where they are compatible with the approved stack, then verify required invariants: Next.js 15, App Router, strict TypeScript, pnpm lockfile, `@/*` alias, Tailwind v4, and required shadcn components.
- Risk: Tailwind v4 token conventions can conflict with older `tailwind.config.ts` expectations in the architecture docs. Mitigation: keep the current Next.js/Tailwind v4 generated setup as authoritative for this task and expose StayHub design tokens through CSS variables in `globals.css` rather than forcing older config structure.
- Risk: shadcn generation may add helper dependencies such as `class-variance-authority`, `clsx`, `tailwind-merge`, Radix packages, or Lucide React. Mitigation: allow only dependencies required by the generated approved components; do not add unrelated libraries for later tasks.
- Risk: Running a scaffold in a non-empty repository can overwrite docs or git metadata. Mitigation: scaffold in a temporary directory, copy only the approved generated application files into the repo, and review the resulting git diff before committing implementation changes.

## Decision Summary

- Use official `create-next-app` for the base project instead of manually authoring Next.js config.
- Use pnpm exclusively and commit `pnpm-lock.yaml`; do not use npm or yarn.
- Use Next.js App Router with `src/`, TypeScript strict mode, and `@/*` path alias.
- Keep Tailwind CSS v4 in the current generated form and add StayHub CSS variables in `src/app/globals.css`.
- Load Inter through `next/font/google` in `src/app/layout.tsx`.
- Initialize shadcn/ui with the CLI and CSS-variable mode.
- Generate only Button, Input, Card, Badge, Dialog, Select, Tabs, and Skeleton for TSK-004.
- Leave Docker, Prisma, environment config, auth, API handlers, providers, payments, uploads, email, and feature UI to later tasks.
