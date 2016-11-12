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