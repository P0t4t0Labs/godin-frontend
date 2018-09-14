import angular from 'angular';

import msgBar from '../msgBar/msgBar';

const MODULE_NAME = 'api';


/**
 * A cheap service to automatically handle any errors from the API.
 * @param $http
 * @param $q
 * @param msgBar
 * @param $log
 * @constructor
 */
function API($http, $q, msgBar, $log) {
  const svc = this;

  /**
   * - For all request types the first argument is always URL.
   * - For any request type that's in `hasData` the second argument is a data
   *   object otherwise it's the config object. Config objects are all
   *   optional.
   *
   * If the request has a config object, there's some custom flags:
   *  - [ignoreErrors=false] If set to true, we won't use the global
   *      error handler.
   *  - [noUrlPrefix=false] If set to true '/api' will not be prefixed to the
   *      url.
   *
   * @type {string[]}
   */
  const apiPrefix = '/api';

  const hasData = ['post', 'put', 'patch'];
  // Wrap all standard $http calls in error handlers
  ['get', 'head', 'post', 'put', 'delete', 'patch']
    .forEach(function(fnName) {
      svc[fnName] = function() {
        const config = arguments[(fnName in hasData) ? 2 : 1] || {};

        // Fixup URL if not disabled
        if (!config.noUrlPrefix) {
          let url = arguments[0];

          // url from config is used if arg[0] isn't provided
          let urlFromConfig = false;
          if (!angular.isString(url)) {
            urlFromConfig = true;
            url = config.url;
          }

          // If it's not a string get out
          if (angular.isString(url)) {
            // Check for starting slash
            if (url.length > 0 && url[0] !== '/') {
              url = '/' + url;
            }
            url = apiPrefix + url;

            // Reassign
            if (urlFromConfig) {
              config.url = url;
            } else {
              arguments[0] = url;
            }
          }
        }
        return $http[fnName].apply($http, arguments)
          .then(function(response) {
            // Catch if our response uses the `.error` property when we're screwed.
            if (angular.isObject(response.data) && response.data.error) {
              // Will be pushed to our catch
              return $q.reject(response);
            }
            return response;
          })
          .catch(function(response) {
            if (!config.ignoreErrors) {
              let msg = 'An unknown error occurred';

              // Resolve error message
              if (angular.isObject(response.data) && response.data.error) {
                msg = response.data.error;
              } else {
                msg = 'HTTP Error: (' + response.status + ') ' + response.statusText;
              }

              msgBar.error(msg, -1);
              $log.error(msg, response.config.method,response.config.url);
            }

            return $q.reject(response);
          });
      }
    });
}

angular.module(MODULE_NAME, [msgBar])
  .service(MODULE_NAME, API);

export default MODULE_NAME;
