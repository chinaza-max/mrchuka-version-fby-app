stop = document.getElementById('btnStop');

function startAudioVisualizer(){

    let paths = document.getElementsByTagName('path');
    let visualizer = document.getElementById('visualizer');
    let mask = visualizer.getElementById('mask');
    let h = document.getElementsByTagName('h1')[0];
    let path;

    let report = 0;
    
    let soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179

        if(!stopAudioVisualizer){
            window.persistAudioStream = stream;
            h.innerHTML = "Thanks";
            h.setAttribute('style', 'opacity: 0;');
            let audioContent = new AudioContext();
            let audioStream = audioContent.createMediaStreamSource( stream );
            let analyser = audioContent.createAnalyser();
            audioStream.connect(analyser);
            analyser.fftSize = 1024;
    
            let frequencyArray = new Uint8Array(analyser.frequencyBinCount);
            visualizer.setAttribute('viewBox', '0 0 255 255');
          
                    //Through the frequencyArray has a length longer than 255, there seems to be no
            //significant data after this point. Not worth visualizing.
            for (let i = 0 ; i < 255; i++) {
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('stroke-dasharray', '4,1');
                mask.appendChild(path);
            }
            let doDraw = function () {

                if(!stopAudioVisualizer){
                    requestAnimationFrame(doDraw);
                    analyser.getByteFrequencyData(frequencyArray);
                    let adjustedLength;
                    for (let i = 0 ; i < 255; i++) {
                        adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
                        paths[i==0?1:i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + adjustedLength);
                    }
                }
                else{
                    for (let i = 0 ; i < 255; i++) {
                        paths[i==0?1:i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + 0);
                    }

                }
    
            }
            doDraw();
        }
        else{

        }
        
      


        stop.addEventListener('click', function (ev) {
			stopAudioVisualizer=true
		});
    }

    let soundNotAllowed = function (error) {
        h.innerHTML = "You must allow your microphone.";
        console.log(error);
    }

    /*window.navigator = window.navigator || {};
    /*navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;*/
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);

};