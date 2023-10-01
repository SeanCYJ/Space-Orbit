// var path = $('#followPath').get(0);
// var pathLength = path.getTotalLength();
// var planetA = $('#circle');


// planetA.on('change', function() {
//     var x_val = planetA.attr('cx');
//     var y_val = planetA.attr('cy');
//     $('body').append(x_val);
// });


var startTime; // to keep track of the start time
var stopwatchInterval; // to keep track of the interval
var elapsedPausedTime = 0; // to keep track of the elapsed time while stopped

function startStopwatch() {
  if (!stopwatchInterval) {
    startTime = new Date().getTime() - elapsedPausedTime; // get the starting time by subtracting the elapsed paused time from the current time
    stopwatchInterval = setInterval(updateStopwatch, 1000); // update every second
  }
}

function stopStopwatch() {
  clearInterval(stopwatchInterval); // stop the interval
  elapsedPausedTime = new Date().getTime() - startTime; // calculate elapsed paused time
  stopwatchInterval = null; // reset the interval variable
}

function resetStopwatch() {
  stopStopwatch(); // stop the interval
  elapsedPausedTime = 0; // reset the elapsed paused time variable
  document.getElementById("time-info").innerHTML = "T 00:00:00"; // reset the display
}

function updateStopwatch() {
    var currentTime = new Date().getTime(); // get current time in milliseconds
    var elapsedTime = currentTime - startTime; // calculate elapsed time in milliseconds
    var seconds = Math.floor(elapsedTime / 1000) % 60; // calculate seconds
    var minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calculate minutes
    var hours = Math.floor(elapsedTime / 1000 / 60 / 60); // calculate hours
    var displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); // format display time
    document.getElementById("time-info").innerHTML = "T+" + displayTime; // update the display
    document.getElementById('total-time').innerHTML = displayTime;
}
  
function pad(number) {
    // add a leading zero if the number is less than 10
    return (number < 10 ? "0" : "") + number;
}

function convertDisplayTime(time) {
    var seconds = Math.floor(time / 1000) % 60; // calculate seconds
    var minutes = Math.floor(time / 1000 / 60) % 60; // calculate minutes
    var hours = Math.floor(time / 1000 / 60 / 60); // calculate hours
    var displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
    return displayTime;
}

// set local storage permission
var localStorPerm = false;

function localStor() {
    if(localStorPerm) {
        localStorPerm = false;
        localStorage.clear();
        $('#local-storage').text('delete');
        $('#msg').text("High score not stored");
        $('#msg').css('display', 'flex');
        setTimeout(function(){
            $('#msg').css('display', 'none');
        }, 3000);
    } else {
        localStorPerm = true;
        $('#local-storage').text('save');
        $('#msg').text("Using local-storage for high score");
        $('#msg').css('display', 'flex');
        setTimeout(function(){
            $('#msg').css('display', 'none');
        }, 3000);
    }
}

// reset game machine
function resetGame() {
    if(localStorPerm) {
        localStorage.clear();
    }  
    noLoop();
    stopStopwatch();
    resetStopwatch();
    $('#msg').text("Rebooting...wiping all high scores");
    $('#msg').css('display', 'flex');
    $('#msg').css('background-color', 'black');
    setTimeout(function(){
        $('#msg').css('display', 'none');
        $('#msg').css('background-color', '');
        start();
    }, 4500);
    
}

// set highscore
function highScore(timeSec) {
    let time = convertDisplayTime(timeSec);
    if(localStorPerm) {
        if (localStorage.getItem('highScore')) {
            let previousHS = localStorage.getItem('highScore');
            if (time > previousHS) {
             localStorage.setItem('highScore', time);   
             $('#high-score').text(time);
            } else {
                $('#high-score').text(previousHS);
            }
        } else {
            localStorage.setItem('highScore', time);
            $('#high-score').text(time);
        }
    }
}

