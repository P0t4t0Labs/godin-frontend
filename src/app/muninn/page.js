import angular from 'angular';

const MODULE_NAME = 'muninnPage';

angular.module(MODULE_NAME, [])
  .component(MODULE_NAME, {
    template: require('./page.html')
  });

export default MODULE_NAME;
