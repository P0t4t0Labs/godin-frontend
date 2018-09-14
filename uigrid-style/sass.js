const sass = require('node-sass');

// Parse extract and turn it into ghetto less
const rendered = sass.renderSync({
  file:'./extract.scss',
  outputStyle: 'compact',
});
const css = rendered.css.toString();

const re = /\.(\w+)\s?\{.*:\s*(.+);\s*\}/gm;

let m = null;
do {
  m = re.exec(css);
  if (m) {
    console.log('@' + m[1] + ': ' + m[2] + ';');
  }
} while (m);


