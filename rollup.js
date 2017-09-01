'use strict'

const fs = require('fs-extra');
const rollup = require('rollup');
const uglify = require('uglify-es');
const css = require('rollup-plugin-css');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

rollup.rollup({
  legacy: true,
  input: 'src/index.js',
  external: ['jquery'],
  plugins: [css({
    include: '**/*.css',
    extract: 'dist/css/beautify-form.css',
    plugins: [autoprefixer({
      add: true,
      remove: true,
      browsers: ['> 1% in CN', '> 5%', 'ie >= 8']
    })],
    onwrite: function(cssfile) {
      cssfile = cssfile.replace(/\\/g, '/');

      // css
      console.log(`  Build ${ cssfile } success!`);

      const cssmin = 'dist/css/beautify-form.min.css';

      cssnano
        .process(fs.readFileSync(cssfile), { safe: true })
        .then(function(result) {
          fs.outputFileSync(cssmin, result.css);
          console.log(`  Build ${ cssmin } success!`);
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  })]
}).then(function(bundle) {

  const jsfile = 'dist/beautify-form.js';

  bundle.generate({
    format: 'umd',
    indent: true,
    strict: true,
    amd: { id: 'beautify-form' },
    name: 'BeautifyForm',
    globals: { jquery: 'jQuery' }
  }).then(function(result) {
    // js
    fs.outputFileSync(jsfile, result.code);
    console.log(`  Build ${ jsfile } success!`);

    const jsmin = 'dist/beautify-form.min.js';
    const jsmap = 'beautify-form.js.map';

    result = uglify.minify({
      'beautify-form.js': result.code
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
