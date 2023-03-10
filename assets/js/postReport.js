

$(document).ready(function() {

       
        $.ajax({
          type: "post", url: `${domain}/api/v1/job/getSingleReportGuard`,
          dataType  : 'json',
          encode  : true,
          headers: {
              "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
          },
          data: {
            job_id:myActiveJob_id,
            guard_id:myGuard_id
          },
          success: function (data) {
  
            console.log(data)

           displayReport(data)
  
          },
          error: function (request, status, error) {
              localStorage.removeItem("myUser");
              //window.location.replace('https://sunny-kataifi-7adb6f.netlify.app/sign-in.html')
              //window.location.replace('/sign-in.html')
              window.location.href =window.location.toString().split('/')[0] + "/sign-in.html"
  
          }
        })
   
    
});
  








function displayReport(data){


    let data2=''
    for(let i=0;i <data.data.length;i++){
        

      let path =String.raw`${data.data[i].file_url}`
      let path2 = path.replace(/\\/g, "/");


        if(data.data[i].report_type=="MESSAGE"){
            data2+=`
            <div class="alert alert-dark outline mb-2" role="alert">
                ${data.data[i].message}
                <div><strong>Occured at</strong> : ${data.data[i].reference_date	}</div>

                <div class="row text-end">
                <span>${data.data[i].report_type}</span>
                <span>${data.data[i].created_at}</span>
                </div>
            </div>
            `
        }
        
        else if(data.data[i].mime_type=="image/jpeg"||data.data[i].mime_type=="image/png"){
            data2+=`
            <div class="alert alert-dark outline mb-2" role="alert">
              ${data.data[i].message}
              <div><strong>Occured at</strong> : ${data.data[i].reference_date	}</div>

              <div class="d-flex justify-content-between mt-2">
                <button type="button" class="btn btn-info mt-1" onclick="viewImage('${path2}')" >View</button>
                  <div class="row text-end">
                    <span>file</span>
                    <span>${data.data[i].created_at}</span>
                  </div>
              </div> 
            </div>
            `
        }
        else if(data.data[i].mime_type=="video/mp4"){
            data2+=`
            <div class="alert alert-dark outline mb-2" role="alert">
              ${data.data[i].message}
              <div>  
              
              <strong>Occured at</strong> : ${data.data[i].reference_date	}</div>

              <div class="d-flex justify-content-between mt-2">
                <button type="button" class="btn btn-info mt-1" onclick="viewVideo('${path2}')" >View</button>
                  <div class="row text-end">
                    <span >video</span>
                    <span>${data.data[i].created_at}</span>
                  </div>
              </div> 
            </div>
            `
        }


        if(i==data.data.length-1){
            $('#myReport').children().remove();
            $("#myReport").append(data2)
        }
    }
    

    if(data.data.length==0){
        $('#myReport').children().remove();
        $("#myReport").append(` <div class="alert alert-primary outline" role="alert">
        NO REPORT 
      </div>`)
    }
}












function viewImage(url){

    document.getElementById("myViewImage").src=url
    $('#viewImage').modal('show');
}

function viewVideo(url){

    document.getElementById("viewUploadedVideoTag").src=url
    $('#viewUploadedVideo').modal('show')

}