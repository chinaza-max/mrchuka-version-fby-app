var minDate, maxDate
var customerName='';
var Site='';
var staffName='';
var test="Software Engineer";

let totalHours=0
let amountPending=0

let initiallze=true
let dateSearch=true
let userSearch=true


// Custom filtering function which will search data in column four between two values

$.fn.dataTable.ext.search.push(

  
    function( settings, data, dataIndex ) {

        if(dateSearch==true){
  
          var min = minDate.val();
          var max = maxDate.val();
          var date = new Date( data[4] );
          var date2 = new Date( data[5] );
            
          if (
              ( min === null && max === null ) ||
              ( min === null &&  moment(date).isSameOrBefore(max)) ||
              ( moment(min).isSameOrBefore(date)  && max === null ) ||
              ( moment(min).isSameOrBefore(date)   && moment(date).isSameOrBefore(max) )
  
              ||( min === null &&   moment(date2).isSameOrBefore(max)   )||
              ( moment(min).isSameOrBefore(date2)   && max === null ) ||
              ( moment(min).isSameOrBefore(date2)   &&     moment(date2).isSameOrBefore(max) )
          ) {
  
          
            if(data[16]=="false"&&!initiallze){
            //  calPayPerSchedule(data[10] ,data[12])
            }       
              return true;
          }
          return false;
        }
        else if(dateSearch=="none"){
        
          return true
        }
        else{


            var customerNameVT = data[0];
            var SiteVT = data[3] ;
            
    
            if ((customerName ==='')&&(Site ==='' )) {
                
                return true;
            }
            else if((customerName===customerNameVT)&&(Site==='')){
      
                
                return true
            }
            else if((customerName===customerNameVT)&&(Site===SiteVT)){
        
                return true
            }
            else if((customerName==='')&&(Site===SiteVT)){

                return true
            }
            else if((customerName==='')&&(Site===SiteVT)){
                

                return true
            }
            else if((customerName==='')&&(Site==='')){
                

                return true
            }
            else if((customerName===customerNameVT)&&(Site==='')){
                

                return true
            }
            else if((customerName===customerNameVT)&&(Site===SiteVT)){
     
                return true
            }

            return false;
          
        }

      }

)


function calPayPerSchedule(money ,hour){



 totalHours+=Number(hour)
 amountPending+= Number(money.slice(1))*Number(hour)


 console.log(totalHours ,amountPending)


 calPayOff(totalHours ,amountPending)
 
} 

 
$(document).ready(function() {
    // Create date inputs
    minDate = new DateTime($('#min'), {
        format: 'MMMM Do YYYY'
    });
    maxDate = new DateTime($('#max'), {
        format: 'MMMM Do YYYY'
    });


    var table = $('#example').DataTable({
        ajax: {
            url: `${domain}/api/v1/job/allJobs/shiftPerGuardAllJob`,
            method: "post",
            headers: {
              "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
          },
          data: {
            guard_id:localStorage.myGuard_id,
          },
          } ,
          columns:[
            { data: "customer" },
            { data: "first_name" },
            { data: "last_name" },
            { data: "site" },
            { data: "start_date" },
            { data: "start_time" },
            { data: "end_date" },
            { data: "end_time" },
            { data: "hours" },
            { data: "check_in" },
            { data: "check_out" },
            { data: "hours_worked"},
            { data: "guard_charge" },
            { data: "client_charge" },
            { data: "guard_id" },
            { data: "earned"},
            { data: "settlement_status"},
            ]
            ,
            select: true,
            dom: 'Bfrtip',
            buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5',
            'print'
            ],
        responsive: true,
            createdRow: function (row, data, index) {

                if (data["settlement_status"] == "empty") {
                    $('td', row).css('background-color','#B5BCB5');
                    $('td', row).css('color', 'white');

                }
                else if(data["settlement_status"] == false){
                    $('td', row).css('background-color', '#F43939');
                    $('td', row).css('color', 'white');
                }
                else if(data["settlement_status"] == true){
                    $('td', row).css('background-color', '#39F447');
                    $('td', row).css('color', 'white');
                }
            },
            rowCallback: function( row, data, index ) {

              if(data["settlement_status"]==false){
                calPayPerSchedule(data["guard_charge"],data["hours_worked"])
            }
              
          },
          order:[[2, 'dsc']]

   
    })
    table.on( 'search.dt', function () {
      initializePayOff()

    } );




    table
        .on('order', function () {

           // console.log("order order order order order order")
        })
        .on('search', function () {
         // console.log("search search search search search ")

        })
        .on('page', function () {
          initializePayOff()
        })
    //table.row(0).select();

    $('a.toggle-vis').on('click', function (e) {
        e.preventDefault();
        var column = table.column($(this).attr('data-column'));
        // Toggle the visibility
        column.visible(!column.visible());        
    });
     
    setTimeout(() => {

    var column1 = table.column(1);
    column1.visible(!column1.visible());
    var column2 = table.column(2);
    column2.visible(!column2.visible());
    var column3 = table.column(13);
    column3.visible(!column3.visible());
    
    var column4 = table.column(14);
    column4.visible(!column4.visible());
     
    }, 1000);
    
   
    // Refilter the table
    $('#min, #max').on('change', function () {
       // initializePayOff()
        dateSearch=true
        userSearch=false
        table.draw();
        //initiallze=false
       
    });
  
    $('#Site').on('change', function (e) {
        //initializePayOff()
       // initiallze=false
        Site=this.value
        dateSearch=false
        userSearch=true
        table.draw();
    });
    $('#customerName').on('change', function (e) {
        //initializePayOff()
        //initiallze=false
        customerName=this.value
        dateSearch=false
        userSearch=true
        table.draw();
    });
    
    
});


