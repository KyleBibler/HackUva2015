/**
 * Created by Kyle on 2/28/2015.
 */

var controller = new Leap.Controller({enableGestures: true, frameEventName: 'animationFrame'});

controller.on('connect', function () {
    console.log("Successfully connected");
});
controller.on('deviceStreaming', function() {
    console.log('Device connected!');
});
controller.connect();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    canvasCenter = (window.innerWidth-50) / 2;

ctx.canvas.width  = canvasCenter * 2;
ctx.canvas.height = window.innerHeight-10;

controller.on('frame', function(frame) {

ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
ctx.font = "20pt sans-serif";


//Variable declarations
var position,
    normalized,
    x,
    y,
    leftHandY,
    leftHandX,
    rightHandY,
    rightHandX,
    iBox = frame.interactionBox;

//frame.hands.forEach(function(hand){
//    position = hand.palmPosition;
//    normalized = iBox.normalizePoint(position, true);
//    if(hand.type == 'right') {
//        rightHandY = ctx.canvas.height * (1-normalized[1]);
//        rightHandX = ctx.canvas.width * normalized[0];
//    } else {
//        leftHandY = ctx.canvas.height * (1-normalized[1]);
//        leftHandX = ctx.canvas.width * normalized[0];
//    }
//});


//Gives message if no hands are in the Leap space
if(frame.pointables.length === 0) {
    ctx.beginPath();
    ctx.lineWidth = 7;
    ctx.strokeStyle = 'black';
    ctx.fillText("No Hands Are Detected", canvasCenter-150, ctx.canvas.height/3);
    ctx.stroke();
} else {

}



frame.pointables.forEach(function(pointable) {
    var finger = frame.finger(pointable.id);
    if (finger.type > 0) {
        var position = pointable.tipPosition;
        normalized = iBox.normalizePoint(position, true);

        //gets x and y coords of the finger tip position, normalized
        x = ctx.canvas.width * normalized[0];
        y = ctx.canvas.height * (1 - normalized[1]);


        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.rect(x, y, 40, 40);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.stroke();
    }
});
});
