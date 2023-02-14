let mode="development"
let domain=''
let myGuard_id= atob(localStorage.getItem("guard_id"))  
let myActiveJob_id=localStorage.getItem("viewedJobID")
let viewedJobStatus=localStorage.getItem("JobStatus")
let alertLifeSpan =3500
let getMemo
let memo_receiver_id


if(mode=="development"){
    domain="http://localhost:3000"
}
else{
    domain='http://fbyteamschedule.com:3000'
    //domain='https://middleware.fbyteamschedule.com'
}

function setGuardId(val){
    const encodedData = btoa(val); // encode a string
    localStorage.setItem("guard_id", encodedData)
}


function updateJobStatus(val){
    localStorage.setItem("JobStatus",val)
}


function analyzeError(request){
    if(request.responseJSON) {
        if(request.responseJSON.status=="conflict-error"){
            console.log(request.responseJSON.message)
            showModalError(request.responseJSON.message)
            setTimeout(() => {
                hideModalError()
            }, alertLifeSpan);
        }
        else if(request.responseJSON.status=="validation-error"){
           
            showModalError(request.responseJSON.errors[0].message)
            setTimeout(() => {
                hideModalError()
            }, alertLifeSpan);
        }
        else if(request.responseJSON.status=="server-error"){
            console.log(request.responseJSON.message)
            showModalError(request.responseJSON.message)
            setTimeout(() => {
                hideModalError()
            }, alertLifeSpan);
        }
        else if(request.responseJSON.status=="bad-request-error"){
            console.log(request.responseJSON.message)
            showModalError(request.responseJSON.message)
            setTimeout(() => {
                hideModalError()
            }, alertLifeSpan);
          //  logUserOut()
        }
        else if(request.responseJSON.status=="notFound-error"){
            console.log(request.responseJSON.message)
            showModalError(request.responseJSON.message)
            setTimeout(() => {
                hideModalError()
            }, alertLifeSpan);
        }
    } else {
        showModalError("An unknown error was encountered!")
            setTimeout(() => {
                hideModalError()
            }, alertLifeSpan);
    }
}



function generalError(val){
    showModalError(val)

    setTimeout(() => {
        hideModalError()
    }, alertLifeSpan);
}

function showModalError(val){
    $("#userErrorContent").text(val);
    $("#userErrorContent").attr({
        "class" : "alert alert-danger outline  text-center"
      });

    $('#userError').modal('show');
}

function hideModalError(){

    console.log("called called called")
    $('#userError').modal('hide');
}

function showModalSuccess(val){
    $("#userSuccessContent").text(val);
    $("#userSuccessContent").attr({
        "class" : "alert alert-success outline  text-center"
      });
    $('#userSuccess').modal('show');

    setTimeout(() => {
       hideModalSuccess()
    }, alertLifeSpan);
}


function hideModalSuccess(){
    $('#userSuccess').modal('hide');
}


let userDeatils=''
let userEmail=''
if(localStorage.getItem("userDetails")!=null){

userDeatils=JSON.parse(atob(localStorage.getItem("userDetails")))
    userEmail=userDeatils.email
    $("#avatar").attr("src",userDeatils.image);

}


$(document).ready(function(){
    let value=localStorage.getItem("setRTopNavColor")
    if(value=="true"){
        setTimeout(() => {
            $("#topbar").click()
        }, 1000);
    }


    let value2=localStorage.getItem("setLeftNavColor")
    console.log(value2)
    if(value2=="true"){
        setTimeout(() => {
            $("#sidebar").click()
        }, 1000);
    }


    getMemo=()=>{
        $.ajax({
          type: "get", url:`${domain}/api/v1/job/allMemoDetailGuard?type=unAnsweredMemo`,
          dataType  : 'json',
          encode  : true,
          headers: {
          "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
          },
       
          success: function (data) {
  
            if(data.data.length!=0){
              showMemo=true
              $('#memoContainer').modal('show');
              $('#memoContent').children().remove();
              $("#memoContent").append(data.data.message)
              memo_receiver_id=data.data.memo_receiver_id
            }
           
          },
          error: function (request, status, error) {
           analyzeError(request)
          }
        })
  
    }
  
    let pathnames=["/sign-in.html"]
    if(!pathnames.includes(location.pathname)){
        getMemo()
    }


/*
    $.ajax({
        type: "get", url:`${domain}/api/v1/auth` + `?token=`+`Bearer ${atob(localStorage.getItem("myUser"))}`,
        dataType  : 'json',
        encode  : true,
        headers: {
            "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
        },
        success: function (data) {
        

            console.log(data)
            getAvailabilityStatus(data.data.user.availability)
            getNotificationStatus(data.data.user.notification)
            localStorage.setItem('userDetails', btoa(JSON.stringify(data.data.user)));
    
        },
        error: function (request, status, error) {
            //localStorage.removeItem("myUser");
            
          //  window.location.replace('https://sunny-kataifi-7adb6f.netlify.app/sign-in.html')
          //  window.location.replace('/sign-in.html')
        // window.location.href =window.location.toString().split('/')[0] + "/dist/sign-in.html"
        }
      });

*/


})


let checkbox=document.querySelector("#topbar")

if(checkbox){
    checkbox.addEventListener('change', function() {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
            localStorage.setItem("setRTopNavColor",true)
            console.log("is checked ")
    
    
            } else {
                console.log("is checked ")
    
            localStorage.setItem("setRTopNavColor",false)
            }
        });
      });
}


let checkbox2=document.querySelector("#sidebar")

if(checkbox2){
    checkbox2.addEventListener('change', function() {
        checkbox2.addEventListener('change', function() {
            if (this.checked) {
            localStorage.setItem("setLeftNavColor",true)
            console.log("is checked ")
    
            } else {
    
           console.log("not checked ")
            localStorage.setItem("setLeftNavColor",false)
    
            }
        });
    
      });
}




function clickSubmitButton(){
    document.getElementById("submitJob").click()
  }
  
let submitReply=document.getElementById("submitReply")||null


if(submitReply){
    submitReply.addEventListener("submit",(e)=>{
        e.preventDefault()
      
          let message=$("#response").val()
        
          $.ajax({
            type: "post", url: `${domain}/api/v1/job/reply_memo`,
            dataType  : 'json',
              encode  : true,
            data: {
              message,
              memo_receiver_id,
            },
            headers: {
              "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
            },
            success: function (data) {
      
              showMemo=false
              $('#memoContainer').modal('hide');
      
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Replied succefully',
                showConfirmButton: false,
                timer: 1500
              })
        
            },
            error: function (request, status, error) {
      
              analyzeError(request)
            }
          });
      
      })
}




