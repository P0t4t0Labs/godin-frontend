import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngMessages from 'angular-messages'

import '../style/app.scss';

import mainNav from './navigation/mainNav'
import clientsMod from './clients/module'
import msgBar from './msgBar/msgBar'
import api from './services/api'

import muninn from './muninn/module'

const MODULE_NAME = 'godin';

function config($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/muninn');

/*
Commenting this out because we're only focused on Muninn
  $stateProvider
    .state({
      name: 'home',
      url: '/',
      template: '<div class="container"><h1>Homepage Pending</h1></div>',
      mainNav: {
        title: 'Dashboard',
        weight: -100,
        icon: 'fas fa-home'
      }
    })
    .state({
      name: 'clientList',
      url: '/clients',
      component: 'clientsPage',
      pageTitle: 'Clients',
      mainNav: {
        title: 'Clients',
        weight: -90,
        icon: 'fas fa-robot'
      }
    });
*/
}

function run($rootScope, $transitions) {
  // Update page title
  $transitions.onSuccess({}, function(transition) {
    var state = transition.$to();
    if (state.self && state.self.pageTitle) {
      $rootScope.pageTitle = state.self.pageTitle;
    } else {
      $rootScope.pageTitle = null;
    }
  });
}

angular.module(MODULE_NAME, [
    api,
    clientsMod,
    mainNav,
    msgBar,
    ngMessages,
    uiRouter,
    muninn,
  ])
  .config(config)
  .run(run);

export default MODULE_NAME;
