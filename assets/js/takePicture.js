
let localstream=''


$(window).on('load', function(){

    let camera_button = document.querySelector("#openCamera");
    let video = document.querySelector("#video");
    let click_button = document.querySelector("#click-photo");
    let canvas = document.querySelector("#canvas");


    camera_button.addEventListener('click',  function() {
        document.getElementById('attachment').value= null;

        $(document).ready(function(){
            $("#cameraModal").modal('show');
        });

        navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" }, audio: false  })
        .then(function(stream) {
            video.srcObject = stream;
            localstream=stream
        })
        .catch((e)=>{
          Swal.fire({
            icon:"warning",
            title:'Permission required',
            text: 'Allow camera access',
            confirmButtonColor: '#1c0d2e',
            footer:e
          })
        })
    })

    click_button.addEventListener('click', function() {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');
        $(document).ready(function(){
            $("#preUploadImage").modal('show');
        });

        document.getElementById("myPreUploadImage2").style.display="block"
        document.getElementById("myPreUploadImage").style.display="none"
        document.getElementById('myPreUploadImage2').src = image_data_url
        stopVideo()

    });


    function stopVideo(){
        
        
        video.srcObject.getTracks().forEach(track => {
            track.stop();
        });
        
    }
   
})


function stopVideo1(){
        
    /*
    video.pause();
    video.src = "";

    console.log(localstream)
    localstream.getTracks()[0].stop();

*/

    localstream.getTracks().forEach(track => {
        track.stop();
    });
    
}