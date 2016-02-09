/**
 * Created by nasedkin on 07.02.16.
 */
(function(){
    'use strict';
    angular.module('stopwatch', [])
        .directive('stopwatch', ['$interval', 'dateFilter', function($interval, dateFilter) {
            function link(scope, element, attrs) {
                var format    = 'mm:ss';
                var stopwatch = false;
                var timeoutId = false;
                var id        = getUniqueId();

                function isRunning() {
                    return !(timeoutId === false);
                }

                function getUniqueId() {
                    return '' + (new Date()).getTime() + Math.random().toString(16).slice(2);
                }

                function rest() {
                    if( stopwatch ) {
                        return stopwatch - (new Date()).getTime();
                    } else {
                        return 0;
                    }
                }

                function stop() {
                    if( isRunning() ) {
                        $interval.cancel(timeoutId);

                        if( rest() <= 0 ) {
                            scope.$emit('stopwatch-completed', {
                                stopwatch: id
                            });
                        }

                        scope.$emit('stopwatch-stopped', {
                            stopwatch: id
                        });
                        timeoutId = false;
                    }
                }

                function start() {
                    if( !isRunning() ) {
                        if( rest() >= 0 ) {
                            timeoutId = $interval(function () {
                                update();
                            }, 1000);
                            scope.$emit('stopwatch-started', {
                                stopwatch: id
                            });
                        }
                    }
                }

                function update() {
                    var r = rest();
                    if( r >= 0 ) {
                        element.text(dateFilter(new Date(r), format));
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