// generate random stars' location
function starLoc() {
    for (let i = 0; i < 10; i++) {
        $('#star' + i).css('top', String(Math.random()*351) + 'px');
        $('#star' + i).css('left', String(Math.random()*451) + 'px');
    }
}

// move stars to create perspective
function starMovement() {
    for (let i = 0; i < 10; i++) {
        $('#star' + i).css('top', String($('#star' + i).offset().top + (car.a.y * 0.1)) + 'px');
        $('#star' + i).css('left', String($('#star' + i).offset().left + (car.a.x * 0.1)) + 'px');
    }
}

let car;
let trail = []; // Leave a trail behind the car
const TRAIL_LENGTH = 50;
var crashed = false;

function start() {
    $('#game-over').css('display', 'none');
    $('#game-over-bg').css('display', 'none');
    console.log("pressed");
    trail = [];
    starLoc();
    resetStopwatch();
    startStopwatch();
    setup();
    loop();
}

document.getElementById("start-stop").addEventListener("click", start);
document.getElementById("local-storage").addEventListener("click", localStor);
document.getElementById("reset-game").addEventListener("click", resetGame);

var oriOffset = $('#planet0').offset();

function orbitA() {
    $('#planet0').animate(
        {
            offsetDistance: "99.9%",
        }, 
        { 
            duration: 60000,
            easing: "linear",
            step: function() {
                var offset = $("#planet0").offset();
                $("#P-A").text("Location of the box is: (left: " + Math.round(offset.left) 
                + ", top: " + Math.round(offset.top) + ")");
            },
            complete: function(){
                // $("#planetA").offset({top: oriOffset.top, left: oriOffset.left});
                $("#planet0").css("offset-distance", 0);
                orbitA();
            }
        }
    );
}

function orbitB() {
    $('#planet1').animate(
        {
            offsetDistance: "99.9%",
        }, 
        { 
            duration: 60000,
            easing: "linear",
            step: function() {
                var offset = $("#planet1").offset();
                $("#P-B").text("Location of the box is: (left: " + Math.round(offset.left) 
                + ", top: " + Math.round(offset.top) + ")");
            },
            complete: function(){
                // $("#planetA").offset({top: oriOffset.top, left: oriOffset.left});
                $("#planet1").css("offset-distance", 0);
                orbitB();
            }
        }
    );
}

function orbitC() {
    $('#planet2').animate(
        {
            offsetDistance: "99.9%",
        }, 
        { 
            duration: 60000,
            easing: "linear",
            step: function() {
                var offset = $("#planet2").offset();
                $("#P-B").text("Location of the box is: (left: " + Math.round(offset.left) 
                + ", top: " + Math.round(offset.top) + ")");
            },
            complete: function(){
                // $("#planetA").offset({top: oriOffset.top, left: oriOffset.left});
                $("#planet2").css("offset-distance", 0);
                orbitC();
            }
        }
    );
}

if (crashed) {
    $('#planet0').stop();
}


resetStopwatch();
starLoc();
startStopwatch();
orbitA();
// orbitB();
// orbitC();


function setup() {
    let canvas = createCanvas(450,350);
    canvas.parent('sketch-holder');
    // noCanvas();
    frameRate(24);

    car = new Car(width/2, 20, 0);
}

