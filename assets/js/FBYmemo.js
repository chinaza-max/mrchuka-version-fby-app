
let memoId
let getAllMemo

$(document).ready(function() {


    $('#loader1').css("display","block");

        getAllMemo=function(){ 
            $.ajax({
            type: "get", url: `${domain}/api/v1/job/allMemoDetailGuard?type=allMemo`,
            dataType  : 'json',
            encode  : true,
            headers: {
                "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
            },
            success: function (data) {
                $('#loader1').css("display","none");
                displayMemo(data.data)
            },
            error: function (request, status, error) {
                $('#loader1').css("display","none");

                analyzeError(request)
            }
            });
        }

        getAllMemo()
});



function  displayMemo(val){
 

    let data=''

  if(val.length!=0){
      
    for (let i = 0; i < val.length; i++) {


        data+= `
        <div class="col-12 col-md-6">
        <div class="card border-light">
          
          <div class="card-body">
                    ${val[i].message}

            <small>
            Sent on the ${val[i].send_date}
            </small>

            <button class="btn    btn-dark w-100" onclick="getReply( ${val[i].memo_receiver_id} )" data-bs-toggle="modal" data-bs-target="#replyContainer">View reply</button>

          </div>

        </div>
      </div>
        `
      
     
     
      if(i== val.length-1){
        $('#memoContainerView').children().remove();
        $("#memoContainerView").append(data)
      }
    }
  }
  else{
    $('#memoContainerView').children().remove();
    $("#memoContainerView").append(`
    <div class="alert alert-light outline text-dark" role="alert">
    YOU HAVE NO MEMO
   </div>`)
  }

}


function getReply(memo_receiver_id){
    $('#loader2').css("display","block");

    $.ajax({
        type: "get", url: `${domain}/api/v1/job/allMemoDetailGuard?type=repliedMessage&id=${memo_receiver_id}`,
        dataType  : 'json',
        encode  : true,
        headers: {
            "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
        },
        success: function (data) {
            $('#loader2').css("display","none");

            $('#replyContent').children().remove();
            $("#replyContent").append(`
                <p>${data.data.message}</p>
                <P class="text-muted">
                    Replied  on : ${data.data.date}
                </P>
            `)
        },
        error: function (request, status, error) {

            $('#loader2').css("display","none");
            analyzeError(request)
        }
        });
}