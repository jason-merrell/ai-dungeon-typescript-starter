import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';

const tsconfigPath = path.resolve('./tsconfig.json');

export default {
  input: 'src/library.ts',
  output: {
    file: 'dist/library.js',
    format: 'esm',
    exports: 'named',
    intro: '// Custom helper functions for AI Dungeon scripts',
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    typescript({ tsconfig: tsconfigPath })
  ],
  external: [], // Do not treat anything as external
  treeshake: true,
};
