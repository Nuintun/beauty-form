'use strict'

const fs = require('fs');
const rollup = require('rollup');
const uglify = require('uglify-es');
const postcss = require('rollup-plugin-postcss');

rollup.rollup({
  legacy: true,
  input: 'src/index.js',
  plugins: [postcss({
    extract: 'dist/beauty-form.css'
  })]
}).then(function(bundle) {
  fs.stat('dist', function(error) {
    if (error) {
      fs.mkdirSync('dist');
    }

    const src = 'dist/beauty-form.js';
    const min = 'dist/beauty-form.min.js';
    const map = 'beauty-form.js.map';

    bundle.generate({
      format: 'umd',
      indent: true,
      strict: true,
      amd: { id: 'beauty-form' },
      name: 'beautyForm'
    }).then(function(result) {
      fs.writeFileSync(src, result.code);
      console.log(`  Build ${ src } success!`);

      result = uglify.minify({
        'tween.js': result.code
      }, {
        ecma: 5,
        ie8: true,
        mangle: { eval: true },
        sourceMap: { url: map }
      });

      fs.writeFileSync(min, result.code);
      console.log(`  Build ${ min } success!`);
      fs.writeFileSync(src + '.map', result.map);
      console.log(`  Build ${ src + '.map' } success!`);
    }).catch(function(error) {
      console.error(error);
    });
  });
}).catch(function(error) {
  console.error(error);
});
