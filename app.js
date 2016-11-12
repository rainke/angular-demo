angular.module('app', ['ui.bootstrap', 'demo.Accordion', 'demo.Alert', 'templates']);

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

angular.module('app').controller('formCtrl', function($scope, Type){
    Type.fetchBoth().then(function() {
        $scope.change_pay = 1000;
        $scope.scoring = 20000;
        $scope.scoring_pay = 20;
        

        $scope.realPrice = 0;
        $scope.$watch('change_pay', calc);
        $scope.$watch('scoring', calc);
        $scope.$watch('scoring_pay', calc);
    })
    

    

    function calc() {
        if($scope.scoring_pay <= 0 ) {
            $scope.scoring_pay = 20;
        }
        var pay_to_scoring = $scope.change_pay * $scope.scoring_pay;
        $scope.deduction_scoring = Math.min($scope.scoring, pay_to_scoring);
        $scope.deduction_pay = $scope.deduction_scoring / $scope.scoring_pay;
        $scope.realPrice = $scope.change_pay - $scope.deduction_pay;
    }

}).factory('Type', function($q, $timeout) {
    var list = []
    return {
        get: function() {
            return list;
        },
        fetch1: function() {
            var defer = $q.defer();
            $timeout(function(){
                list = [1,2,3]
                console.log('p1 is resolved')
                defer.resolve(list);
            }, 1000)
            return defer.promise;
        },
        fetch2: function() {
            var defer = $q.defer();
            $timeout(function(){
                list = [3,4,5]
                console.log('p2 is resolved')
                defer.resolve(list);
            }, 2000)
            return defer.promise;
        },
        fetchBoth: function() {
            var defer = $q.defer();
            var p1 = this.fetch1();
            var p2 = this.fetch2();
            $q.all([p1, p2]).then(function(a){
                console.log('p1 and p2 is resolved');
                defer.resolve(a);
            }).catch(function(a){
                console.log(a)
                defer.reject(a);
            }).finally(function(a){
                console.log(a)
            }, function(b) {
                console.log(b)
            });
            return defer.promise
        }
    }
}).filter('fix', function(Type) {
    console.log(Type.get())
    return function(v,p) {
        if(!v) return 0;
        !p && (p = 2);
        return Type.get();
        // return v.toFixed(p)
    }
}).controller('httpCtrl', function($scope, $timeout) {
    $scope.vol = 50;
    var iframe = document.getElementById('iframe');
    var iWin = iframe.contentWindow;
    iWin.onload = function() {
        // $timeout(function() {
            $scope.status = iWin.status;
            $scope.random = iWin.random;
            $scope.random.get(function(v) {
                $scope.status = v;
            })
            $scope.obj = iWin.obj;
            var innerObj = iWin.obj;
            Object.defineProperty(innerObj, 'status', {
                get: function() {
                    return 0;
                },
                set: function(v){
                    alert('haha');
                    return v;
                }
            })
        // })
    }
    $scope.test = function() {
        iWin.document.body.style.background = 'red'
        $scope.status = iWin.status;
        $scope.random = iWin.random;
    }
    
}).directive('rangeSidebar', function() {
    return {
        restrict: 'DAC',
        require:'?ngModel',
        scope: {
            min:'=',
            max:'=',
            value:'='
        },
        template:'<div><p><span></span></p></div>',
        link: function(scope, el, attr, ngModel) {
            console.dir( el.find('span') )
            el.find('div').css({
                position: 'relative',
                padding: '5px 0',
                margin:'0 10px 0 0'
            }).find('p').css({
                'border-top': '2px solid #999',
                'margin': '0 0 0 6px',
                'width': '100%'
            }).find('span').css({
                position: 'absolute',
                'background-color': 'red',
                padding: '6px',
                left: '50%',
                'border-radius': '50%',
                top: '0',
                cursor:'pointer'
            });
            
            var width = getComputedStyle(el.find('div')[0])['width']
            var isMouseDown = false;
            var pad = el.find('span');
            console.log(width, pad[0].offsetLeft)
            var disx, left;
            pad.on('mousedown', function(e) {
                isMouseDown = true;
                disx = e.clientX;
                left = pad[0].offsetLeft;
                console.log(pad[0].style.left)
            })
            angular.element(document).on('mousemove', function(e) {
                var newLeft = e.clientX - disx + left;
                if(isMouseDown && newLeft >= 0 && newLeft < parseFloat(width)) {
                    pad[0].style.left = newLeft + 'px';
                    var percent = Math.round(parseFloat(pad[0].style.left) / parseFloat(width) * 100)
                    pad[0].style.left = percent + '%';
                    if(ngModel) {
                        ngModel.$setViewValue(percent)
                    }
                }
            }).on('mouseup', function() {
                isMouseDown = false;
                 
                 console.log(pad[0].style.left)
            })

        }
    }
})






















