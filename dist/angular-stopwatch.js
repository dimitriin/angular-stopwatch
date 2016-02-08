/**
 * Created by nasedkin on 07.02.16.
 */
(function(){
    'use strict';
    angular.module('stopwatch', [])
        .directive('stopwatch', ['$interval', 'dateFilter', function($interval, dateFilter) {
            function link(scope, element, attrs) {
                var stopwatch = false;
                var timeoutId = false;
                var id        = getUniqueId();

                function isRunning() {
                    return !(timeoutId === false);
                }

                function getUniqueId() {
                    return '' + (new Date()).getTime() + Math.random().toString(16).slice(2);
                }

                function stop() {
                    if( isRunning() ) {
                        $interval.cancel(timeoutId);
                        scope.$emit('stopwatch-stopped', {
                            stopwatch: id
                        });
                        timeoutId = false;
                    }
                }

                function start() {
                    if( !isRunning() ) {
                        timeoutId = $interval(function () {
                            update();
                        }, 1000);
                        scope.$emit('stopwatch-started', {
                            stopwatch: id
                        });
                    }
                }

                function update() {
                    var stopDate = new Date(parseInt(stopwatch));
                    var nowDate  = new Date();
                    if( nowDate <= stopDate ) {
                        element.text(dateFilter(stopDate - nowDate, 'mm:ss'));
                    } else {
                        stop();
                    }
                }

                scope.$watch(attrs.stopwatch, function(value) {
                    stopwatch = value;
                    start();
                    update();
                });

                element.on('$destroy', function() {
                    stop();
                });

                scope.$on('stopwatch-start', function(event, data) {
                    if( data.stopwatch && data.stopwatch == id ) {
                        start();
                    }
                });

                scope.$on('stopwatch-stop', function(event, data) {
                    if( data.stopwatch && data.stopwatch == id ) {
                        stop();
                    }
                });

                start();
            }

            return {
                link: link
            };
        }]);

})();