//compare https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
            
var oscilloscope = (function() {
    var analyser, drawing;
    
    function analyse() {
        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount,
        dataArray = new Uint8Array(bufferLength);
        
        var canvas = document.getElementById('oscilloscope');
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#111111';
        ctx.strokeStyle = '#0fc929';
        ctx.lineWidth = 1.5;
        drawing = true;
        
        function draw() {
        if (drawing) requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        var sliceWidth = canvas.width * 1.0 / bufferLength;
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0,
            y = v * canvas.height / 2;
            if (i === 0) {
            ctx.moveTo(x, y);
            }
            else {
            ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        }
        
        analyser.getByteTimeDomainData(dataArray);
        draw();
    }
    
    function start() {
        document.getElementsByClassName('speakData').disabled = true;
        if (!analyser) analyser = meSpeak.getAudioAnalyser();
        analyse();
        meSpeak.speak(text.value, {}, function() { stop(); });
    }
    
    function stop() {
        drawing = false;
        document.getElementsByClassName('speakData').disabled = false;
    }
    
    function loadMeSpeak() {
        var script = document.createElement('script');
        script.src = 'meSpeak/mespeak.js';
        script.onload = function() {
        if (typeof meSpeak !== 'undefined' && meSpeak.canPlay()) meSpeak.loadVoice('en/en-rp');
        document.getElementsByClassName('speakData').disabled = false;
        };
        document.querySelector('head').appendChild(script);
    }
    
    loadMeSpeak();
    
    return { "start": start };
    })();