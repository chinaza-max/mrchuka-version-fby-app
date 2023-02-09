
let sizeSwitch =175;
let switchHandle = $('#switch .handle');
let switchHandle2 = $('#switch2 .handle');
let switchHandle3 = $('#switch3 .handle');
let switchArea =  $('#switch');
let switchArea2 =  $('#switch2');
let switchArea3 =  $('#switch3');
let dateIndex=0;
let mySchedule=[0]
let myTimeZone=''

switchHandle.draggable({
  axis: 'x',
  containment: 'parent',
  stop: function() {
    conditionMove();
  }
})




switchHandle2.draggable({
    axis: 'x',
    containment: 'parent',
    stop: function() {
      conditionMove2();
    }
})





switchHandle3.draggable({
  axis: 'x',
  containment: 'parent',
  stop: function() {
    conditionMove3();
  }
})


function conditionMove() {
  if(parseInt(switchHandle.css('left')) <= (sizeSwitch / 2)) {
    switchHandle.animate({
      left: 0
    }, 100);
  }
  else {
    switchHandle.animate({
      left: sizeSwitch + 'px'
    }, 100);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, () => {

            Swal.fire({
              title: 'Action Required',
              text: "Location permission is required to proceed!",
              icon: 'warning',
              confirmButtonColor: '#1c0d2e',
              confirmButtonText: 'ok'
            })

            switchHandle.animate({
              left: 0
            }, 100)
        
          });
          
        } else { 
          console.log("Geolocation is not supported by this browser.")
        }
        function showPosition(position) {
         
          $.ajax({
            type: "post", url: `${domain}/api/v1/job/check-in`,
            dataType  : 'json',
             encode  : true,
            data: {
              check_in: true,
              latitude: Number(position.coords.latitude).toFixed(8) ,
              longitude: Number(position.coords.longitude).toFixed(8),
              job_id:myActiveJob_id
            },
            headers: {
              "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
            },
            success: function (data, text) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'successfully checked in',
                showConfirmButton: false,
                timer: 1500
              })

              switchHandle.animate({
                left: 0
              }, 100);
            },
            error: function (request, status, error) {

              console.log(request)
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: request.responseJSON.message,
               
              })
              switchHandle.animate({
                left: 0
              }, 100);
            }
          });
    
        }
  

     // if(k==mySchedule.length-1){
      /*  Swal.fire({
          title: 'Not yet time',
          confirmButtonColor: '#1c0d2e',
          confirmButtonText: 'ok'
        })
        */
/*
        $(document).ready(function(){
          $("#warning").modal('show');
        });
        switchHandle.animate({
          left: 0
        }, 100);
      }*/
         
  }
}



function conditionMove2() {
  if(parseInt(switchHandle2.css('left')) <= (sizeSwitch / 2)) {
    switchHandle2.animate({
      left: 0
    }, 100);
    
  }
  else {
    switchHandle2.animate({
      left: sizeSwitch + 'px'
    }, 100);
      
        if (navigator.geolocation) {
          
          navigator.geolocation.getCurrentPosition(showPosition, () => {

         
            Swal.fire({
              title: 'Action Required',
              text: "Location permission is required to proceed!",
              icon: 'warning',
              confirmButtonColor: '#1c0d2e',
              confirmButtonText: 'ok'
            })
        
          })
        } else { 
          console.log("Geolocation is not supported by this browser.")
        }
        function showPosition(position) {
         
   
          $.ajax({
            type: "post", url: `${domain}/api/v1/job/check-in`,
            dataType  : 'json',
           encode  : true,
            headers: {
              "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
            },
            data: {
              check_in: false,
              latitude: position.coords.latitude,
              longitude:position.coords.longitude,
              job_id:myActiveJob_id
            },
        
            success: function (data, text) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'successfully checked out',
                
                showConfirmButton: false,
                timer: 1500
              })

              switchHandle2.animate({
                left: 0
              }, 100);

            },
            error: function (request, status, error) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: request.responseJSON.message,
               
              })
              

              switchHandle2.animate({
                left: 0
              }, 100);
            }
          });
    
        }
}
}




