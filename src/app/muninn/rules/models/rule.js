import angular from 'angular';

import constructScheduleFromApi, * as schedules from './schedules';

import {triggerFromObject} from './trigger';

function Rule(config) {
  config = config || {};

  this.name = config.name || null;
  this.enabled = angular.isDefined(config.enabled) ? !!config.enabled : true;
  this.schedule = constructScheduleFromApi(config.schedule);
  this.triggers = (config.triggers || []).map(triggerFromObject)
    .filter(angular.isObject);
  // TODO: This is prob going to be a trigger object (same with actions)
  //this.tiggers = angular.isArray(config.triggers) ? config.triggers : [];
  this.actions = angular.isArray(config.actions) ? config.actions : [];
}

export default Rule;
