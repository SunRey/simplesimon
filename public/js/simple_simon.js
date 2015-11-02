"use strict";
// (function() {
    var mySound = new buzz.sound("/sounds/Sad_Trombone.wav"),
        patternsAndLevel = {
            simonArrayPattern: [],
            userArrayPattern: [],
            currentLevel: 0,
            highestLevel: 0,
            levelHtml: $('#level'),
            pushSimonColorToArray: function () {
                this.simonArrayPattern.push(generateSimonColor());
            },
            pushUserColorArray: function (userChoice) {
                this.userArrayPattern.push(userChoice);
                validatePattern();
                console.log(this.userArrayPattern);
            },
            nextLevel: function () {
                this.currentLevel++;
                this.levelHtml.text(this.currentLevel);
                this.displayHighestLevel();
                console.log(this.currentLevel);
            },
            resetLevel: function () {
                this.currentLevel = 0;
                this.levelHtml.text(this.currentLevel);                    
            },
            displayHighestLevel: function () {
                if(this.highestLevel < this.currentLevel) {
                    this.highestLevel = (this.currentLevel - 1);
                    $('#high_score').text(this.highestLevel);
                }
            }
        },
        shapesClass = {
            shapes: $('.shapes'),
            pointerEventsAuto: function () {
                shapesClass.shapes.css('pointer-events', 'auto');
            },
            pointerEventsNone: function () {
                shapesClass.shapes.css('pointer-events', 'none');
            }
        };

    function runGame () {
        patternsAndLevel.nextLevel();
        patternsAndLevel.pushSimonColorToArray();
        controlSimonPattern();
    }
    function generateSimonColor () {
        return ( Math.floor(Math.random() * (4 - 1 + 1)) + 1);
    }
    function controlSimonPattern () {
        var duration = 1500;
        patternsAndLevel.simonArrayPattern.forEach(function (value) {
            setTimeout(function(){
                showSimonPattern(value);
            }, duration);
            duration += 900;
            console.log(duration);
        });
        setTimeout(shapesClass.pointerEventsAuto, duration);
    } 
    function showSimonPattern (pattern) {
        $('#color'+ pattern).addClass('active');
        setTimeout(function () {
            $('#color' + pattern).removeClass('active');
        }, 500); 
    }
    function validatePattern () {
        var simon = patternsAndLevel.simonArrayPattern,
            user = patternsAndLevel.userArrayPattern;
        if (user[user.length-1] !== simon[user.length-1]) {
            missedPatternFlash(simon[user.length-1]);
            gameFail();
        } else {
            vaildatedSuccess();
        }
    }
    function vaildatedSuccess () {
        if (patternsAndLevel.simonArrayPattern.length === patternsAndLevel.userArrayPattern.length){
            shapesClass.pointerEventsNone();
            patternsAndLevel.userArrayPattern = [];
            runGame();
        }
    }
    function missedPatternFlash (buttonId) {
        var i, duration = 500;
        for(i=0; i<4; i++) {
            setTimeout(function() {
                showSimonPattern(buttonId);
            }, duration); 
            duration += 900;     
        };
    }
    function replayButton () {
        var replayButton = $('#run_button');
        replayButton.attr("disabled", false);
        replayButton.text('Replay Game?');
    }
    function gameFail () {
        mySound.play();
        shapesClass.pointerEventsNone();
        patternsAndLevel.userArrayPattern = [];
        patternsAndLevel.simonArrayPattern = [];
        patternsAndLevel.resetLevel();
        replayButton();
    }

    shapesClass.shapes.on('click', function() {
        var userChoice = parseInt($(this).attr('value'));
        patternsAndLevel.pushUserColorArray(userChoice);
        console.log(this.id);
    });

    $('#run_button').on('click', function() {
        $(this).attr("disabled", true);
        runGame();
    });   
// })();