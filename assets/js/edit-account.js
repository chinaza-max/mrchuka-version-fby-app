const password=document.getElementById("password")
const updateUser=document.getElementById("updateUser")

password.addEventListener("click" ,()=>{

    $.ajax({
        type: "post", url:`${domain}/api/v1/auth/send-password-reset-link`,
        dataType  : 'json',
          encode  : true,
        data: {
            email:userEmail,
        },
        success: function (data, text) {

            showModalEmailPasswordReset(data.message)
            setTimeout(() => {
                hideModalEmailPasswordReset()
            }, 3000);

        },
        error: function (request, status, error) {

            if(request.responseJSON.status=="conflict-error"){
                //console.log(request.responseJSON.message)
                showModalError(request.responseJSON.message)
                setTimeout(() => {
                    hideModalError()
                }, 3000);
            }
            else if(request.responseJSON.status=="validation-error"){
                //console.log(request.responseJSON.errors.message)
                showModalError(request.responseJSON.errors[0].message)
                setTimeout(() => {
                    hideModalError()
                }, 3000);
            }
            else if(request.responseJSON.status=="server-error"){
                //console.log(request.responseJSON.message)
                showModalError(request.responseJSON.message)
                setTimeout(() => {
                    hideModalError()
                }, 3000);
            }
            else if(request.responseJSON.status=="bad-request-error"){
              //console.log(request.responseJSON.message)
              showModalError(request.responseJSON.message)
              setTimeout(() => {
                  hideModalError()
              }, 3000);
              logUserOut()
          }
         
        }
      });
})