function conditionMove3() {
    if(parseInt(switchHandle3.css('left')) <= (sizeSwitch / 2)) {
      switchHandle3.animate({
        left: 0
      }, 100);
    }
    else {
   

      switchHandle3.animate({
        left: 0
      }, 100);
      $('#add_note').modal('show');

  }
}



let getActiveJob
let getTask
let getInstruction


$(document).ready(function() {



  if(viewedJobStatus=="completed"){
    
    $("#emergencyButton").addClass("disabled");
    $("#btn-scan-qr").addClass("disabled");
    $("#safetyCheck").addClass("disabled");

    $("#check_in_and_out").css({'z-index':'-1'});


    
  }
  else{
    $("#emergencyButton").removeClass("disabled");
    $("#btn-scan-qr").removeClass("disabled");
    $("#safetyCheck").removeClass("disabled");
  }


  getActiveJob=function(){
              
  $.ajax({
    type: "get", url: `${domain}/api/v1/job/myJobs/getSinglejob?job_id=${myActiveJob_id}`,
    dataType  : 'json',
    encode  : true,
    headers: {
        "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
    },
    success: function (data) {

      $(".jobLoader").css("display", "none");

          setGuardId(data.data[0].guard_id)
          if(data.data.length==0){
            window.location.href =window.location.toString().split('/')[0] + "/index.html"
          }     
          myTimeZone=data.data[0].time_zone
          $.ready.then(function(){
    
           // $("#myPageTitle2").text(data.data[0].facility_name);

          })

          $("#myPageTitle").text(data.data[0].facility_name);
          $("#address").text(data.data[0].address);
          $("#amountPerHour").text(data.data[0].guard_charge);
          $("#hoursWorked").text(data.data[0].hours_worked);
          $("#earned").text(data.data[0].earn);

          $("#date").append(
            ` 
            <tr>
                <td class="text-nowrap"> ${data.data[0].schedule[0].check_in_date}</td>
                <td class="text-nowrap">${data.data[0].schedule[0].start_time}</td>
                <td class="text-nowrap">${data.data[0].schedule[data.data[0].schedule.length-1].check_out_date}</td>
                <td class="text-nowrap">${data.data[0].schedule[data.data[0].schedule.length-1].end_time}</td>
            </tr>
            `
          );
          $("#description").append(
            ` 
              <div class="custom-control custom-checkbox mb-3">
                ${data.data[0].description}
              </div>
            `
          );


          mySchedule=data.data[0].schedule
          startCountDown()
   
          $("#jobType").text(data.data[0].job_type);


          for(let j=0; j<data.data[0].schedule.length;j++){
                
            $(`#scheduleTable`).append(
                ` 
                <tr>
                <td class="text-nowrap"> ${data.data[0].schedule[j].check_in_date}</td>
                <td class="text-nowrap">${data.data[0].schedule[j].start_time}</td>
                <td class="text-nowrap"> ${data.data[0].schedule[j].check_out_date}</td>
                <td class="text-nowrap">${data.data[0].schedule[j].end_time}</td>
            </tr>
                `
            )
          }
          return
        
    
    
    },
    error: function (request, status, error) {
        localStorage.removeItem("myUser");
        //window.location.replace('https://sunny-kataifi-7adb6f.netlify.app/sign-in.html')
       // window.location.replace('/sign-in.html')
        window.location.href =window.location.toString().split('/')[0] + "/sign-in.html"

    }
  });
  }

  getActiveJob()


  getTask=()=>{
    $.ajax({
      type: "post", url:`${domain}/api/v1/job/allJobs/oneAgendaPerGuard`,
      headers: {
          "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
      },
      dataType  : 'json',
      encode  : true,
      data: {
          guard_id:localStorage.myGuard_id,
          job_id: myActiveJob_id,
          type:"TASK"
        },
      success: function (data) {        
          console.log(data.data)

          disPlayTask(data.data)
        
      },
      error: function (request, status, error) {
          $('#loader6').css("display","none");
          analyzeError(request)
      }
    })
  }

  getTask()


    
  getInstruction=()=>{
    $.ajax({
      type: "post", url:`${domain}/api/v1/job/allJobs/oneAgendaPerGuard`,
      headers: {
          "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
      },
      dataType  : 'json',
      encode  : true,
      data: {
          guard_id:localStorage.myGuard_id,
          job_id: myActiveJob_id,
          type:"INSTRUCTION"  
        },
      success: function (data) {         
          console.log(data.data)   
          disPlayInstruction(data.data)     
      },
      error: function (request, status, error) {
          $('#loader6').css("display","none");
          analyzeError(request)
      }
    })
  }

  getInstruction()
})



