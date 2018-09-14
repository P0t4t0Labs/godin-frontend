import angular from 'angular';
import rootName from './index';

const MOD_NAME = rootName + '.list';

angular.module(MOD_NAME, ['api'])
  .component('muninnRulesList', {
    template: '<h1>Muninn Rules List: TO DO</h1>'
  });

function MuninnRulesList(api) {
  this._i = {
    api,
  };

  this.loading = false;
}

MuninnRulesList.prototype.$onInit = function() {
  this.refresh();
};

MuninnRulesList.prototype.refresh = function() {
  if (this.loading) return;

  this.loading = true;
  this._i.api.get('/rules')
      .then(response => this.rules = response.data)
      .finally(() => this.loading = false);
};



export default MOD_NAME;
