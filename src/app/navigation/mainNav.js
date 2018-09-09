import angular from 'angular';

const MODULE_NAME = 'mainNav';

function MainNavCtrl($stateRegistry, $log) {
  // Build the main nav array
  var mainNav = [];
  angular.forEach($stateRegistry.states, function(state) {
    if (!state.self || !state.self.mainNav) {
      return;
    }

    // Cast strings into objects
    var main = state.self.mainNav;
    if (!angular.isObject(main)) {
      $log.error('Invalid mainNav property for state.', state);
      return;
    }

    // Shove it in
    mainNav.push({
      title: main.title || state.name,
      weight: main.weight || 0,
      name: state.name,
      icon: main.icon || null
    });
  });

  mainNav.sort((a, b) => a.weight - b.weight);
  this.mainNav = mainNav;
}


angular.module(MODULE_NAME, [])
  .component(MODULE_NAME, {
    template: require('./mainNav.html'),
    controller: MainNavCtrl
  });

export default MODULE_NAME;