function draw() {
    var planetDis=[];
    let c = color(0, 50, 96);
    background(c);

    // let planetX = [$('#planet0').offset().left + ($('#planet0').width()/2), $('#planet1').offset().left + ($('#planet1').width()/2), $('#planet2').offset().left + ($('#planet2').width()/2)];
    // let planetY = [$('#planet0').offset().top + ($('#planet0').width()/2), $('#planet1').offset().top + ($('#planet1').width()/2), $('#planet2').offset().top + ($('#planet2').width()/2)]

    let planetX = [$('#planet0').offset().left + ($('#planet0').width()/2)];
    let planetY = [$('#planet0').offset().top + ($('#planet0').width()/2)];

    car.update(planetX, planetY, car.d.x, car.d.y);
    starMovement();

    //update star pos
    
    //update fuel lvl
    let fuelBar = "*";
    $('#fuel-bar').html(fuelBar.repeat(car.fuel > 0 ? Math.round(car.fuel/10) : 0));
    $('#fuel-bar').css('color', car.fuel > 50 ? 'green' : car.fuel > 20 ? 'yellow' : 'red');
    console.log(car.fuel);

//   car.updateGravity();

  // Change car colour when drifting
  let nowDrifting = car.isDrift()
  if(nowDrifting) {
    car.col = color(255,100,100);
  } else {
    car.col = color(255, 255, 255);
  }

  car.show();

  // Save the current location, AND drift state as an object
  // to trail. That way we can do cool things when we render
  // the trail.
  trail.push({
    position: car.getPos(),  // A vector(x,y)
    drifting: nowDrifting, // true / false
  });

  // Delete the oldest car position if the trail is long enough.
  if (trail.length > TRAIL_LENGTH) {
    trail.splice(0, 1);
    // trail.splice(-1, 30);
  }

  // Render the car's trail. Change color of trail depending on whether
  // drifting or not.
  stroke(255); strokeWeight(3); noFill();
  for (let p of trail){
    // Colour the trail to show when drifting
    // if(p.drifting) {
    //   stroke(255,100,100);
    // } else {
    //   stroke(255);
    // }
    point(p.position.x, p.position.y);
  }


  // Keep car onscreen. Car displacement (position) is stored in vector: car.d
  if(car.d.x > width){
    car.d.x = width;
  } else if(car.d.x < 0) {
    car.d.x = 0;
  }
  if(car.d.y > height) {
    car.d.y = height;
  } else if(car.d.y < 0) {
    car.d.y = 0;
  }

    // Keep max spped at 2


    // Update spacecraft position using the ~middle of the trail to have both a predicted path and a travelled path
    $("#spacecraft").css({top: (trail.length > 30 ? trail[30].position.y - 15 + "px" : 0), left: (trail.length > 30 ? trail[30].position.x - 15 + "px" : 0), position:'relative', display: trail.length > 30 ? "block" : "none"});
    $("#spacecraft-icon").css({ 'transform': 'rotate(' + ((car.angle)/Math.PI)*180 + 'deg)'});
    if(trail.length > 30){
        for (let i=0; i < 1; i++){
            let spacecraftPos = $('#spacecraft')[0].getBoundingClientRect();
            planetDis[i] = Math.sqrt(Math.pow(Math.abs(spacecraftPos.top - planetY[i]),2) + 
            Math.pow(Math.abs(spacecraftPos.left - planetX[i]),2));

            // console.log(planetDis[i]);
            if(planetDis[i] < 45) {
                $('#game-over').css('display', 'grid');
                $('#game-over-bg').css('display', 'flex');
                crashed = true;
                noLoop();
                stopStopwatch();
                highScore(elapsedPausedTime);

                // console.log(planetDis[i]);
            }

            $("#line" + i).attr("x1", trail[30].position.x);
            $("#line" + i).attr("y1", trail[30].position.y);
            $("#line" + i).attr("x2", $('#planet' + i).offset().left + ($('#planet' + i).width()/2));
            $("#line" + i).attr("y2", $('#planet' + i).offset().top + ($('#planet' + i).height()/2));
            $("#line" + i).attr("stroke", planetDis[i] < $('#planet' + i).width() ? "red" :  (planetDis[i] < $('#planet' + i).width()*2 ? "yellow" : "green"));
        }
        // console.log(planetDis);
    }
}



// Prevent arrow-keys and spacebar from scrolling the page.
window.addEventListener("keydown", (key) => {
    // space and arrow keys
    if([32, 37, 38, 39].indexOf(key.keyCode) > -1) {
        key.preventDefault();
    }
}, false);

