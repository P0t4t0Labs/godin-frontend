import angular from 'angular';
import rootName from './index';

import Rule from './models/rule';

const MOD_NAME = rootName + '.list';

angular.module(MOD_NAME, ['api'])
  .component('muninnRulesList', {
    template: require('./list.html'),
    controller: MuninnRulesList,
  });

function MuninnRulesList(api, $timeout, $q) {
  this._i = {
    api,
    $timeout,
    $q,
  };

  this.loading = false;

  this.grid = {
    data: [], // This will get updated
    enableSorting: true,
    minRowsToShow: 50,
    columnDefs: [
      {name: 'name', displayName: 'Name'},
      {name: 'enabled', displayName: 'Enabled', type: 'boolean', width: '*'},
      {name: 'schedule', field: 'schedule.display()'},
    ],
  };
}

MuninnRulesList.prototype.$onInit = function() {
  this.refresh();
};

MuninnRulesList.prototype.refresh = function() {
  const {api, $q, $timeout} = this._i;

  if (this.loading) return;

  this.loading = true;

  $q
    .all([
      api.get('/rules'),
      $timeout(angular.noop, 250),  // For when the API is too fast lol
    ])
    .then(function(both) {
      return both[0];
    })
    .then((response) => {
      this.grid.data = (response.data || []).map((rule) => new Rule(rule));
    })
    .finally(() => this.loading = false);
};

export default MOD_NAME;
