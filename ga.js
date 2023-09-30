// var path = $('#followPath').get(0);
// var pathLength = path.getTotalLength();
// var planetA = $('#circle');


// planetA.on('change', function() {
//     var x_val = planetA.attr('cx');
//     var y_val = planetA.attr('cy');
//     $('body').append(x_val);
// });

let car;
let trail = []; // Leave a trail behind the car
const TRAIL_LENGTH = 50;
var crashed = false;

function start() {
    $('#game-over').css('display', 'none');
    $('#game-over-bg').css('display', 'none');
    console.log("pressed");
    trail = [];
    setup();
    loop();
}

document.getElementById("start-stop").addEventListener("click", start);

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
    $("#spacecraft").css({top: (trail.length > 30 ? trail[30].position.y - 15 + "px" : 0), left: (trail.length > 30 ? trail[30].position.x - 15 + "px" : 0), position:'relative'});
    $("#spacecraft-icon").css({ 'transform': 'rotate(' + ((car.angle)/Math.PI)*180 + 'deg)'});
    if(trail.length > 30){
        for (let i=0; i < 1; i++){
            planetDis[i] = Math.sqrt(Math.pow(Math.abs(trail[30].position.y - planetY[i]),2) + 
            Math.pow(Math.abs(trail[30].position.x - planetX[i]),2));

            // console.log(planetDis[i]);
            if(planetDis[i] < 45) {
                $('#game-over').css('display', 'flex');
                $('#game-over-bg').css('display', 'flex');
                crashed = true;
                noLoop();

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

