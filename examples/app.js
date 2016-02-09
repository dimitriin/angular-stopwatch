/**
 * Created by nasedkin on 08.02.16.
 */
(function(){

    var app = angular.module('stopwatch-example', ['stopwatch']);
    app.controller('StopwatchController', ['$scope', function ($scope) {
        var now = new Date().getTime();
        $scope.stopTimestamp = now + 10*1000; // 1min
        $scope.running = false;
        $scope.stopwatchId = false;

        $scope.start = function() {
            $scope.$broadcast('stopwatch-start',{
                stopwatch: $scope.stopwatchId
            });
        };

        $scope.stop = function() {
            $scope.$broadcast('stopwatch-stop',{
                stopwatch: $scope.stopwatchId
            });
        };

        $scope.add = function(seconds) {
            $scope.stopTimestamp = $scope.stopTimestamp + seconds*1000;
        };

        $scope.$on('stopwatch-started', function(event, data){
            $scope.running = true;
            $scope.stopwatchId = data.stopwatch;
            console.log('started', event, data);
        });

        $scope.$on('stopwatch-stopped', function(event, data){
            $scope.running = false;
            console.log('stopped', event, data);
        });

        $scope.$on('stopwatch-completed', function(event, data){
            console.log('completed', event, data);
        });
    }]);

})();