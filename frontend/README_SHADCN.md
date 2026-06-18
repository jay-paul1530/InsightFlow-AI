# IntelliQuery: TypeScript, Tailwind & shadcn UI Setup Guide

This guide details how to upgrade the current Next.js project to support **TypeScript**, **Tailwind CSS**, and **shadcn UI** to utilize the newly added `HeroLanding` component.

---

## 1. Upgrade to TypeScript

Next.js detects TypeScript configuration files automatically and handles dependency installation.

1. Create an empty `tsconfig.json` file in the root of the `frontend` folder:
   ```bash
   touch tsconfig.json
   # Or in PowerShell:
   New-Item tsconfig.json
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   Next.js will automatically detect the file, install the required compiler types (`typescript`, `@types/react`, `@types/node`, `@types/react-dom`), and populate `tsconfig.json` with recommended compiler flags.

---

## 2. Configure Tailwind CSS

If Tailwind CSS is not configured:

1. Install Tailwind CSS packages:
   ```bash
   npm install tailwindcss @tailwindcss/postcss postcss
   ```
2. Add the Tailwind import to the top of your `globals.css` file:
   ```css
   @import "tailwindcss";
   ```

---

## 3. Initialize shadcn UI

Initialize the shadcn workspace configuration.

1. Run the shadcn init script:
   ```bash
   npx shadcn@latest init
   ```
2. Choose the following prompts:
   - **Style**: `Default`
   - **Base color**: `Slate` (or your preference)
   - **CSS variables**: `Yes`
   - **Global CSS location**: `src/app/globals.css`
   - **Import alias**: `@/*`
   - **Components directory**: `src/components`
   - **Utils utility location**: `src/lib/utils.ts`

This command generates `components.json` and updates `postcss` configurations.

---

## Why the `/components/ui` Directory is Crucial

1. **Separation of Concerns**: Reusable atomic UI primitives (e.g. Buttons, Dialogs, Cards, Inputs) reside in `/components/ui`. This keeps high-level layout components (like your custom chatbot elements or analytics grids) separate and organized under `/components`.
2. **shadcn Integration**: The `shadcn` CLI is hardcoded to download and install files under the configured `ui` components directory path. Keeping the directory at `src/components/ui` ensures that commands like `npx shadcn add button` work out of the box without manual adjustments.
