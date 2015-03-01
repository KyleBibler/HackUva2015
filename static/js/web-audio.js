

    var context = new AudioContext();
    
    var Player = function () {
        this.vco = = context.createOscillator();
    vco.type = vco.SINE;
    vco.frequency.value = 440;
    vco.start(0);
    }


    var player = {};


 
    /* VCO */
    var vco = context.createOscillator();
    vco.type = vco.SINE;
    vco.frequency.value = 440;
    vco.start(0);
 
    /* VCA */
    var vca = context.createGain();
    vca.gain.value = 1;
 
    /* Connections */
    vco.connect(vca);
    vca.connect(context.destination);
 
    player.play = function (frequency) {
        vco.frequency.value = frequency;
        player.interval = setInterval(function(){ 
            var now = context.currentTime;
            vca.gain.cancelScheduledValues( now );
            vca.gain.setValueAtTime(vca.gain.value, now);
            vca.gain.linearRampToValueAtTime(1 , now + 0.025);
            vca.gain.linearRampToValueAtTime(0 , now + 0.1);
        }, 125);
    };
 
    player.pause = function () {
        clearInterval(player.interval);
        vca.gain.value = 0;
    };

    player.setWaveform = function (waveform) {
        vco.type = waveform;
    };

    player.play(440);