function  disPlayInstruction(val){
 

  let data=''

if(val.length!=0){
    
  for (let i = 0; i < val.length; i++) {

    if(val[i].agenda_done){
      data+= `
  
    <div class="item">
    <div class="icon-block">
    
    <div class="icon sli-check"></div>

    <div class="item-icon icofont-search-document bg-info"></div>

    </div>

    <div class="content-block">
      <div class="item-header">
        <h3 class="h5 item-title">${val[i].title}</h3>

        <div class="item-date"><span>${val[i].operation_date}</span></div>
      </div>

      <div class="item-desc">${val[i].description}.</div>
    </div>
  </div>
      `
    }
    else{
      data+= `
      <div class="item">
      <div class="icon-block">
      <div class="icon sli-close"></div>
        <div class="item-icon icofont-search-document bg-info"></div>
      </div>
  
      <div class="content-block">
        <div class="item-header">
          <h3 class="h5 item-title">${val[i].title}</h3>
  
          <div class="item-date"><span>${val[i].operation_date}</span></div>
        </div>
  
        <div class="item-desc">${val[i].description}.</div>
      </div>
    </div>
      `
    }
   
    if(i== val.length-1){
      $('#instruction').children().remove();
      $("#instruction").append(data)
    }
  }
}
else{
  $('#instruction').children().remove();
  $("#instruction").append(`
  <div class="card-body"  style="text-align: center;">
            NO INSTRUCTION
  </div>`)
}


setTimeout(() => {
  $('.mycheckButton').on('change', function(){ 
      
        $.ajax({
          type: "post", url:`${domain}/api/v1/job/check_task_guard`,
          headers: {
              "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
          },
          data: {
              agenda_id:this.value  
            },
          success: function (data) {         
           
              showModalSuccess(data.message  )
              setTimeout(() => {
                  hideModalSuccess()
              }, 3000);
          },
          error: function (request, status, error) {
              $('#loader6').css("display","none");
              analyzeError(request)
          }
        })

  })
}, 1000);
}

