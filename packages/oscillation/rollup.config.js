import copy from 'rollup-plugin-copy';
import size from 'rollup-plugin-bundle-size';
import multi from '@rollup/plugin-multi-entry';

export default {
  input: 'modules/*.js',
  output: { file: 'build/oscillation.js', format: 'esm' },
  plugins: [
    multi(),
    size(),
    copy({ targets: [{ src: ['package.json', '../../LICENSE', 'README.md'], dest: 'build' }] }),
  ],
};
