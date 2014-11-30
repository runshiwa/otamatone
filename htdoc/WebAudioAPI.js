var ac, g, o;
var digital;
var canvas;

var octaveOffset = 1;
var octaveRange = 1;
var keyColor = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0];

var controlByMouse = false;
var controlByTouch = true;

function start(name){
    ac = new AudioContext();
    g = ac.createGain();
    g.connect(ac.destination);
    o = ac.createOscillator();
    o.connect(g);

    setPower(0);
    setDigital(1);
    setFrequency(440);
    o.start();

    canvas = document.getElementById(name);
    canvas.addEventListener("touchmove", function(event){
	event.preventDefault();
    }); 
    if(controlByMouse){
	//canvas.addEventListener("mousemove", draw);
	canvas.addEventListener("mousedown", noteOn);
	canvas.addEventListener("mouseup", noteOff);
	canvas.addEventListener("mousemove", modulate);
    }
    if(controlByTouch){
	//canvas.addEventListener("touchmove", draw);
	canvas.addEventListener("touchstart", noteOn);
	canvas.addEventListener("touchend", noteOff);
	canvas.addEventListener("touchmove", modulate);
    }
    canvas.addEventListener("resize", fitCanvas());
    fitCanvas();
}

function drawFret(canvas){
    var context = canvas.getContext("2d");

    var lastKey = octaveOffset * 12 + Math.round(octaveRange * -1 * 12);
    var key = lastKey;
    key %=  keyColor.length;
    if(key < 0)
	key += keyColor.length;
    if(keyColor[key])
	context.fillStyle = "white";
    else
	context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width - 0, canvas.height);
    for(var x = 0; x < canvas.width; x++){
	var w = (x - canvas.width / 2) / (canvas.width / 2);
	key = octaveOffset * 12 + Math.round(octaveRange * w * 12);
	if(lastKey != key){
	    lastKey = key;
	    key %= keyColor.length;
	    if(key < 0)
		key += keyColor.length;
	    if(keyColor[key])
		context.fillStyle = "white";
	    else
		context.fillStyle = "black";
	    context.fillRect(x, 0, canvas.width - x, canvas.height);
	    context.moveTo(x, 0);
	    context.lineTo(x, canvas.height);
	}
    }
    context.fill();
    context.stroke();
}

function fitCanvas(){
    canvas.width = innerWidth;
    canvas.height = innerHeight * 0.8;
    drawFret(canvas);
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
    //event.preventDefault();

    //console.log(event);

    var context = event.target.getContext("2d");

    if(event.offsetX && event.offsetY)
	context.fillRect(event.offsetX, event.offsetY, 5, 5);
    for(var i = 0; i < event.targetTouches.length; i++){
	document.control.message.value = "touch[" + i + "]=(" + event.targetTouches[i].pageX + ", " + event.targetTouches[i].pageY + ")";
	context.fillRect(event.targetTouches[i].pageX - getOffsetLeft(event.target), event.targetTouches[i].pageY - getOffsetTop(event.target), 5, 5);
    }
}

function noteOn(event){
    setPower(1);
    modulate(event);
}

function noteOff(event){
    setPower(0);
}

function modulate(event){
    var x, y;
    if(event.offsetX && event.offsetY){
	x = event.offsetX;
	y = event.offsetY;
    }
    for(var i = 0; i < event.targetTouches.length; i++){
	x = event.targetTouches[i].pageX - getOffsetLeft(event.target);
	y = event.targetTouches[i].pageY - getOffsetTop(event.target);
    }

    var w = (x - canvas.width / 2) / (canvas.width / 2);
    var h = (y - canvas.height / 2) / (canvas.height / 2);
    //console.log("w=" + w + " h=" + h);

    var f, d;
    if(!digital){
	f = 440 * Math.pow(2, octaveOffset + octaveRange * w);
    }
    else {
	var key = octaveOffset * 12 + Math.round(octaveRange * w * 12);
	document.control.message.value = key % keyColor.length;
	f = 440 * Math.pow(2, key / 12);
    }
    d = 2 * 100 * -h;
    //d = 2 * 100 * Math.round(-h * 3) / 3;

    setFrequency(f);
    setDetune(d);
}

function getOffsetLeft(element){
    var result = 0;
    do {
	if (!isNaN(element.offsetLeft)){
            result += element.offsetLeft;
	}
    } while(element = element.offsetParent);
    return result;
}

function getOffsetTop(element){
    var result = 0;
    do {
	if (!isNaN(element.offsetTop)){
            result += element.offsetTop;
	}
    } while(element = element.offsetParent);
    return result;
}
