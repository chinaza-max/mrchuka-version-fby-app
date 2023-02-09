let formAdminReg=document.getElementById("contactForm")



formAdminReg.addEventListener("submit",(e)=>{
    e.preventDefault()
    $("#signInButton").css("display","none")
    $("#loadingButton").css("display","block")
    const form = e.target;
    const formFields = form.elements,
    email = formFields.email.value;

    console.log(email)
    $.ajax({
        type: "post", url:`${domain}/api/v1/auth/send-password-reset-link`,
        dataType    : 'json',
        encode      : true,
        data: {
            email,
        },
        success: function (data, text) {

            showModalSuccess(data.message)
            clearField()
            $("#signInButton").css("display","block")
            $("#loadingButton").css("display","none")

        },
        error: function (request, status, error) {
            alert(error);
            $("#signInButton").css("display","block")
            $("#loadingButton").css("display","none")
            console.log(request)
            analyzeError(request)
        }
      });
   
    function  clearField(){
        formFields.email.value=''
    }


})