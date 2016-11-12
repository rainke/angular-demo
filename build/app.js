(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hepeng/learning/js/angular-demo/app/app.js":[function(require,module,exports){
var angular = require('angular');

require('angular-ui-bootstrap');
require('angular-ui-router');
require('angular-block-ui');
require('../public/templates');
var common = require('./common/common.module.js')
var config = require('./config');

angular.module('app', ['ui.bootstrap', 'ui.router', 'blockUI', common.name])



.config(config)
},{"../public/templates":"/Users/hepeng/learning/js/angular-demo/public/templates.js","./common/common.module.js":"/Users/hepeng/learning/js/angular-demo/app/common/common.module.js","./config":"/Users/hepeng/learning/js/angular-demo/app/config.js","angular":"angular","angular-block-ui":"angular-block-ui","angular-ui-bootstrap":"angular-ui-bootstrap","angular-ui-router":"angular-ui-router"}],"/Users/hepeng/learning/js/angular-demo/app/common/common.module.js":[function(require,module,exports){
var appLayout = require('./components/layout/layout.js');
var contact = require('./components/contact/contact.js');
var home = require('./components/home/home.js');


module.exports = angular.module('app.common', [])


.component('appLayout', appLayout)
.component('contact', contact)
.component('layHome', home)
},{"./components/contact/contact.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/contact/contact.js","./components/home/home.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/home/home.js","./components/layout/layout.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/layout/layout.js"}],"/Users/hepeng/learning/js/angular-demo/app/common/components/contact/contact.js":[function(require,module,exports){
function contactCtrl($scope) {

}


module.exports = {
  templateUrl: 'tpl/contact.html',
  controller: contactCtrl,
  controllerAs:'vm'
}
},{}],"/Users/hepeng/learning/js/angular-demo/app/common/components/home/home.js":[function(require,module,exports){
function homeCtrl($scope,$http) {
  $http.get('v2/book/6548683').success(function(res){
    console.log(res)
  })
}


module.exports = {
  templateUrl: 'tpl/home.html',
  controller: homeCtrl,
  controllerAs:'vm'
}
},{}],"/Users/hepeng/learning/js/angular-demo/app/common/components/layout/layout.js":[function(require,module,exports){
function layoutCtrl($scope, $rootScope) {
//在这里可以替代run
  this.title = 'home';
  $rootScope.title = 'home';
  var This = this;
  $scope.$on('$stateChangeSuccess', function(e, to) {
    This.title = to.title;
    $rootScope.title = to.title;
  })
}


module.exports = {
  templateUrl: 'tpl/layout.html',
  controller: layoutCtrl,
  controllerAs:'vm'
}
},{}],"/Users/hepeng/learning/js/angular-demo/app/config.js":[function(require,module,exports){
function config($stateProvider, $locationProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true)
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('layout', {
    url:'/',
    template:'<lay-home/>',
    title:'主页',
  }).state('contact', {
    url:'/contact',
    template:'<contact/>',
    title:'联系我们'
  })
}

module.exports = config;
},{}],"/Users/hepeng/learning/js/angular-demo/public/templates.js":[function(require,module,exports){
angular.module('app.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('contact.html','<section>\n  <h1>contact us</h1>\n  <p>blabalbal</p>\n</section>');
$templateCache.put('home.html','<section>\n  <button class="btn btn-success" ui-sref="contact">\u8FDB\u5165\u8054\u7CFB</button>\n</section>');
$templateCache.put('layout.html','<section>\n  <header class="text-center">{{vm.title}}</header>\n\n  <ui-view></ui-view>\n</section>');}]);
},{}]},{},["/Users/hepeng/learning/js/angular-demo/app/app.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwiYXBwL2NvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2NvbnRhY3QvY29udGFjdC5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9ob21lL2hvbWUuanMiLCJhcHAvY29tbW9uL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC5qcyIsImFwcC9jb25maWcuanMiLCJwdWJsaWMvdGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5yZXF1aXJlKCdhbmd1bGFyLXVpLWJvb3RzdHJhcCcpO1xucmVxdWlyZSgnYW5ndWxhci11aS1yb3V0ZXInKTtcbnJlcXVpcmUoJ2FuZ3VsYXItYmxvY2stdWknKTtcbnJlcXVpcmUoJy4uL3B1YmxpYy90ZW1wbGF0ZXMnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi9jb21tb24ubW9kdWxlLmpzJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5ib290c3RyYXAnLCAndWkucm91dGVyJywgJ2Jsb2NrVUknLCBjb21tb24ubmFtZV0pXG5cblxuXG4uY29uZmlnKGNvbmZpZykiLCJ2YXIgYXBwTGF5b3V0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2xheW91dC9sYXlvdXQuanMnKTtcbnZhciBjb250YWN0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2NvbnRhY3QvY29udGFjdC5qcycpO1xudmFyIGhvbWUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaG9tZS9ob21lLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbW1vbicsIFtdKVxuXG5cbi5jb21wb25lbnQoJ2FwcExheW91dCcsIGFwcExheW91dClcbi5jb21wb25lbnQoJ2NvbnRhY3QnLCBjb250YWN0KVxuLmNvbXBvbmVudCgnbGF5SG9tZScsIGhvbWUpIiwiZnVuY3Rpb24gY29udGFjdEN0cmwoJHNjb3BlKSB7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVtcGxhdGVVcmw6ICd0cGwvY29udGFjdC5odG1sJyxcbiAgY29udHJvbGxlcjogY29udGFjdEN0cmwsXG4gIGNvbnRyb2xsZXJBczondm0nXG59IiwiZnVuY3Rpb24gaG9tZUN0cmwoJHNjb3BlLCRodHRwKSB7XG4gICRodHRwLmdldCgndjIvYm9vay82NTQ4NjgzJykuc3VjY2VzcyhmdW5jdGlvbihyZXMpe1xuICAgIGNvbnNvbGUubG9nKHJlcylcbiAgfSlcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVtcGxhdGVVcmw6ICd0cGwvaG9tZS5odG1sJyxcbiAgY29udHJvbGxlcjogaG9tZUN0cmwsXG4gIGNvbnRyb2xsZXJBczondm0nXG59IiwiZnVuY3Rpb24gbGF5b3V0Q3RybCgkc2NvcGUsICRyb290U2NvcGUpIHtcbi8v5Zyo6L+Z6YeM5Y+v5Lul5pu/5LujcnVuXG4gIHRoaXMudGl0bGUgPSAnaG9tZSc7XG4gICRyb290U2NvcGUudGl0bGUgPSAnaG9tZSc7XG4gIHZhciBUaGlzID0gdGhpcztcbiAgJHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKGUsIHRvKSB7XG4gICAgVGhpcy50aXRsZSA9IHRvLnRpdGxlO1xuICAgICRyb290U2NvcGUudGl0bGUgPSB0by50aXRsZTtcbiAgfSlcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVtcGxhdGVVcmw6ICd0cGwvbGF5b3V0Lmh0bWwnLFxuICBjb250cm9sbGVyOiBsYXlvdXRDdHJsLFxuICBjb250cm9sbGVyQXM6J3ZtJ1xufSIsImZ1bmN0aW9uIGNvbmZpZygkc3RhdGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xheW91dCcsIHtcbiAgICB1cmw6Jy8nLFxuICAgIHRlbXBsYXRlOic8bGF5LWhvbWUvPicsXG4gICAgdGl0bGU6J+S4u+mhtScsXG4gIH0pLnN0YXRlKCdjb250YWN0Jywge1xuICAgIHVybDonL2NvbnRhY3QnLFxuICAgIHRlbXBsYXRlOic8Y29udGFjdC8+JyxcbiAgICB0aXRsZTon6IGU57O75oiR5LusJ1xuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZzsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwLnRlbXBsYXRlcycsIFtdKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7JHRlbXBsYXRlQ2FjaGUucHV0KCdjb250YWN0Lmh0bWwnLCc8c2VjdGlvbj5cXG4gIDxoMT5jb250YWN0IHVzPC9oMT5cXG4gIDxwPmJsYWJhbGJhbDwvcD5cXG48L3NlY3Rpb24+Jyk7XG4kdGVtcGxhdGVDYWNoZS5wdXQoJ2hvbWUuaHRtbCcsJzxzZWN0aW9uPlxcbiAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIHVpLXNyZWY9XCJjb250YWN0XCI+XFx1OEZEQlxcdTUxNjVcXHU4MDU0XFx1N0NGQjwvYnV0dG9uPlxcbjwvc2VjdGlvbj4nKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dCgnbGF5b3V0Lmh0bWwnLCc8c2VjdGlvbj5cXG4gIDxoZWFkZXIgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPnt7dm0udGl0bGV9fTwvaGVhZGVyPlxcblxcbiAgPHVpLXZpZXc+PC91aS12aWV3Plxcbjwvc2VjdGlvbj4nKTt9XSk7Il19
