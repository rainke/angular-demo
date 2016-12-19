var style = require('./home.css');

function homeCtrl($scope,$http) {
  var This = this;
  this.style = style;
  $http.get('v2/book/6548683').success(function(res){
    console.log(res)
  })

  this.searchBook = function() {
    $http.get('v2/book/search', {params: {q: this.keyword}}).success(function(res){
      This.list = res.books;
      This.total = res.total;
    });
  }
}


module.exports = {
  templateUrl: 'tpl/home.html',
  controller: homeCtrl,
  controllerAs:'vm'
}