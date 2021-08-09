import copy from 'rollup-plugin-copy';
import size from 'rollup-plugin-bundle-size';
import multi from '@rollup/plugin-multi-entry';
import externals from 'rollup-plugin-auto-external';

export default {
  input: ['modules/*.js', '!modules/motionState.js'],
  output: { file: 'build/react-oscillation.js', format: 'esm' },
  plugins: [
    externals(),
    multi(),
    size(),
    copy({ targets: [{ src: ['package.json', '../../LICENSE', 'README.md'], dest: 'build' }] }),
  ],
};
