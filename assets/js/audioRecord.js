let startB = document.getElementById('btnStart');
let stopB = document.getElementById('btnStop');
let playAudio = document.getElementById('audioPlay');
let audio_button = document.getElementById('audioButton');
let stopAudioVisualizer=false
let audioTimeH = document.querySelector("#audioTimeH");
let audioTimeS = document.querySelector("#audioTimeS");

let hoursA=0
let secondsA=0
let mySetIntervalA;
let audioState=""
let mediaRecorder=null
let audioChunks = [];


audio_button.addEventListener('click', async function() {

	if(audioState==""){

		if(mediaRecorder){
			if(mediaRecorder.state=="recording"){
				stopB.style.display="flex"
				startB.style.display="none"
			}
			$(document).ready(function(){
				$("#audioModal").modal('show');
			});
		}
		else{
				
		navigator.mediaDevices.getUserMedia({ audio: true })
		.then(function (mediaStreamObj) {


			

			mediaRecorder = new MediaRecorder(mediaStreamObj);
			console.log(mediaRecorder.state)
			audioChunks = [];
			mediaRecorder.addEventListener("dataavailable", event => {
				audioChunks.push(event.data);
			});
		
			stopB.style.display="none"
			startB.style.display="flex"
			$(document).ready(function(){
				$("#audioModal").modal('show');
			});

			startB.addEventListener('click', function (ev) {
				stopB.style.display="flex"
				startB.style.display="none"
				stopAudioVisualizer=false
				audioChunks = [];
				mediaRecorder.start();
				startAudioVisualizer()

				mySetIntervalA=setInterval(function(){
					audeoCountTime()
				}, 1000);
				//console.log(mediaRecorder.state);
			})

			// Stop event
			stopB.addEventListener('click', function (ev) {
				mediaRecorder.stop();
			});


			mediaRecorder.onstop = function (ev) {

			// blob of type mp3
			const audioBlob  = new Blob(audioChunks,{ 'type': 'audio/mp3;' });
		
			$(document).ready(function(){
				$("#preUploadAudio").modal('show');
			});

			let audioSrc = window.URL.createObjectURL(audioBlob);
				playAudio.src = audioSrc;

				audioState="hasAudio"
				clearDisplayTimeA()
			}

			
		})

		// If any error occurs then handles the error
		.catch(function (err) {
			console.log(err.name, err.message);
		});
		}
	
	}
	else{
		$(document).ready(function(){
			$("#preUploadAudio").modal('show');
		});
		clearDisplayTimeA()
	}
})

function audeoCountTime(){
   
    if(secondsA!=60){
        secondsA+=1
    }
    else{
        secondsA=0
        hoursA+=1
    }
    displayTimeA()
}

function displayTimeA(){
    audioTimeH.textContent =hoursA
    audioTimeS.textContent =secondsA
}

function clearDisplayTimeA(){
    hoursA=0
    secondsA=0
    audioTimeH.textContent =hoursA
    audioTimeS.textContent =secondsA
    clearInterval(mySetIntervalA);
}


function initializeVideoStateA(){
    audioState=''
	audioChunks = [];
    clearDisplayTimeA()
}
/*
for reference implementation https://www.geeksforgeeks.org/how-to-record-and-play-audio-in-javascript/

*/