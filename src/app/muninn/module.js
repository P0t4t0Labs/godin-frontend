import angular from 'angular';

import muninnPage from './page';
import muninnRules from './rules/index';

const MODULE_NAME = 'muninn';

//https://fontawesome.com/icons/crow?style=solid

angular.module(MODULE_NAME, [
    muninnPage,
    muninnRules
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state({
        name: 'muninn',
        url: '/muninn',
        redirectTo: 'muninn.rules',
        component: 'muninnPage',
        pageTitle: 'Muninn',
        mainNav: {
          title: 'Muninn',
          position: 0,
          icon: 'fas fa-crow'
        }
      })

      .state({
        name: 'muninn.rules',
        url: '/rules',
        pageTitle: 'Muninn Rules',
        component: 'muninnRulesList'
      })
      .state({
        name: 'muninn.rules.edit',
        url: '/:id',
        pageTitle: 'Muninn Rules: Edit',
        views: {
          '@muninn': {
            component: 'muninnRulesEdit',
          },
        }
      })

      .state({
        name: 'muninn.tmp1',
        url: '/tmp1',
        pageTitle: 'Muninn Temp1',
        template: 'TMP1'
      })
      .state({
        name: 'muninn.tmp2',
        url: '/tmp2',
        pageTitle: 'Muninn Temp2',
        template: 'TMP2'
      });
  });

export default MODULE_NAME;