updateUser.addEventListener("submit",(e)=>{
    e.preventDefault()
    $("#signInButton").css("display","none")
    $("#loadingButton").css("display","block")


    const formData = new FormData()
    const inputFile = document.getElementById("profilePicturePath");

    const form = e.target;
    const formFields = form.elements,
    first_name = document.getElementById("firstName").value,
    last_name = document.getElementById("lastName").value,
    email = document.getElementById("email").value,
    gender = document.getElementById("gender").value,
    date_of_birth = document.getElementById("dataOfBirth").value,
    address = document.getElementById("address").value;
    phoneNumber = document.getElementById("phoneNumber").value;

    for (const file of inputFile.files) {
        formData.append("image", file);
        //console.log(file)
    }

    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("date_of_birth", date_of_birth);
    formData.append("gender", gender);
    formData.append("address",address);
    formData.append("phone_number",phoneNumber);

        for (const value of formData.values()) {
            //console.log(value);
        }


          fetch(`${domain}/api/v1/user/updateProfile`, {
                method: 'post',
                headers: {
                    "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
                },
                body: formData
                })
                .then((response) => response.json())
                .then((data) => {
                 //   console.log('Success:', data);

                    $("#signInButton").css("display","block")
                    $("#loadingButton").css("display","none")

                    if(data.status==200){
                        getProfileData()
                        showModalSuccess(data.message  )
                        setTimeout(() => {
                            hideModalSuccess()
                        }, 3000);
                    }
                    else if(data.status=="conflict-error"){
                        console.log(data.message)
                        showModalError(data.message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                    }
                    else if(data.status=="validation-error"){
                       // console.log(data.errors.message)
                        showModalError(data.errors[0].message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                    }
                    else if(data.status=="server-error"){
                       // console.log(data.message)
                        showModalError(data.message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                    }
                    else if(data.status=="bad-request-error"){
                     //   console.log(data.message)
                        showModalError(data.message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                    }
                    else if(data.status=="notFound-error"){
                      //  console.log(data.message)
                        showModalError(data.message)
                        setTimeout(() => {
                            hideModalError()
                        }, 3000);
                    }

                })
                .catch((error) => {
                    console.error('Error:', error);
                })


})


function showModalError(val){
    $("#userErrorContent").text(val);
    $("#userErrorContent").attr({
        "class" : "alert alert-danger outline  text-center"
      });

    $('#userError').modal('show');
}

function hideModalError(){
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


function showModalEmailPasswordReset(val){
    $("#PasswordResetInfoContent").text(val);
    $("#PasswordResetInfoContent").attr({
        "class" : "alert  alert-success  outline  text-center"
      });

    $('#PasswordResetInfo').modal('show');
}

function hideModalEmailPasswordReset(){
    $('#PasswordResetInfo').modal('hide');
}

function checkImg(e){
    document.getElementById('avatar2').src = window.URL.createObjectURL(e.files[0])
}




let getProfileData
let getLicense
let getAvailabilityStatus



$(document).ready(function(){

    //update user profile
    getProfileData=function(){
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
        
                $("#avatar").attr("src",data.data.user.image);
                $("#avatar2").attr("src",data.data.user.image);
                $("#firstName").val(data.data.user.first_name);
                $("#lastName").val(data.data.user.last_name);
                $("#email").val(data.data.user.email);
                $("#address").val(data.data.user.address);
                $("#dataOfBirth").val(data.data.user.date_of_birth);
                $("#phoneNumber").val(data.data.user.phone_number);
        
        
              // console.log(data.data.user.is_archived)
                if(data.data.user.is_archived==true){
                    $('select[name=status]').val("Available");
                    $('.selectpicker').selectpicker('refresh')
                }
                else{
                    
                    $('select[name=status]').val("notAvailable");
                    $('.selectpicker').selectpicker('refresh')
                
                }
                
                if(data.data.user.gender=="MALE"){
                    $('select[name=gender]').val("MALE");
                    $('.selectpicker').selectpicker('refresh')
                }
                else if(data.data.user.gender=="FEMALE"){
                  $('select[name=gender]').val("FEMALE");
                  $('.selectpicker').selectpicker('refresh')
                }
        
            },
            error: function (request, status, error) {
                //localStorage.removeItem("myUser");
                
              //  window.location.replace('https://sunny-kataifi-7adb6f.netlify.app/sign-in.html')
              //  window.location.replace('/sign-in.html')
            // window.location.href =window.location.toString().split('/')[0] + "/dist/sign-in.html"
            }
          });
    }

    getProfileData()

    getLicense=function(){
        $.ajax({
            type: "post", url:`${domain}/api/v1/user/LicenseRUD?type=read` ,
            dataType  : 'json',
            encode  : true,
            headers: {
                "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
            },
            data:{
                id:localStorage.myGuard_id,
            },
            success: function (data) {
            
                console.log(data)
                displayLicenseDetails(data.data)
            },
            error: function (request, status, error) {

              analyzeError(request)

            }
        });
    }
    getLicense()



    function getAvailabilityStatus(booleanValue){
        
        if(booleanValue){
            $('#availableContainer').children().remove();
            $("#availableContainer").append(`
            <div class="form-check form-switch">
            <input class="form-check-input mycheckButton" type="checkbox"  checked>
            <label class="form-check-label" for="flexSwitchCheckChecked">Available</label>
          </div>
            `)
        }
        else{
            $('#availableContainer').children().remove();
            $("#availableContainer").append(`
            <div class="form-check form-switch">
            <input class="form-check-input mycheckButton" type="checkbox" >
            <label class="form-check-label" for="flexSwitchCheckChecked">Unavailable </label>
          </div>
            `)
        }


        $('.mycheckButton').on('change', function(){ 
          
            $.ajax({
              type: "post", url:`${domain}/api/v1/user/toggleVisibilty?type=license`,
              headers: {
                  "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
              },
              data: {
              },
              success: function (data) {         
              
                getProfileData()
              },
              error: function (request, status, error) {
                  analyzeError(request)
              }
            })
            

      })
            
    }



    function getNotificationStatus(booleanValue){
        
      if(booleanValue){
          $('#notificationContainer').children().remove();
          $("#notificationContainer").append(`
          <div class="form-check form-switch">
          <input class="form-check-input mycheckButton2" type="checkbox"  checked>
          <label class="form-check-label" for="flexSwitchCheckChecked">On</label>
        </div>
          `)


        Notification.requestPermission().then(function(permission) {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
          } else {
            console.log('Notification permission denied.');
          }
        });


      }
      else{
          $('#notificationContainer').children().remove();
          $("#notificationContainer").append(`
          <div class="form-check form-switch">
          <input class="form-check-input mycheckButton2" type="checkbox" >
          <label class="form-check-label" for="flexSwitchCheckChecked">Off </label>
        </div>
          `)
      }


      $('.mycheckButton2').on('change', function(){ 
        
          $.ajax({
            type: "post", url:`${domain}/api/v1/user/toggleVisibilty?type=notification`,
            headers: {
                "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
            },
            data: {
            },
            success: function (data) {         
            
              getProfileData()
            },
            error: function (request, status, error) {
                analyzeError(request)
            }
          })
          

    })
          
  }


})

function displayLicenseDetails(val){

    let data=''

    if(val.length!=0){
        for (let index = 0; index < val.length; index++) {
                


          let path =String.raw`${val[index].url}`
          let path2 = path.replace(/\\/g, "/");
        
            if(val[index].status=="Expired"){

                data+=`
              <div class="accordion-item ">
              <h2 class="accordion-header accordion-Expired" id="flush-headingOne${index}">
              
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne${index}" aria-expanded="false" aria-controls="flush-collapseOne${index}">
                   #${index+1} Expiry date:${val[index].expiry_date}
                   
                </button>
              </h2>
              <div id="flush-collapseOne${index}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne${index}" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">

                  <table class="table table-bordered">
                    <thead>
                    <tr>
                      <th scope="col">Status</th>
                      <th scope="col">View</th>
                      <th scope="col">Delete</th>
                    </tr>
                    </thead>

                    <tbody id="licenseDetail">
                      <tr>
                        <td class="nowrap">
                          <span class="badge badge-danger">${val[index].status}</span> 
                        </td>
            
                        <td class="nowrap">
                          <button  onclick="attarchPDF('${path2}')" class="btn btn-outline-primary btn-square rounded-pill" fdprocessedid="4a7xi3" data-bs-toggle="modal"
                          data-bs-target="#view_license">
                            <span class="btn-icon icofont-file-alt"></span>
                          </button>
                        </td>
                        
                        <td>
                          <button onclick="deleteLicense(${val[index].license_id})"     class="btn btn-error btn-sm btn-square rounded-pill" fdprocessedid="9ditxn">
                            <span class="btn-icon icofont-ui-delete"></span>
                          </button>
                        </td>
                        
                      </tr>
                    </tbody>
                  </table>
                 
                </div>
              </div>
            </div>

                 `
            }
            else if(val[index].status=="Approved"){
                data+=`

               
              <div class="accordion-item">
              <h2 class="accordion-header" id="flush-headingOne${index}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne${index}" aria-expanded="false" aria-controls="flush-collapseOne${index}">
                <input class="form-check-input" type="checkbox" value="" id="defaultCheck4" disabled checked>
                #${index+1} Expiry date:${val[index].expiry_date}
                </button>
              </h2>
              <div id="flush-collapseOne${index}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne${index}" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">

                  <table class="table table-bordered">
                    <thead>
                    <tr>
                      <th scope="col">Status</th>
                      <th scope="col">View</th>
                      <th scope="col">Delete</th>
                    </tr>
                    </thead>

                    <tbody id="licenseDetail">
                      <tr>
                        <td class="nowrap">
                          <span class="badge badge-success">${val[index].status}</span> 
                        </td>
            
                        <td class="nowrap">
                          <button  onclick="attarchPDF('${path2}')" class="btn btn-outline-primary btn-square rounded-pill" fdprocessedid="4a7xi3" data-bs-toggle="modal"
                          data-bs-target="#view_license">
                            <span class="btn-icon icofont-file-alt"></span>
                          </button>
                        </td>
                        
                        <td>
                          <button onclick="deleteLicense(${val[index].license_id})"  class="btn btn-error btn-sm btn-square rounded-pill" fdprocessedid="9ditxn">
                            <span class="btn-icon icofont-ui-delete"></span>
                          </button>
                        </td>
                        
                      </tr>
                    </tbody>
                  </table>
                 
                </div>
              </div>
            </div>
                   `
            }
            else if(val[index].status=="Pending"){
                data+=`

              
                <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOne${index}">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne${index}" aria-expanded="false" aria-controls="flush-collapseOne${index}">
                     #${index+1} Expiry date:${val[index].expiry_date}
                  </button>
                </h2>
                <div id="flush-collapseOne${index}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne${index}" data-bs-parent="#accordionFlushExample">
                  <div class="accordion-body">
  
                    <table class="table table-bordered">
                      <thead>
                      <tr>
                        <th scope="col">Status</th>
                        <th scope="col">View</th>
                        <th scope="col">Delete</th>
                      </tr>
                      </thead>
  
                      <tbody id="licenseDetail">
                        <tr>
                          <td class="nowrap">
                            <span class="badge badge-info">${val[index].status}</span> 
                          </td>
              
                          <td class="nowrap">
                            <button  onclick="attarchPDF('${path2}')" class="btn btn-outline-primary btn-square rounded-pill" fdprocessedid="4a7xi3" data-bs-toggle="modal"
                            data-bs-target="#view_license">
                              <span class="btn-icon icofont-file-alt"></span>
                            </button>
                          </td>
                          
                          <td>
                            <button onclick="deleteLicense(${val[index].license_id})"  class="btn btn-error btn-sm btn-square rounded-pill" fdprocessedid="9ditxn">
                              <span class="btn-icon icofont-ui-delete"></span>
                            </button>
                          </td>
                          
                        </tr>
                      </tbody>
                    </table>
                   
                  </div>
                </div>
              </div>
  
                   `
            }



            if(index==val.length-1){

                $('#accordionFlushExample').children().remove();
                $("#accordionFlushExample").append(data)
            }
        }
    }
    else{

        data+=`
        <tr>
        <td  colspan="3" class="text-center">
            No license uploaded
        </td>
      </tr>
         `
         $('#accordionFlushExample').children().remove();
         $("#accordionFlushExample").append(data)
        
    }



}   


licenceFile.onchange = function() {

    if(this.files[0].size > 2097152){
        generalError("File is too big!")
       this.value = "";
    };
};


$("#formLicence").on("submit", (event) => {

    event.preventDefault();
    const formData=new FormData()
    const expiryDate = document.getElementById("expiryDate").value;
    const inputFile = document.getElementById("licenceFile");
    
     // console.log(expiryDate)


    for (const file of inputFile.files) {
        formData.append("file", file);
    }
    formData.append("expires_in", expiryDate);



    fetch(`${domain}/api/v1/user/uploadLicense`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
        },
        body:formData,
        })
        .then((response) => response.json())
        .then((data) => {


            $("#signInButton").css("display","block")
            $("#loadingButton").css("display","none")

            if(data.status==200){
                getProfileData()

                getLicense()
                showModalSuccess(data.message)
                setTimeout(() => {
                    getLicense()
                    hideModalSuccess()
                }, 3000);
            }
            else if(data.status=="conflict-error"){
                showModalError(data.message)
                setTimeout(() => {
                    hideModalError()
                }, 3000);
            }
            else if(data.status=="validation-error"){
                showModalError(data.errors[0].message)
                setTimeout(() => {
                    hideModalError()
                }, 3000);
            }
            else if(data.status=="server-error"){
               // console.log(data.message)
                showModalError(data.message)
                setTimeout(() => {
                    hideModalError()
                }, 3000);
            }
            else if(data.status=="bad-request-error"){
             //   console.log(data.message)
                showModalError(data.message)
                setTimeout(() => {
                    hideModalError()
                }, 3000);
            }
            else if(data.status=="notFound-error"){
              //  console.log(data.message)
                showModalError(data.message)
                setTimeout(() => {
                    hideModalError()
                }, 3000);
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        })

})


function attarchPDF(URL){

    // Get the canvas element
    var canvas = document.getElementById('pdf-canvas');

    // Load the PDF
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@latest/build/pdf.worker.min.js';
    pdfjsLib.getDocument(`${URL}`).promise.then(function(pdf) {
      // Get the first page of the PDF
      pdf.getPage(1).then(function(page) {
        // Get the viewport of the page
        var viewport = page.getViewport({ scale: 1 });

        // Set the canvas dimensions to match the viewport
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render the page on the canvas
        var renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
        page.render(renderContext);
      });
    });

}

function deleteLicense(id){


  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1c0d2e',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete it!'
  }).then((result) => {

    if(result.isConfirmed==true){
      $.ajax({
        type: "post", url:`${domain}/api/v1/user/LicenseRUD?type=delete` ,
        dataType  : 'json',
        encode  : true,
        headers: {
            "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
        },
        data:{
            id:id,
        },
        success: function (data) {
        
            console.log(data)
            showModalSuccess(data.message)
            getLicense()
        },
        error: function (request, status, error) {

            analyzeError(request)
        
        }
      });
    }
  })
}

