import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/library.ts'],
  dts: false,
  format: ['esm'],
  outDir: 'dist',
  clean: false,
  splitting: false,
  sourcemap: false,
  target: 'es2022',
  noExternal: ["ai-dungeon-sdk", "node_modules/**"],
  outExtension(ctx) {
    return { js: '.js' }; // Ensure output files have .js extension
  },
});
