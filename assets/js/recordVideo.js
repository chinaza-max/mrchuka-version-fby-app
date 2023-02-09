let camera_button2 = document.querySelector("#start-camera");
let video2 = document.querySelector("#video2");
let start_button = document.querySelector("#start-record");
let stop_button = document.querySelector("#stop-record");
let preUploadVideoSource=document.getElementById("preUploadVideoSource")
let videoTimeH = document.querySelector("#videoTimeH");
let videoTimeS = document.querySelector("#videoTimeS");




let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];
let video_local;
let hours=0
let seconds=0
let mySetInterval;
let videoState=""


camera_button2.addEventListener('click', async function() {
    try {

        
        if(videoState==""){
            start_button.style.display="none"
            stop_button.style.display="none"
            $(document).ready(function(){
                $("#cameraModalRecording").modal('show');
            });
    
            //for removing any attached stream
            if(camera_stream){
                //console.log(media_recorder.state);
                if(camera_stream.active==true&&media_recorder.state=="recording"){
                    stop_button.style.display="flex"
                }
                else{
                    start_button.style.display="flex"
                }
            }
            else{
                
                camera_stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true });
                video2.srcObject = camera_stream;
                start_button.style.display="flex"
    
                media_recorder = new MediaRecorder(camera_stream, { mimeType: 'video/webm' });
                media_recorder.addEventListener('dataavailable', function(e) {
                    blobs_recorded.push(e.data);
                });
            }
    
           // console.log(media_recorder.state);
            //console.log(camera_stream.active)
        }
        else{
            $(document).ready(function(){
                $("#preUploadVideo").modal('show');
            });
            clearDisplayTime()
        }
      


    } catch (error) {

        clearDisplayTime()
        $(document).ready(function(){
            $("#warning2").modal('show');
        });
    
    }

});

start_button.addEventListener('click', function() {
    stop_button.style.display="flex"
    start_button.style.display="none"
    blobs_recorded=[]

    mySetInterval=setInterval(function(){
        videoCountTime()
      }, 1000);

    // event : recording stopped & all blobs sent
    media_recorder.addEventListener('stop', function() {
    	// create local object URL from the recorded video blobs
       // console.log(blobs_recorded)
        //console.log("llllllllllllllllllllllll")

    	video_local = URL.createObjectURL(new Blob(blobs_recorded, { type: 'video/webm' }));
        preUploadVideoSource.src=video_local

        camera_stream.getTracks().forEach(track => {
            track.stop();
        });

        videoState="hasVideo"
        clearDisplayTime()
        //console.log(camera_stream.active)

       
    });


    // start recording with each recorded blob having 1 second video
  
    if(media_recorder.state=="inactive"){
        media_recorder.start(1000);
    }

    else{
        $(document).ready(function(){
            $("#warning3").modal('show');
        });
    }
});



stop_button.addEventListener('click', function() {


    if(camera_stream.active==true){
        media_recorder.stop(); 
        $(document).ready(function(){
            $("#preUploadVideo").modal('show');
        });
    }
    else{
        $(document).ready(function(){
            $("#warning4").modal('show');
        });
    }


    
});


function videoCountTime(){
   
  
    if(seconds!=60){
        seconds+=1
    }
    else{
        seconds=0
        hours+=1
    }
    displayTime()
}

function displayTime(){
    videoTimeH.textContent =hours
    videoTimeS.textContent =seconds
}

function clearDisplayTime(){
    hours=0
    seconds=0
    videoTimeH.textContent =hours
    videoTimeS.textContent =seconds
    clearInterval(mySetInterval);
}

function initializeVideoState(){
    videoState=""
    camera_stream=null
    clearDisplayTime()
}