import angular from 'angular';
import rulesList from './list';
import rulesEdit from './edit';

const MOD_NAME = 'muninn.rules';

angular.module(MOD_NAME, [
  rulesList,
  rulesEdit
]);

export default MOD_NAME;
