# AI Dungeon Scripts Starter

A TypeScript starter for building AI Dungeon script packs with full type safety, modern build tooling, and ergonomic developer experience.

## Getting Started

```sh
npx ai-dungeon-typescript-starter my-new-project
```

This command will create a new AI Dungeon TypeScript project in the `my-new-project` directory. Then, install dependencies and start developing your scripts.

```sh
cd my-new-project
npm install
```

## Features

- **TypeScript-first:** Write scripts in TypeScript for type safety and editor autocompletion.
- **Automatic SDK Helper Exports:** Any helper you import in your scripts (e.g., `deepFreeze` from `ai-dungeon-sdk`) is automatically exported from `library.ts` for use in the AI Dungeon environment.
- **No manual export management:** The build process ensures all needed exports are present and removes any redundant ones.
- **Modern ESM output:** All code is bundled as ESM for compatibility with modern tools and the AI Dungeon scripting environment.
- **Portable:** All build scripts and configs are local to this starter directory.

## Project Structure

```plaintext
apps/ai-dungeon-typescript-starter/
├── src/
│   ├── context.ts   # Your context modifier script
│   ├── input.ts     # Your input modifier script
│   ├── output.ts    # Your output modifier script
│   └── library.ts   # All custom helpers and auto-exported SDK helpers
├── dist/            # Compiled JS output (ready for AI Dungeon)
├── scripts/   # Build automation scripts
├── rollup.config.mjs
├── package.json
└── ...
```

## Usage

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Develop your scripts:**
   - Write your logic in `src/context.ts`, `src/input.ts`, and `src/output.ts`.
   - Place any custom helpers in `src/library.ts`.
   - Import any helpers you need from `ai-dungeon-sdk` or other packages—no need to manually export them from `library.ts`.

3. **Build:**
   ```sh
   npm run build
   ```
   This will:
   - Ensure all needed exports are present in `library.ts` (and remove redundant ones)
   - Compile TypeScript
   - Bundle all code (including SDK helpers) into ESM JS files in `dist/`
   - Post-process output for AI Dungeon compatibility

4. **Deploy:**
   - Use the files in `dist/` (`context.js`, `input.js`, `output.js`, `library.js`) in the AI Dungeon scripting environment.

## How It Works

- The build script scans your script files for all imports and ensures they are exported from `library.ts`.
- All exports are bundled and inlined using Rollup, so `library.js` contains everything needed—no `require` or `import` statements.
- The output scripts are ready to be copy-pasted or uploaded to AI Dungeon.

## Example: Using SDK Helpers

```ts
// src/context.ts
import { deepFreeze } from 'ai-dungeon-sdk';

export function modifier({ text }) {
  return deepFreeze({ text: text.toUpperCase() });
}
```
You do **not** need to add `export { deepFreeze } from 'ai-dungeon-sdk';` to `library.ts`—the build will do it for you.

## Scripts
- `npm run build` — Full build (auto-exports, compile, bundle, post-process)
- `npm run clean` — Remove build output

## Requirements
- Node.js 18+
- npm/pnpm/yarn for package management

## License
MIT
