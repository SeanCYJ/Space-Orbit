// var path = $('#followPath').get(0);
// var pathLength = path.getTotalLength();
// var planetA = $('#circle');


// planetA.on('change', function() {
//     var x_val = planetA.attr('cx');
//     var y_val = planetA.attr('cy');
//     $('body').append(x_val);
// });



$('#ButtonAnimation').on('click', function() {  
    // $('body').append(pathLength);
});


var oriOffset = $('#planetA').offset();

function orbitA() {
    $('#planetA').animate(
        {
        
        offsetDistance: "99.9%",
        }, 
        { 
            duration: 30000,
            easing: "linear",
            step: function() {
                var offset = $("#planetA").offset();
                $("h4").text("Location of the box is: (left: " + 
                    offset.left + ", top: " + offset.top + ")");
            },
            complete: function(){
                // $("#planetA").offset({top: oriOffset.top, left: oriOffset.left});
                $("#planetA").css("offset-distance", 0);
                orbitA();
            }
        }
    );
}

orbitA();