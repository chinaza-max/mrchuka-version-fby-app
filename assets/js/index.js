let pendingJobCount=0
let activejobCount=0
let completedjobCount=0
let showMemo=false
let canRedirectToJOb=sessionStorage.getItem("redirectToJOb")||"true"

let totalHours=0
let amountPending=0


let getPendingJob
let getDashBoardInfo


  getPendingJob=function(){
        
                  $.ajax({
                    type: "get", url: `${domain}/api/v1/job/myjobs?jobType=PENDING&token=`+`Bearer ${atob(localStorage.getItem("myUser"))}`,
                    dataType  : 'json',
                     encode  : true,
                    headers: {
                        "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
                    },
                    success: function (data) {
                      console.log(data)
                      $("#pendingJobLoader").css("display", "none");
                      $("#pendingJob").empty();
                        if(data.data && data.data.length > 0 ){
                            for(let i=0; i<data.data.length;i++){
                                $("#pendingJob").append(
                                  `<div class="col-12 col-md-6">
                                  <div class="card bg-light">
                    
                                    <div class="row">
                                      <div class="col-7">
                                        <div class="card-body">
                                          <div class="text-nowrap">
                                            <strong>${data.data[i].facility_name}</strong>
                                          </div>
                                          <div class="text-muted text-nowrap">${data.data[i].job_type}</div>
                                        </div>
                                      </div>
                                      <div class="col-5">
                                        <div class="card-body">
                                          <div class="text-nowrap text-end">$ ${data.data[i].guard_charge}</div>
                                          <div class="text-muted text-nowrap text-end"> ${data.data[i].schedule[0].check_in_date}</div>
                                        </div>
                                      </div>

                                      
                                      <div class="col-12">
                                        <div class="card-body">
                                          <button class="btn btn-outline-primary mt-3" data-bs-toggle="modal" data-bs-target="#modalPending_${data.data[i].job_id}">View</button>
                                          <button type="button" class="btn btn-primary mt-3" onclick="acceptDecline(${data.data[i].job_id},true)">Accept</button>
                                          <button type="button" class="btn btn-secondary mt-3" style="background-color:rgb(221, 51, 51)" onclick="acceptDecline( ${data.data[i].job_id},false)">Decline </button>
                                        </div>
                                      </div>
                                    </div>
                                  
                                  </div>
                                </div>`);

                                $("#modalContainer").append(
                                  ` <div class="modal fade" id="modalPending_${data.data[i].job_id}" tabindex="-1" role="dialog" aria-hidden="true">
                                  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                    <div class="modal-content">
                                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                        <i class="icofont-close-line"></i>
                                      </button>
                        
                                      <div class="modal-header">
                                        <h5 class="modal-title">Job detail</h5>
                                      </div>
                                      <div class="modal-body">
                                        <main class="main-content mb-0">
                                          <div class="app-loader"><i class="icofont-spinner-alt-4 rotate"></i></div>
                                    
                                          <div class="main-content-wrap">
                                            
                                            <header class="page-header" style="clear: right;">
                                              <h1 class="page-title"  style="clear: both;">${data.data[i].facility_name}</h1>
                                            </header>
                                            
                                            <div class="page-content">
                                    
                                    
                                              <!-- START PROJECT LOCATION -->
                                              <figure>
                                                <figcaption class="blockquote-footer">
                                                  <div class="card mb-md-0">
                                                    <div class="card-body">
                                                  
                                                      <div class="row align-items-center">
                                                        <div class="col col-auto">
                                                          <div class="icon icofont-location-pin fs-30 text-muted"></div>
                                                        </div>
                                                        <div class="col">
                                                          <div>Job Address</div>
                                                          ${data.data[i].address}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </figcaption>
                                              </figure>
                                    
                                              <hr>
                                              <!-- END PROJECT LOCATION -->
                                    
                                              <div class="card mb-0">
                                                <div class="card-header">
                                                  Job reward
                                                </div>
                                                <div class="card-body">
                                                  <div class="table-responsive">
                                                    <table class="table table-bordered">
                                                      <thead>
                                                      <tr>
                                                        <th scope="col">Potential Payout</th>
                                                        <th scope="col">Per</th>
                                                      </tr>
                                                      </thead>
                                                      <tbody>
                                                    
                                                      <tr>
                                                        <td>$ ${data.data[i].guard_charge}</td>
                                                        <td>Hour</td>
                                                      </tr>
                        
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                </div>
                                              </div>
                        
                        
                                              <!-- START JOB SCHEDULE -->
                                              <div class="card">
                                                <div class="card-header">
                                                    Job schedule
                                                </div>
                                                <div class="card-body">
                                                  <div class="table-responsive">
                                                    <table class="table table-bordered table-sm">
                                                      <thead>
                                                      <tr>
                                                        <th scope="col" class="text-nowrap">Start Date</th>
                                                        <th scope="col" class="text-nowrap">Start Time</th>
                                                        <th scope="col" class="text-nowrap">End Date</th>
                                                        <th scope="col" class="text-nowrap">End Time</th>
                                                      </tr>
                                                      </thead>
                                                      
                                                      <tbody id="pendingscheduleTable${data.data[i].job_id}">
                                                        
                                                      </tbody>
                                                    
                                                    </table>
                                                  </div>
                                                  
                                                </div>
                                                
                                                <div class="card-body">
                                                  <div class="alert alert-light outline text-dark" role="alert">
                                                    Job type:<strong> ${data.data[i].job_type}</strong>
                                                  </div>
                                                  
                                                </div>
                        
                                              </div>
                                              <!-- END JOB SCHEDULE -->
                                    
                                              <!-- END PROJECT EVENT -->
                                    
                        
                                    
                                            </div>
                                  
                                          </div>
                                        </main>
                                    
                                      </div>
                                      <div class="modal-footer">
                                        <div class="actions">
                                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                          <button type="button" class="btn btn-primary" onclick="acceptDecline( ${data.data[i].job_id},true)" >Accept </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>`);
                        
                            }
                    
                            //this loop handles schedules for above jobs
                            for(let i=0; i<data.data.length;i++){
                    

                              $(`#pendingscheduleTable${data.data[i].job_id}`).empty();

                                for(let j=0; j<data.data[i].schedule.length;j++){

                                  $(`#pendingscheduleTable${data.data[i].job_id}`).append(
                                      ` 
                                      <tr>
                                          <td class="text-nowrap"> ${data.data[i].schedule[j].check_in_date}</td>
                                          <td class="text-nowrap">${data.data[i].schedule[j].start_time}</td>
                                          <td class="text-nowrap"> ${data.data[i].schedule[j].check_out_date}</td>
                                          <td class="text-nowrap">${data.data[i].schedule[j].end_time}</td>
                                      </tr>
                                      `
                                  );
                              
                              }
                            
                            }
                        }  

                        if(data.data && data.data.length==0){
                          $("#pendingJob").append(`
                          <div class="alert alert-warning outline" pendingJobAlert role="alert">
                            NO PEDNIING JOB
                          </div>
                          `)
                        }
                    },
                    error: function (request, status, error) {
                        alert("Oops!\nUnable to complete  request: "+error);
                        //localStorage.removeItem("myUser");
                        //window.location.replace('https://sunny-kataifi-7adb6f.netlify.app/sign-in.html')
                        //window.location.replace('/sign-in.html')
                        //window.location.href =window.location.toString().split('/')[0] +"/sign-in.html"

                    }
                  });
                }

  
  function acceptDecline(id,val){

    if(val==false){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1c0d2e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Decline it!'
      }).then((result) => {
  
        if(result.isConfirmed==true){
          $.ajax({
            type: "post", url: `${domain}/api/v1/job/accept-decline-job`,
            dataType  : 'json',
            encode  : true,
            data: {
              job_id:id,
              accept:val
            },
            headers: {
              "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
            },
            success: function (data) {
              if (data.status==200) {
                Swal.fire(
                  'Declined!',
                  'success'
                )
                getDashBoardInfo();
                getPendingJob()
              }
            },
            error: function (request, status, error) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: `${ $(JSON.parse(request.responseText).message)}`
              })
            }
          });
        }
       
      })

    }else{

      $.ajax({
        type: "post", url: `${domain}/api/v1/job/accept-decline-job`,
        dataType  : 'json',
          encode  : true,
        data: {
          job_id:id,
          accept:val
        },
        headers: {
          "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
        },
        success: function (data, text) {

          if (data.status==200) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your job has been activated',
              showConfirmButton: false,
              timer: 1500
            })
            getPendingJob()
          }

        },
        error: function (request, status, error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            confirmButtonColor: '#1c0d2e',
            footer: `${ $(JSON.parse(request.responseText).message)}`
          })
        }
      });
    }
        
  }
  