function initializePayOff(){
    totalHours=0
    amountPending=0
    calPayOff(totalHours ,amountPending)
}


function calPayOff(val1, val2){
    
    document.getElementById("totalHours").innerHTML =val1
    document.getElementById("amountPending").innerHTML ="$"+Number(val2).toFixed(2)
}


//GET CUSTOMER AND DISPLAY
  $.ajax({
    type: "get", url:`${domain}/api/v1/customer` + `?token=`+`Bearer ${atob(localStorage.getItem("myUser"))}`,
    dataType  : 'json',
          encode  : true,
    headers: {
        "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
    },
  
    success: function (data, text) {
        displayCustomer(data.data)
    },
    error: function (request, status, error) {
  
        console.log(request)
        analyzeError(request)
    }
  });
  function displayCustomer(val){
    let data=`<option value="">--Select--</option>`
  
    for(let i=0; i<val.length; i++){
            data+= `
            <option value="${val[i].full_name}"> ${val[i].full_name} </option>
          `
        if(i==val.length-1){
  
            $('#customerName').children().remove();
            $("#customerName").append(data)
            $('.selectpickerCustomer').selectpicker('refresh')
        }
    }
    if(val.length==0){
      $('#customerName').children().remove();
      $("#customerName").append(data)
      $('.selectpickerCustomer').selectpicker('refresh')
    }
  }



  

  
//GET SITE AND DISPLAY
$.ajax({
  type: "get", url:`${domain}/api/v1/job/getAllSite` + `?token=`+`Bearer ${atob(localStorage.getItem("myUser"))}`,
  dataType  : 'json',
          encode  : true,
  headers: {
      "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
  },

  success: function (data) {
      displayGetAllSite(data.data)
  },
  error: function (request, status, error) {

      analyzeError(request)
   
  }
});
function displayGetAllSite(val){
  let data=`<option value="">--Select--</option>`

  for(let i=0; i<val.length; i++){
          data+= `
          <option value="${val[i].name}"> ${val[i].name} </option>
        `
      if(i==val.length-1){

          $('#Site').children().remove();
          $("#Site").append(data)
          $('.selectpickerSite').selectpicker('refresh')

      }
  }
  if(val.length==0){
    $('#Site').children().remove();
    $("#Site").append(data)
    $('.selectpickerSite').selectpicker('refresh')
  }
}

















