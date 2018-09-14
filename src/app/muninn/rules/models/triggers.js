import angular from 'angular';

export class BaseTrigger {
  display() {
    return this.constructor.name;
  }

  toJSON() {
    return {};
  }
}

export class UTCTime extends BaseTrigger {
  constructor(fromApi) {
    super();

    fromApi = fromApi || {};
    this.source = 'global';
    this.event = 'UTCTime';
    this.value = null;

    //TODO: Parse condition from API properly
    this.condition = fromApi.condition || null;
  }

  display() {
    return 'TODO: echo the time';
  }

  toJSON() {
    return {
      source: this.source,
      event: this.event,
      condition: angular.copy(this.condition),
    };
  }
}

const triggersByEvent = {
  UTCTime: UTCTime,
};

export default function constructFromAPI(fromApi) {
  fromApi = fromApi || {};
  if (angular.isString(fromApi.event) && fromApi.event in triggerByEvent) {
    return new triggersByEvent[fromApi.event](fromApi);
  }
  return null;
}

// We get list of possible triggers from the API
// These will be all triggers the backend is aware of
var triggerDefsFromApi = [
  {
    sources: ['global'], //Would be global, group, and/or device
    event: 'UTCTime',
    conditions: ['equals'],
  },
  {
    sources: ['device', 'group'], //Would be global, group, and/or device
    event: 'gyroscope',
    conditions: ['delta'],
  },
];
