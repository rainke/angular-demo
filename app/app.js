var $ = require('jquery');
var angular = require('angular');

require('angular-ui-bootstrap');
require('angular-ui-router');
require('angular-block-ui');
require('../public/templates');
var common = require('./common/common.module.js')
var config = require('./config');

angular.module('app', ['ui.bootstrap', 'ui.router', 'blockUI', common.name])



.config(config)