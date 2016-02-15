/**
 * Created by nasedkin on 07.02.16.
 */
(function(){
    'use strict';
    angular.module('stopwatch', [])
        .directive('stopwatch', ['$interval', 'dateFilter', function($interval, dateFilter) {
            function link(scope, element, attrs) {
                var stopwatch = attrs.stopwatch;

                var format    = 'mm:ss';
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

                function updateElement(d) {
                    element.text(dateFilter(d, format));
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
                        var r = rest();
                        if( r > 0 ) {
                            update(r);

                            timeoutId = $interval(function () {
                                update();
                            }, 1000);

                            scope.$emit('stopwatch-started', {
                                stopwatch: id
                            });

                            return true;
                        } else {
                            updateElement(new Date(0));
                        }
                    }
                    return false;
                }

                function update(r) {
                    r = r || rest();
                    if( r >= 0 ) {
                        updateElement(r);
                    } else {
                        stop();
                    }
                }

                scope.$watch(attrs.stopwatch, function(value) {
                    stopwatch = value;
                    if( start() ) {
                        update();
                    }
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