import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import vue from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import { eslint } from 'rollup-plugin-eslint';
import sassPostcss from 'rollup-plugin-sass-postcss';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import autoprefixer from 'autoprefixer';

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

export default (async () => ({
  input: 'src/index.js',
  output: {
    name: '_____',
    exports: 'named',
    sourcemap: true,
    globals: {
      'bootstrap-vue': 'BootstrapVue',
      'vue': 'Vue',
      'vuex': 'Vuex'
    }
  },
  external: [
    'bootstrap-vue',
    'vue',
    'vuex'
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: true
    }),
    commonjs(),
    globals(),
    builtins(),
    json(),
    eslint(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    sassPostcss({
      output: 'dist/main.min.css',
      sourcemap: true,
      plugins: [
        autoprefixer()
      ]
    }),
    vue({
      css: true,
      compileTemplate: true
    }),
    buble({
      objectAssign: 'Object.assign'
    }),
    isProd && (await import('rollup-plugin-terser')).terser()
  ]
}))();
