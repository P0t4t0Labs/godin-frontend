import angular from 'angular';

import './msgBar.scss'

const MODULE_NAME = 'msgBar';

// We use animation classes from http://theoinglis.github.io/ngAnimate.css

function MsgBarService($q, $timeout) {
  var self = this;
  this._i = {
    $q, $timeout
  };

  this.messages = [];

  // Shortcuts
  this.info = this.add.bind(this, 'info');
  this.success = this.add.bind(this, 'success');
  this.warning = this.add.bind(this, 'warning');
  this.danger = this.error = function(message, timeout) {
    if (!angular.isNumber(timeout)) {
      timeout = -1;
    }
    self.add('danger', message, timeout);
  };

  // DEBUG ONLY
  //this.success('Welcome!', 2000);
  //$timeout(() => this.danger('WHAT WHAT'), 1000);
}
MsgBarService.TIMEOUT = 5000;

/**
 * Display an error
 * @param {string} level 'info', 'success', 'warning', or 'danger'.
 * @param {string} message Message to display.
 * @param {int} [timeout=MsgBarService.TIMEOUT] Time in ms to display the alert before
 *  removing it. Specify <= 0 and the message can only be removed manually.
 */
MsgBarService.prototype.add = function(level, message, timeout) {
  if (!message) {
    return;
  }

  var svc = this;
  var $timeout = this._i.$timeout;
  var $q = this._i.$q;

  if (!angular.isNumber(timeout)) {
    timeout = MsgBarService.TIMEOUT;
  }

  // Create deferred that will remove this message
  var d = $q.defer();
  var remove = d.resolve.bind(d);

  var msg = {
    level: level,
    message: message,
    timeout: null,
    remove: remove
  };

  // Create deferred removal
  d.promise.finally(function() {
    if (msg.timeout) {
      $timeout.cancel(msg.timeout);
      msg.timeout = null;
    }

    var i = svc.messages.indexOf(msg);
    if (i != -1) {
      svc.messages.splice(i, 1);
    }
  });

  // Timed removal
  if (timeout > 0) {
    msg.timeout = $timeout(function() {
      remove();
    }, timeout);
  }

  svc.messages.unshift(msg);
};

angular.module(MODULE_NAME, [])
  .service('msgBar', MsgBarService)
  .component('msgBar', {
    controller: function(msgBar) {
      this.msgBar = msgBar;
    },
    template: require('./msgBar.html')
  });

export default MODULE_NAME;
