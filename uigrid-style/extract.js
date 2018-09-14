const sassExtract = require('sass-extract');

const rendered = sassExtract.renderSync({
  //file: `${__dirname}/../src/style/_variables.scss`
  file: '../src/style/_variables.scss'
});

console.log(rendered.vars);
console.log(rendered.css.toString());
