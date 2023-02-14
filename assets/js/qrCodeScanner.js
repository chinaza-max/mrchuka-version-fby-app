const qrcode2 = window.qrcode;
const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");


const qrResult = document.getElementById("qr-result");
//const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;


let myTimer

var x = 0;
var y = 0;
var width = 800;
var height = 470;
var lineHeight = 10;
var lineWidth = width;
var speed = 5;
var direction = 1;

qrcode2.callback = (res) => {

    if (res) {
      sendQRCode(res)
      scanning = false;
  
      video.srcObject.getTracks().forEach(track => {
        track.stop();
      });
  
      qrResult.hidden = false;
      btnScanQR.hidden = false;
      canvasElement.hidden = true;
      clearTimeout(myTimer)
    
    }
};



  btnScanQR.onclick = () =>{


   myTimer=setTimeout(clearQRcodeScan, 20000);

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
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
    
};


function tick() {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      



    
    function animateScan() {

      canvas.fillStyle = "white";
      canvas.fillRect(x, y, lineWidth, lineHeight);

      y += speed * direction;
      if (y + lineHeight >= height) {
        direction = -1;
      }
      if (y <= 0) {
        direction = 1;
      }
    }

    animateScan()

    scanning && requestAnimationFrame(tick);
  //  setInterval(animateScan, 50);

  }


  function scan() {

    if(scanning==true){
      $("#stopScan").css("display","flex")
    }
    try {
      qrcode2.decode();
      
    } catch (e) {
      if(scanning==true){
        setTimeout(scan, 300);
      }

    }
  }

  function stopScan(){
    $("#btn-scan-qr").css("display","flex")
    $("#stopScan").css("display","none")

    //outputData.innerText = '';
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    btnScanQR.hidden = false;
    canvasElement.hidden = true;

  }


  function  sendQRCode(res){
    $.ajax({
      type: "post", url:`${domain}/api/v1/job/verify_securitycode`,
      headers: {
          "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
      },
      data: {
            job_id:myActiveJob_id,
            guard_id:localStorage.myGuard_id,
            security_code:res
        },
      success: function (data) {     


        console.log(data)
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'QR code proccessed successfully',
          showConfirmButton: false,
          timer: 1500
        })


      },
      error: function (request, status, error) {

          let message=request.responseJSON.message
          if(request.responseJSON.status=="security_code_verification_error"){
            Swal.fire({
              icon: 'warning',
              text: message,
              showCloseButton: true,
              confirmButtonAriaLabel: 'ok'
            })
          }
          else{
            analyzeError(request)

          }
      }
    })
  }



  function clearQRcodeScan(){
    clearTimeout(myTimer)
    stopScan()
  }