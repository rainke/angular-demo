var $ = require('jquery');
var angular = require('angular');
window.Cropper = require('cropper');
require('angular-ui-bootstrap');
require('angular-ui-router');
require('angular-block-ui');
require('angular-xeditable');
require('ui-select');
require('angular-dragdrop');
require('../public/templates');
var common = require('./common/common.module.js')
var config = require('./config');

angular.module('app', [
  'app.templates',
  'ui.bootstrap',
  'ui.router',
  'ui.select',
  'blockUI',
  'xeditable',
  'ngDragDrop',
  common.name
])



.config(config)
.run(function(editableOptions){
  editableOptions.theme = 'bs3';
  editableOptions.blurElem = 'ignore';
})