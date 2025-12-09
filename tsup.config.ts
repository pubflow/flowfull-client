import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'react/index': 'src/react/index.ts',
    'react-native/index': 'src/react-native/index.ts',
    'nextjs/index': 'src/nextjs/index.ts',
    'nextjs/server': 'src/nextjs/server.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', 'react-native'],
});

