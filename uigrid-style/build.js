const extractSassVariables = require('sass-vars-to-js-loader/src/extract.js');
const fs = require('fs');


const file = '../src/style/_variables.scss';

const fileCache = {};

function readFile(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, 'utf8', function(err, contents) {
      if (err) {
        reject(err);
      } else {
        resolve(contents);
      }
    });
  });
}

function varsToDict(vars) {
  return vars.reduce(function(dict, arr) {
    dict[arr[0]] = arr[1];
    return dict;
  });
}


function recurseSass(filename) {
  if (filename in fileCache) {
    return Promise.resolve(Object.assign({}, fileCache[filename]));
  }
  console.log(filename);
  return readFile(filename)
      .then(function(contents) {
        return extractSassVariables(filename, null, contents)
            .catch(function(err) {
              console.error('ERROR in file ' + filename);
              console.error(err);
              return Promise.reject(err);
            });
      })
      .then(function(sass) {
        return Promise.all(sass.dependencies.map(recurseSass))
            .then(function(allDeps) {
              const variables = {};
              allDeps.reverse();
              allDeps.forEach(function(dep) {
                Object.assign(variables, varsToDict(dep));
              });
              return Object.assign(variables, varsToDict(sass.variables))
            });
      })
      .then(function(variables) {
        fileCache[filename] = Object.assign({}, variables);
        return variables;
      });
}


recurseSass(file)
    .then(vars => {console.log('DONE!'); console.log(vars);})
    .catch(err => console.error(err));


