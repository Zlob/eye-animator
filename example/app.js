require.config({
    paths: {
        "eyes": "eyes/dist/amd/eyes.min",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "jqueryUI": "bower_components/jquery-ui/jquery-ui.min"
    },
    waitSeconds: 15
});

require(
    ['eyes', 'jquery', 'jqueryUI'],
    function (Eyes) {
        var eyes = new Eyes();
        function createHeaderEyes(eyes) {
            var headerEyesOptions = {
                size: 50,
                color: "white",
                borderColor: "black",
                borderSize: 5,
                //eyeball options
                eyeball: {
                    size: 12,
                    shift: 15
                },
                //top eyelid options
                topEyelid: {
                    size: 0,
                    color: "#f7b6a4",
                    borderColor: "#000000",
                    borderSize: 5
                },
                //bottom eyelid options
                bottomEyelid: {
                    size: 0,
                    color: "#f7b6a4",
                    borderColor: "#000000",
                    borderSize: 5
                }
            };

            var headerEyes = eyes.createEyesPair('#header-eyes', headerEyesOptions, {x: 75, y: 0}, 50);

            window.addEventListener("mousemove", function (e) {
                var leftEye = headerEyes.getLeftEye();
                var rightEye = headerEyes.getRightEye();

                leftEye.eyeball.trackByCoordinate(e.x, e.y);
                rightEye.eyeball.trackByCoordinate(e.x, e.y);

                //get distance
                var leftEyeCoordinates = leftEye.getCoordinates();
                var rightEyeCoordinates = rightEye.getCoordinates();
                var center = {
                    x: (leftEyeCoordinates.x + rightEyeCoordinates.x) / 2,
                    y: (leftEyeCoordinates.y + rightEyeCoordinates.y) / 2
                };
                var d = Math.pow(Math.pow(center.x - e.x, 2) + Math.pow(center.y - e.y, 2), 0.5);
                //get rotation
                var border = 750;
                var coef = d / border;
                var rotate = -30 + 60 * coef;
                var topEyelid = (1 - coef) * 0.33;
                //set rotation
                var leftOptions = {
                    topEyelid: {
                        size: topEyelid,
                        rotate: -rotate / 2
                    },
                    bottomEyelid: {
                        size: topEyelid,
                        rotate: rotate / 2
                    },
                    eyebrow: {
                        //eyebrow angle, from -30 to 30
                        rotate: -rotate
                    }
                };
                var rightOptions = {
                    topEyelid: {
                        size: topEyelid,
                        rotate: -rotate / 2
                    },
                    bottomEyelid: {
                        size: topEyelid,
                        rotate: rotate / 2
                    },
                    eyebrow: {
                        rotate: -rotate
                    }
                };

                leftEye.change(leftOptions);
                rightEye.change(rightOptions);
            }, false);
        }

        function createDemoEyes(eyes) {
            var demoOptions = {
                size: 55,
                color: "white",
                borderColor: "black",
                borderSize: 6,
                //eyeball options
                eyeball: {
                    size: 12,
                    shift: 20
                },
                //top eyelid options
                topEyelid: {
                    color: "#f7b6a4",
                    borderColor: "#000000",
                    borderSize: 5,
                    eyelashesStyle: 'loise',
                    size: 0.2
                },
                //bottom eyelid options
                bottomEyelid: {
                    color: "#f7b6a4",
                    borderColor: "#000000",
                    borderSize: 5,
                    size: 0.2
                }
            };

            var demoEyes = eyes.createEyesPair('#demo-img', demoOptions, {x: 61, y: 18}, 40);

            var leftDemoEye = demoEyes.getLeftEye();
            var rightDemoEye = demoEyes.getRightEye();


            $("#x").slider({
                min: 0,
                max: 190,
                step: 1,
                value: 21,
                slide: function( event, ui ) {
                    leftDemoEye.change({x: ui.value});
                    rightDemoEye.change({x: ui.value + 40});
                }
            });

            $("#y").slider({
                min: 0,
                max: 190,
                step: 1,
                value: 20,
                slide: function( event, ui ) {
                    leftDemoEye.change({y: ui.value});
                    rightDemoEye.change({y: ui.value});
                }
            });
            $("#size").slider({
                min: 0,
                max: 100,
                step: 1,
                value: 50,
                slide: function( event, ui ) {
                    leftDemoEye.change({size: ui.value});
                    rightDemoEye.change({size: ui.value});
                }
            });

            $("#bottom-eyelid-size").slider({
                min: 0,
                max: 1,
                step: 0.01,
                value: 0.5,
                slide: function( event, ui ) {
                    leftDemoEye.change({bottomEyelid: {size: ui.value}});
                    rightDemoEye.change({bottomEyelid: {size: ui.value}});
                }
            });

            $("#bottom-eyelid-topArcRadius").slider({
                min: 0,
                max: 1,
                step: 0.01,
                value: 0.1,
                slide: function( event, ui ) {
                    leftDemoEye.change({bottomEyelid: {topArcRadius: ui.value}});
                    rightDemoEye.change({bottomEyelid: {topArcRadius: ui.value}});
                }
            });

            $("#bottom-eyelid-topArcRadiusSweep").slider({
                min: 0,
                max: 1,
                step: 1,
                value: 1,
                slide: function( event, ui ) {
                    leftDemoEye.change({bottomEyelid: {topArcRadiusSweep: ui.value}});
                    rightDemoEye.change({bottomEyelid: {topArcRadiusSweep: ui.value}});
                }
            });

            $("#bottom-eyelid-rotate").slider({
                min: -30,
                max: 30,
                step: 0.1,
                value: 0,
                slide: function( event, ui ) {
                    leftDemoEye.change({bottomEyelid: {rotate: ui.value}});
                    rightDemoEye.change({bottomEyelid: {rotate: ui.value}});
                }
            });

            $("#eyeball-size").slider({
                min: 1,
                max: 20,
                step: 1,
                value: 12,
                slide: function( event, ui ) {
                    leftDemoEye.change({eyeball: {size: ui.value}});
                    rightDemoEye.change({eyeball: {size: ui.value}});
                }
            });

            $("#eyeball-shift").slider({
                min: 1,
                max: 30,
                step: 1,
                value: 20,
                slide: function( event, ui ) {
                    leftDemoEye.change({eyeball: {shift: ui.value}});
                    rightDemoEye.change({eyeball: {shift: ui.value}});
                }
            });

            $("#eyeball-angle").slider({
                min: 0,
                max: 6.28,
                step: 0.1,
                value: 0.1,
                slide: function( event, ui ) {
                    leftDemoEye.change({eyeball: {rotate: ui.value}});
                    rightDemoEye.change({eyeball: {rotate: ui.value}});
                }
            });

            $("#topeyelid-size").slider({
                min: 0,
                max: 1,
                step: 0.01,
                value: 0.3,
                slide: function( event, ui ) {
                    leftDemoEye.change({topEyelid: {size: ui.value}});
                    rightDemoEye.change({topEyelid: {size: ui.value}});
                }
            });

            $("#topeyelid-bottomArcRadius").slider({
                min: 0,
                max: 1,
                step: 0.01,
                value: 0.1,
                slide: function( event, ui ) {
                    leftDemoEye.change({topEyelid: {bottomArcRadius: ui.value}});
                    rightDemoEye.change({topEyelid: {bottomArcRadius: ui.value}});
                }
            });

            $("#topeyelid-bottomArcRadiusSweep").slider({
                min: 0,
                max: 1,
                step: 1,
                value: 1,
                slide: function( event, ui ) {
                    leftDemoEye.change({topEyelid: {bottomArcRadiusSweep: ui.value}});
                    rightDemoEye.change({topEyelid: {bottomArcRadiusSweep: ui.value}});
                }
            });

            $("#topeyelid-rotate").slider({
                min: -30,
                max: 30,
                step: 0.1,
                value: 0,
                slide: function( event, ui ) {
                    leftDemoEye.change({topEyelid: {rotate: ui.value}});
                    rightDemoEye.change({topEyelid: {rotate: ui.value}});
                }
            });

            $("#eyebrow-width").slider({
                min: 0,
                max: 100,
                step: 1,
                value: 80,
                slide: function( event, ui ) {
                    leftDemoEye.change({eyebrow: {width: ui.value}});
                    rightDemoEye.change({eyebrow: {width: ui.value}});
                }
            });

            $("#eyebrow-height").slider({
                min: 0,
                max: 25,
                step: 1,
                value: 5,
                slide: function( event, ui ) {
                    leftDemoEye.change({eyebrow: {height: ui.value}});
                    rightDemoEye.change({eyebrow: {height: ui.value}});
                }
            });

            $("#eyebrow-position").slider({
                min: 0,
                max: 1,
                step: 0.1,
                value: 0.5,
                slide: function( event, ui ) {
                    leftDemoEye.change({eyebrow: {position: ui.value}});
                    rightDemoEye.change({eyebrow: {position: ui.value}});
                }
            });

            $("#eyebrow-rotate").slider({
                min: -30,
                max: 30,
                step: 1,
                value: 0,
                slide: function( event, ui ) {
                    leftDemoEye.change({eyebrow: {rotate: ui.value}});
                    rightDemoEye.change({eyebrow: {rotate: ui.value}});
                }
            });

            leftDemoEye.moveToPosition();
            rightDemoEye.moveToPosition();
        }

        function createAnimationDemoEyes() {
            var demoOptions = {
                size: 55,
                color: "white",
                borderColor: "black",
                borderSize: 6,
                //eyeball options
                eyeball: {
                    size: 12,
                    shift: 20
                },
                //top eyelid options
                topEyelid: {
                    color: "#f7b6a4",
                    borderColor: "#000000",
                    borderSize: 5,
                    eyelashesStyle: 'loise'
                },
                //bottom eyelid options
                bottomEyelid: {
                    color: "#f7b6a4",
                    borderColor: "#000000",
                    borderSize: 5
                },
            };

            var demoEyes = eyes.createEyesPair('#animations-demo-img', demoOptions, {x: 61, y: 18}, 40);
            $('[data-type=animation]').on('click', function (e) {
                var animationType = $(e.target).attr("data-value");
                demoEyes.emote(animationType, 500);
            });

            $('[data-type=stop-animation]').on('click', function (e) {
                demoEyes.stopAnimation();
            })
        }

        $(document).ready(function() {
                createHeaderEyes(eyes);

                createDemoEyes(eyes);

                createAnimationDemoEyes(eyes);
            }
        );
    }
);