function  disPlayTask(val){
 

    let data=''

  if(val.length!=0){
      
    for (let i = 0; i < val.length; i++) {

      if(val[i].agenda_done){
        data+= `
        <div class="form-check">
          <input class="form-check-input mycheckButton"  type="checkbox" value="${val[i].agenda_id}" id="defaultCheck2" checked>
          <label class="form-check-label" for="defaultCheck2">
            ${val[i].description}
          </label>
        </div>
        `
      }
      else{
        data+= `
        <div class="form-check">
          <input class="form-check-input mycheckButton" type="checkbox" value="${val[i].agenda_id}" id="defaultCheck2">
          <label class="form-check-label" for="defaultCheck2">
          ${val[i].description}
          </label>
        </div>
        `
      }
     
      if(i== val.length-1){
        $('#task').children().remove();
        $("#task").append(data)
      }
    }
  }
  else{
    $('#task').children().remove();
    $("#task").append(`
    <div class="card-body"  style="text-align: center;">
              NO TASK
    </div>`)
  }


  setTimeout(() => {
    $('.mycheckButton').on('change', function(){ 
        
          $.ajax({
            type: "post", url:`${domain}/api/v1/job/check_task_guard`,
            headers: {
                "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
            },
            data: {
                agenda_id:this.value  
              },
            success: function (data) {         
             
                showModalSuccess(data.message  )
                setTimeout(() => {
                    hideModalSuccess()
                }, 3000);
            },
            error: function (request, status, error) {
                $('#loader6').css("display","none");
                analyzeError(request)
            }
          })

    })
  }, 1000);
}







  function isSameDate(date1, date2){

    if(date1.getDay()==date2.getDay()&&
      date1.getMonth()==date2.getMonth()&&
      date1.getFullYear()==date2.getFullYear()){
        return true
    }

    else{
      return false
    }

  }


 function startCountDown(){

    for(let i=0; i<mySchedule.length; i++){

     // mySchedule[i].check_in_date
      let countDownDate = new Date(mySchedule[i].check_in_date +" "+mySchedule[i].start_time).getTime();
      let now = new Date(new Date().toLocaleString('en', {timeZone:myTimeZone})).getTime();
      let distance = countDownDate - now;

      if (distance < 0) {
        continue
      }
      else{

        let x = setInterval(function() {

           countDownDate =  new Date(mySchedule[i].check_in_date +" "+mySchedule[i].start_time).getTime();
           now = new Date(new Date().toLocaleString('en', {timeZone: myTimeZone})).getTime();
           distance = countDownDate - now;

          // Time calculations for days, hours, minutes and seconds
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          

          // Output the result in an element with id="demo"
          if(days<0||hours<0||minutes<0||seconds<0){}
          else{ 
            $("#days").text(days);
            $("#hours").text(hours);
            $("#minute").text(minutes);
            $("#second").text(seconds);
          }
          
          // If the count down is over, write some text 
          if (distance < 0) {

        
            if(mySchedule.length-1>dateIndex){
            //  dateIndex++;
             // countDownDate = new Date(data.data[i].schedule[dateIndex].check_in_date).getTime();
              
            }
            else{

              $("#days").text(00);
              $("#hours").text(00);
              $("#minute").text(00);
              $("#second").text(00);
              clearInterval(x);
            
            }
           
          }
        }, 1000)

          break
      }
    }
 }

/*

 const sendMessage=document.getElementById("sendMessage")
 const openCamera=document.getElementById("openCamera")
 const input=document.getElementById("myMessage")
 let imgSelected=null
 let videoSelected=null
 

 input.addEventListener('keydown', ()=>{

  smoothScroll(document.getElementById('modal-bodyID'))
  smoothScroll(document.getElementById('chatContainer'))
 });
 input.addEventListener('click', ()=>{

  smoothScroll(document.getElementById('modal-bodyID'))
  smoothScroll(document.getElementById('chatContainer'))
 });


 document.getElementById("sendMessage").addEventListener("click", ()=>{

    document.getElementById("myMessage").focus();
    let myMessage=document.getElementById("myMessage").value

    if(myMessage==""||myMessage==null){
      return
    }
    else{
      document.getElementById("myMessage").value=''
    let nodes=document.querySelectorAll(".chat-msg")
    let nodes2=document.querySelectorAll(".chat-msg .chat-msg-content")
    let srcUser = getUserProfilePic();

    if(nodes.length==0){
      $("#chat-area-main-id").append(
        ` <div class="chat-msg owner">
        <div class="chat-msg-profile">
          <img class="chat-msg-img" src="${srcUser}" alt="" />
          <div class="chat-msg-date">Message seen 1.22pm</div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">${myMessage}</div>
        </div>
      </div> `)
    }
    else{
      let classNames=nodes[nodes.length- 1].classList

      if(classNames[classNames.length-1]=="owner"){

        $($(".chat-msg .chat-msg-content")[nodes2.length- 1]).append(
          `<div class="chat-msg-text">${myMessage}</div>
          `
        )
      
      }
 
      else{

        $("#chat-area-main-id").append(
          ` <div class="chat-msg owner">
          <div class="chat-msg-profile">
            <img class="chat-msg-img" src="${srcUser}" alt="" />
            <div class="chat-msg-date">Message seen 1.22pm</div>
          </div>
          <div class="chat-msg-content">
            <div class="chat-msg-text">${myMessage}</div>
          </div>
        </div> `)
  
      }

    }
    }
    
    
    smoothScroll(document.getElementById('chatContainer'))
});

*/



