'use strict'

const fs = require('fs-extra');
const rollup = require('rollup');
const uglify = require('uglify-es');
const css = require('rollup-plugin-css');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const cssfile = 'dist/css/beauty-form.css';

rollup.rollup({
  legacy: true,
  input: 'src/index.js',
  external: ['jquery'],
  plugins: [css({
    include: '**/*.css',
    extract: cssfile,
    plugins: [autoprefixer({
      add: true,
      remove: true,
      browsers: ['> 1% in CN', '> 5%', 'ie >= 8']
    })]
  })]
}).then(function(bundle) {

  const jsfile = 'dist/beauty-form.js';

  bundle.write({
    file: jsfile,
    format: 'umd',
    indent: true,
    strict: true,
    amd: { id: 'beauty-form' },
    name: 'beautyForm',
    globals: { jquery: 'jQuery' }
  }).then(function() {
    // js
    console.log(`  Build ${ jsfile } success!`);

    const jsmin = 'dist/beauty-form.min.js';
    const jsmap = 'beauty-form.js.map';

    const result = uglify.minify({
      'beauty-form.js': fs.readFileSync(jsfile).toString()
    }, {
      ecma: 5,
      ie8: true,
      mangle: { eval: true },
      sourceMap: { url: jsmap }
    });

    fs.outputFileSync(jsmin, result.code);
    console.log(`  Build ${ jsmin } success!`);
    fs.outputFileSync(jsfile + '.map', result.map);
    console.log(`  Build ${ jsfile + '.map' } success!`);

    // css
    console.log(`  Build ${ cssfile } success!`);

    const cssmin = 'dist/css/beauty-form.min.css';

    cssnano
      .process(fs.readFileSync(cssfile), { safe: true })
      .then(function(result) {
        fs.outputFileSync(cssmin, result.css);
        console.log(`  Build ${ cssmin } success!`);
      })
      .catch(function(error) {
        console.error(error);
      });

    // images
    const imgfile = 'dist/images';

    fs.copy('src/images', imgfile, function() {
      console.log(`  Build ${ imgfile } success!`);
    });
  }).catch(function(error) {
    console.error(error);
  });
}).catch(function(error) {
  console.error(error);
});
