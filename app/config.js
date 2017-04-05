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
  }).state('edit', {
    url:'/edit',
    template:'<edit/>',
    title:'联系我们'
  }).state('cropper', {
    url:'/cropper',
    template:'<cropper/>',
    title:'画画'
  }).state('dd', {
    url:'/dd',
    template:'<dd/>',
    title:'拖拽'
  })
}

module.exports = config;