function calPayPerSchedule(money ,hour){
  totalHours+=Number(hour)
  amountPending+= Number(money.slice(1))*Number(hour)
 
  console.log(totalHours ,amountPending)
  calPayOff(totalHours ,amountPending)
} 
 
function calPayOff(val ,val2){   
  document.getElementById("earnings").innerHTML ="$"+val2.toFixed(2)
}

$(document).ready(function() {


    if(localStorage.getItem("myUser")) {
      getDashBoardInfo=function(){ 
          $.ajax({
          type: "get", url: `${domain}/api/v1/job/getDashBoardInfoGuard?token=`+`Bearer ${atob(localStorage.getItem("myUser"))}`,
          dataType  : 'json',
          encode  : true,
          headers: {
              "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
          },
          success: function (data, text) {
              console.log(data)
              if(data.data) {
                  $("#pendingJobCount").text(data.data.pending);
                  $("#activeJobCount").text(data.data.active);
                  $("#completedJobCount").text(data.data.completed);
              }
              $("#pendingJobAlert").css("display", "none");
          },
          error: function (request, status, error) {
              alert("Oops!\nUnable to complete your request: "+error);
          }
          });
      }

      getDashBoardInfo();
      getPendingJob();
      $.ajax({
          type: "post", url:`${domain}/api/v1/job/allJobs/shiftPerGuardAllJob?token=`+`Bearer ${atob(localStorage.getItem("myUser"))}`,
          dataType  : 'json',
          encode  : true,
          headers: {
          "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
          },
          data: {
              guard_id: localStorage.myGuard_id
          },
          success: function (data) {
              if(data.data) {
                  for(let i=0;i <data.data.length;i++){                  
                      if(data.data[i].settlement_status==false){
                          calPayPerSchedule(data.data[i]["guard_charge"],data.data[i]["hours_worked"])
                      }
                  }
              }
          },
          error: function (request, status, error) {
            analyzeError(request)
          }
      });




      getActiveJob=function(){
        
        $.ajax({
          type: "get", url: `${domain}/api/v1/job/myjobs?jobType=ACTIVE` + `&token=`+`Bearer ${atob(localStorage.getItem("myUser"))}`,
          dataType  : 'json',
          encode  : true,
          headers: {
              "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
          },
          success: function (data) {
    
            console.log(data)
            console.log(canRedirectToJOb)

            if(data.data.length!=0&&canRedirectToJOb=="true"){
              setJobDetail(data.data[0].job_id) 
              window.location.href =  "jobDetails.html"
              sessionStorage.setItem('redirectToJOb',"false")
            }

          },
          error: function (request, status, error) {
              alert("Oops!\nUnable to complete your request: "+error);
    
          }
        });
      }
      getActiveJob()

    }

});




function setJobDetail(val){
  localStorage.setItem("viewedJobID",val)
}