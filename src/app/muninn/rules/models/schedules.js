import angular from 'angular';

export class BaseSchedule {
  display() {
    return this.constructor.name;
  }

  toJSON() {
    return {};
  }
}

export class AlwaysActive extends BaseSchedule {
  constructor() {
    super();
  }

  display() {
    return 'Any time';
  }

  toJSON() {
    return {
      format: 'always-active',
    };
  }
}

/**
 * Add new schedules here.
 * Key should be the format the class handles.
 */
const formatLookup = {
  'always-active': AlwaysActive,
};

export default function constructFromApi(fromApi) {
  fromApi = fromApi || {};
  if (angular.isString(fromApi.format) && fromApi.format in formatLookup) {
    return new formatLookup[fromApi.format](fromApi);
  }
  return null;
}
