angular.module('app', ['ui.bootstrap', 'demo.Accordion', 'demo.Alert']);

angular.module('demo.Accordion', []).controller('AccordionDemoCtrl', function($scope) {
    $scope.url = 'tpl/Accordion.html'
    $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: false,
        isFirstDisabled: false
    };
    $scope.oneAtATime = true;
    $scope.groups = [{
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
    }, {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
    }];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];
    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    }
});

angular.module('demo.Alert', []).controller('AlertDemoCtrl', function($scope) {
    $scope.url = "tpl/Alert.html";
    $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({ msg: 'Another alert!' });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
});
