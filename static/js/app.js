/**
 * Created by Kyle on 2/28/2015.
 */

//Gets the wave value from the checked radio button
var wave = $('input[name="wave"]:checked').val() || "sine",
    context = new AudioContext(),
    player = new Player(context);

$('input[name="wave"]').change(function() {
    if(this.checked) {
        wave = this.value;
        player.setWaveform(wave);
    }
});

//Sets up the leap controller
var controller = new Leap.Controller({enableGestures: true, frameEventName: 'animationFrame'});
controller.on('connect', function () {
    console.log("Successfully connected");
});controller.on('deviceStreaming', function() {
    console.log('Device connected!');
});
controller.connect();


//Creates the canvas for the leap feedback
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    canvasCenter = (window.innerWidth-40) / 2;
ctx.canvas.width  = canvasCenter * 2;
ctx.canvas.height = window.innerHeight*0.65;


//Sets the frequency table for the C Major scale
var freqs = [ 523, 587, 659, 698, 784, 880, 1046, 1174, 1318, 1396, 1568, 1760, 2092 ].reverse();
var getFreq = function(y_val) {
	return freqs[Math.ceil((1-y_val)*(freqs.length+1))-1]
},
    changeWave = function(x_val) {
        var val;
    if(x_val < 0.25) {
        val = "sine";
    }
    else if(x_val < 0.5) {
        val = "square";
    }
    else if(x_val < 0.75) {
        val = "triangle";
    } else {
        val = "sawtooth";
    }
    $('input:radio[name="wave"]').val([val]);
    player.setWaveform(val);
};


controller.on('frame', function(frame) {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = "20pt sans-serif";

    //Variable declarations
    var normalized,
        x,
        y,
        freq = 523,
        rightHandDetected = false;
        iBox = frame.interactionBox;

    frame.hands.forEach(function(hand){
        if(hand.type == 'right') {
            rightHandDetected = true;
            position = hand.palmPosition;
            normalized = iBox.normalizePoint(position, true);
            x = ctx.canvas.width * normalized[0];
            y = ctx.canvas.height * (1 - normalized[1]);
            player.changeFreq(getFreq(normalized[1]));
            changeWave(normalized[0]);
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.rect(x, y, 25, 25);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'black';
            ctx.stroke();
        }
    });

    //Gives message if no hands are in the Leap space
    if(!rightHandDetected) {
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = 'black';
        ctx.fillText("Right hand is not Detected", canvasCenter-150, ctx.canvas.height/3);
        ctx.stroke();
        player.pause();
    } else {
        player.play();
    }
    rightHandDetected = false;
});
