import angular from 'angular';
import rootName from './index';

const MOD_NAME = rootName + '.list';

angular.module(MOD_NAME, [])
  .component('muninnRulesList', {
    template: '<h1>Muninn Rules List: TO DO</h1>'
  });


export default MOD_NAME;