function checkImg(e){

  $(document).ready(function(){
    $("#preUploadImage").modal('show');
  });
  document.getElementById("myPreUploadImage2").style.display="none"
  document.getElementById("myPreUploadImage").style.display="block"

  document.getElementById('myPreUploadImage').src = window.URL.createObjectURL(e.files[0])

}


function viewUploadedImage(e){

  imgSelected=e
  document.getElementById("viewUploadedImageTag").src=e.src

  $(document).ready(function(){
    $("#viewUploadedImage").modal('show');
  });
}


function deleteUploadedImage(){

  if(imgSelected){
    imgSelected.parentElement.remove();
    imgSelected=null
  }
}




function viewUploadedVideo(parent){

 
  let e= parent.querySelector('.video-fluid')

  videoSelected=e
  document.getElementById("viewUploadedVideoTag").src=e.src

  $(document).ready(function(){
    $("#viewUploadedVideo").modal('show');
  });
}


function deleteUploadedVideo(){

  if(videoSelected){
    videoSelected.parentElement.remove();
    videoSelected=null
  }
}

function postAttachment(){

  document.getElementById('circularMenu1').classList.remove('active');
  const attachment= document.getElementById("attachment");
  let src=''

  if(attachment.files[0]){
    src=window.URL.createObjectURL(attachment.files[0])
    document.getElementById('attachment').value= null;

  }else{
    src= document.getElementById('myPreUploadImage2').src
    document.getElementById('myPreUploadImage2').src=""
  }
 
  let srcUser = getUserProfilePic();
  let nodes=document.querySelectorAll(".chat-msg")
  let nodes2=document.querySelectorAll(".chat-msg .chat-msg-content")

  if(nodes.length==0){
    $("#chat-area-main-id").append(
      ` <div class="chat-msg owner">
      <div class="chat-msg-profile">
        <img class="chat-msg-img " src="${srcUser}" alt="" />
        <div class="chat-msg-date">Message seen 1.22pm</div>
      </div>
      <div class="chat-msg-content">
        <div class="chat-msg-text">
        <img src=${src}  onclick="viewUploadedImage(this)" />
        </div>
      </div>
    </div> `)
  }
  else{
    let classNames=nodes[nodes.length- 1].classList

    if(classNames[classNames.length-1]=="owner"){

      $($(".chat-msg .chat-msg-content")[nodes2.length- 1]).append(
        `<div class="chat-msg-text">
          <img src=${src}  onclick="viewUploadedImage(this)"/>
        </div>
        `
      )
    
    }
    else{

      $("#chat-area-main-id").append(
        ` <div class="chat-msg owner">
        <div class="chat-msg-profile">
          <img class="chat-msg-img " src="${srcUser}" alt="" />
          <div class="chat-msg-date">Message seen 1.22pm</div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">
            <img src=${src} onclick="viewUploadedImage(this)"/>
          </div>
        </div>
      </div> `)

    }



  }
  smoothScroll(document.getElementById('chatContainer'))
}


