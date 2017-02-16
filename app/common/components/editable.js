function eidtCtrl($scope,$http) {
  var This = this;
  this.name = 'hehe';
  this.dob = new Date();
  this.opened = {};
  this.open = function(event, elementOpened) {
    event.preventDefault();
    This.opened[elementOpened] = !This.opened[elementOpened];
  }
  $scope.user = {
    state: 'Arizona'
  };

  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
}


module.exports = {
  templateUrl: 'edit.html',
  controller: eidtCtrl,
  controllerAs:'vm'
}