var Player = function (context) {
    this.playing = false;

    this.vco = context.createOscillator();
    this.vco.type = 'sine';
    this.vco.frequency.value = 440;
    this.vco.start(0);

    this.vca = context.createGain();
    this.vca.gain = 0;

    this.vco.connect(this.vca);
    this.vca.connect(context.destination);
}

Player.prototype.changeFreq = function (frequency) {
    var that = this;
    that.vco.frequency.value = frequency;
}


Player.prototype.play = function () {
    var that = this;

    if (!that.playing) {

        that.interval = setInterval(function(){ 
            var now = context.currentTime;
            //that.vca.gain.cancelScheduledValues( now );
            that.vca.gain.setValueAtTime(that.vca.gain.value, now);
            that.vca.gain.linearRampToValueAtTime(1 , now + 0.025);
            that.vca.gain.linearRampToValueAtTime(0 , now + 0.1);
        }, 125);
        that.playing = true;
    }
}

Player.prototype.pause = function () {
    var that = this;
    clearInterval(that.interval);
    that.vca.gain.value = 0;
    that.playing = false;
}

Player.prototype.setWaveform = function (waveform) {
    this.vco.type = waveform;
};