function postVideo(){


  let nodes=document.querySelectorAll(".chat-msg")
  let nodes2=document.querySelectorAll(".chat-msg .chat-msg-content")
  let srcUser = getUserProfilePic();
  const src= document.getElementById("preUploadVideoSource").src;
  //for upload
  //const src2= document.getElementById("preUploadVideoSource");
  //console.log(src2)
 


  if(nodes.length==0){
    $("#chat-area-main-id").append(
      ` <div class="chat-msg owner">
      <div class="chat-msg-profile">
        <img class="chat-msg-img " src="${srcUser}" alt="" />
        <div class="chat-msg-date">Message seen 1.22pm</div>
      </div>
      <div class="chat-msg-content">
        <div class="chat-msg-text">
          <div class="wrapper" onclick="viewUploadedVideo(this)">
            <video class="video-fluid"   src=${src}  style="height:200px; width: 100%;"  ></video>
            <div class="playpause"></div>
          </div>
        </div>
      </div>
    </div> `)

   uploadReport(src2,"VIDEO")
  }
  else{
    let classNames=nodes[nodes.length- 1].classList

    if(classNames[classNames.length-1]=="owner"){

      $($(".chat-msg .chat-msg-content")[nodes2.length- 1]).append(
        `<div class="chat-msg-text">
            <div class="wrapper" onclick="viewUploadedVideo(this)">
                <video class="video-fluid"   src=${src}  style="height:200px; width: 100%;" ></video>
            <div class="playpause"></div>
          </div>
        </div>
        `
      )
    
    }
    else{
      $("#chat-area-main-id").append(
        ` <div class="chat-msg owner">
        <div class="chat-msg-profile">
          <img class="chat-msg-img " src="${srcUser}" alt="" />
          <div class="chat-msg-date">Message seen 1.22pm</div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">
            <div class="wrapper" onclick="viewUploadedVideo(this)">
              <video class="video-fluid"   src=${src}  style="height:200px; width: 100%;" ></video>
              <div class="playpause"></div>
            </div>
          </div>
        </div>
      </div> `)

    }

    uploadReport(src,"VIDEO")
  }
  smoothScroll(document.getElementById('chatContainer'))


  
}


function postAudio(){


  document.getElementById('circularMenu1').classList.remove('active');
  const src= document.getElementById("audioPlay").src;
   
  let srcUser = getUserProfilePic();
  let nodes=document.querySelectorAll(".chat-msg")
  let nodes2=document.querySelectorAll(".chat-msg .chat-msg-content")

  if(nodes.length==0){
    $("#chat-area-main-id").append(
      ` <div class="chat-msg owner">
      <div class="chat-msg-profile">
        <img class="chat-msg-img " src="${srcUser}" alt="" />
        <div class="chat-msg-date">Message seen 1.22pm</div>
      </div>
      <div class="chat-msg-content">
        <div class="chat-msg-text">
          <audio controls style="max-width:190px;">
            <source src=${src} type="audio/mp3">
          </audio>
        </div>
      </div>
    </div> `)
  }
  else{
    let classNames=nodes[nodes.length- 1].classList

    if(classNames[classNames.length-1]=="owner"){

      $($(".chat-msg .chat-msg-content")[nodes2.length- 1]).append(
        `<div class="chat-msg-text">
            <audio controls style="max-width:190px;">
              <source src=${src} type="audio/mp3">
            </audio>
        </div>
        `
      )
    
    }
    else{

      $("#chat-area-main-id").append(
        ` <div class="chat-msg owner">
        <div class="chat-msg-profile">
          <img class="chat-msg-img " src="${srcUser}" alt="" />
          <div class="chat-msg-date">Message seen 1.22pm</div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">
            <audio controls style="max-width:190px;">
              <source src=${src} type="audio/mp3">
            </audio>
          </div>
        </div>
      </div> `)

    }

  }
  smoothScroll(document.getElementById('chatContainer'))
}





let reportForm=document.getElementById("reportForm")


