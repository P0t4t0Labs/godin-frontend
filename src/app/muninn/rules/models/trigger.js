import angular from 'angular';

var triggerByEvent = {
  UTCTime: UTCTimeTrigger
};

function triggerFromObject(config) {
  config = config || {};

  if (config.event in triggerByEvent) {
    return new triggerByEvent[config.event](config);
  }
  return null;
}

/**
 * Base abstract class for all triggers.
 * @abstract
 */
function Trigger() {}
Trigger.conditions = [];


function UTCTimeTrigger(config) {
  this.source = 'global';
  this.event = 'UTCTime';
  this.display = 'Time';
  this.value
}
UTCTimeTrigger.prototype.toJSON = function() {
  return {
    source: this.source,
    event: this.event,
    condition: angular.copy(this.condition),
  };
};

// We get list of possible triggers from the API
// These will be all triggers the backend is aware of
var triggerDefsFromApi = [
  {
    sources: ['global'], //Would be global, group, and/or device
    event: 'UTCTime',
    conditions: ['equals']
  },
  {
    sources: ['device', 'group'], //Would be global, group, and/or device
    event: 'gyroscope',
    conditions: ['delta']
  }
];

export { triggerFromObject };
