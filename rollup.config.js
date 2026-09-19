import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import cleaner from 'rollup-plugin-cleaner';
import { terser } from 'rollup-plugin-terser';

import packageJson from './package.json' with { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: packageJson.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      cleaner({ targets: ['./dist'] }),
      peerDepsExternal(),
      resolve({
        browser: true,
        extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
      }),
      commonjs(),
      typescript({
        compilerOptions: {
          declaration: true,
          declarationDir: './dist',
          noEmit: false,
        },
        include: ['**/*.ts', '**/*.tsx'],
        exclude: ['**/*.(test|stories).(ts|tsx)'],
      }),
      terser(),
    ],
  },
];
