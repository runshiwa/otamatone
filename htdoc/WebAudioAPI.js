var ac, g, o;
var digital;
var canvas;

function start(){
    ac = new AudioContext();
    g = ac.createGain();
    g.connect(ac.destination);
    o = ac.createOscillator();
    o.connect(g);

    setPower(0);
    setDigital(1);
    setFrequency(440);
    o.start();

    canvas = document.getElementById("instrument");
    //canvas.addEventListener("touchmove", draw);
    //canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mousedown", noteOn);
    canvas.addEventListener("mouseup", noteOff);
    canvas.addEventListener("touchstart", noteOn);
    canvas.addEventListener("touchend", noteOff);
    canvas.addEventListener("touchmove", modulate);
    canvas.addEventListener("mousemove", modulate);

    canvas.addEventListener("resize", fitCanvas());
    fitCanvas();
}

function fitCanvas(){
    canvas.width = innerWidth * 0.9;
    canvas.height = innerHeight * 0.9;
}

function setPower(value){
    g.gain.value = value * document.control.gain.value;
    document.control.power.value = value;
}

function setWaveForm(value){
    o.type = value;
}

function setDigital(value){
    digital = value;
}

function setGain(value){
    g.gain.value = document.control.power.value * value;
    document.control.gain.value = value;
}

function setFrequency(value){
    //console.log("f=" + value);
    o.frequency.value = value;
    document.control.frequency.value = value;
}

function setDetune(value){
    //console.log("d=" + value);
    o.detune.value = value;
    document.control.detune.value = value;
}

function draw(event){
    console.log(event);

    var context = canvas.getContext("2d");

    context.fillRect(event.offsetX, event.offsetY, 5, 5);
    for(var i in event.touches){
	context.fillRect(i.offsetX, i.offsetY, 5, 5);
    }
}

function noteOn(event){
    setPower(1);
}

function noteOff(event){
    setPower(0);
}

function modulate(event){
    var w = (event.offsetX - canvas.width / 2) / (canvas.width / 2);
    var h = (event.offsetY - canvas.height / 2) / (canvas.height / 2);
    //console.log("w=" + w + " h=" + h);

    var f, d;
    if(!digital){
	f = 440 * Math.pow(2, 1 + 3 * w);
    }
    else {
	f = 440 * Math.pow(2, 1 + Math.round(3 * w * 12) / 12);
    }
    d = 2 * 100 * -h;
    //d = 2 * 100 * Math.round(-h * 3) / 3;

    setFrequency(f);
    setDetune(d);
}