reportForm.addEventListener("submit",(e)=>{
  e.preventDefault()

 
  const inputFile = document.getElementById("inputGroupFile02");
  const message = document.getElementById("message").value;



  if(inputFile.files.length==1){

    for (const file of inputFile.files) {
      uploadReport(file,"file",message)
      console.log("file")
    }
  }
  else{

    console.log("text")
    uploadReport("nofile","message",message)
  }


})





function uploadReport(data,dataType,text){



        $("#signInButton").css("display","none")
        $("#loadingButton").css("display","block")
        const formData=new FormData()

          if(dataType=="message"){
            formData.append("job_id",myActiveJob_id);
            formData.append("guard_id", myGuard_id);
            formData.append("report_type", "MESSAGE");
            formData.append("message", text);
            formData.append("is_emergency", false);
            formData.append("is_read",false);
            formData.append("who_has_it","GUARD");
            formData.append("file", "no file");

          }
          else{
            formData.append("file", data);
            formData.append("job_id", myActiveJob_id);
            formData.append("guard_id", myGuard_id);
            formData.append("report_type", "ATTACHMENT");
            formData.append("message", text);
            formData.append("is_emergency", false);
            formData.append("is_read",false);
            formData.append("who_has_it","GUARD");

          }

          
           fetch(`${domain}/api/v1/job/submitReportAttachment`, {
                method: 'POST', // or 'PUT'
                headers: {
                    "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
                },
                body:formData,
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                  
                      $("#signInButton").css("display","block")
                      $("#loadingButton").css("display","none")

                    if(data.status==200){
                      
                      showModalSuccess(data.message)

                      const inputFile = document.getElementById("inputGroupFile02");
                    
                      $('#message').val('')
                      inputFile.value = '';
                      inputFile.value = null
                      inputFile.type = "text";
                      inputFile.type = "file";
                        
                    }
                    else if(data.status=="conflict-error"){
                        console.log(data.message)
                        showModalError(data.message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                        $("#signInButton").css("display","block")
                      $("#loadingButton").css("display","none")
                    }
                    else if(data.status=="validation-error"){
                        console.log(data.errors.message)
                        showModalError(data.errors[0].message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                        $("#signInButton").css("display","block")
                      $("#loadingButton").css("display","none")
                    }
                    else if(data.status=="server-error"){
                        console.log(data.message)
                        showModalError(data.message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                        $("#signInButton").css("display","block")
                      $("#loadingButton").css("display","none")
                    }
                    else if(data.status=="bad-request-error"){
                        console.log(data.message)
                        showModalError(data.message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                        $("#signInButton").css("display","block")
                      $("#loadingButton").css("display","none")
                    }
                    else if(data.status=="notFound-error"){
                        console.log(data.message)
                        showModalError(data.message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                        $("#signInButton").css("display","block")
                      $("#loadingButton").css("display","none")
                    }

                })
                .catch((error) => {
                    console.error('Error:', error);
                })
}




let myAddNoteForm=document.getElementById("addNoteForm")

myAddNoteForm.addEventListener("submit",(e)=>{
  e.preventDefault()
  performSecurityCheck()
})

function  performSecurityCheck(){

  let note=$("#myNote").val()

  $.ajax({
    type: "post", url:`${domain}/api/v1/job/perform_security_check`,
    headers: {
        "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
    },
    dataType  : 'json',
    encode  : true,
    data: {
          job_id:myActiveJob_id,
          comment:note,
          guard_id:localStorage.myGuard_id,
      },
    success: function (data) {     

      Swal.fire({
        position: 'bottom',
        icon: 'success',
        title: 'You are in location',
        showConfirmButton: false,
        timer: 1500
      })
      $("#myNote").val()=''
      $('#add_note').modal('hide');

    },
    error: function (request, status, error) {

        console.log(request)

        let message=request.responseJSON.message
        if(request.responseJSON.status=="location-error"){
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


/*
    Reference 

    https://codepen.io/stevenfabre/pen/OJgoOp
*/
//})




