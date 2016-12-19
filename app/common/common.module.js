var appLayout = require('./components/layout/layout.js');
var contact = require('./components/contact/contact.js');
var home = require('./components/home/home.js');
require('ngCropper/dist/ngCropper.all.js');

module.exports = angular.module('app.common', ['ngCropper'])


.component('appLayout', appLayout)
.component('contact', contact)
.component('layHome', home)