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