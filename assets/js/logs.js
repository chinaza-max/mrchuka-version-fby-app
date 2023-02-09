var minDate, maxDate
var customerName='';
var Site='';
 




$(document).ready(function() {


    function getLog(guard_id ,job_id){


        console.log(guard_id ,job_id)
        var table = $('#example').DataTable({
            ajax: {
                url: `${domain}/api/v1/job/allJobs/logPerGuard`,
                method: "post",
                headers: {
                    "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
                },
                data: {
                    guard_id,
                    job_id    
                },
              } ,
              columns:[
                { data: "check_in_date" },
                { data: "check_in_time" },
                { data: "check_out_date" },
                { data: "check_out_time" },
                { data: "guard_id" },
                { data: "hours" },
                { data: "job_id" },
                { data: "lat"},
                { data: "location_message" },
                { data: "log"},
                { data: "log_id"},
               
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
                order:[[ 3, 'dsc']]
                ,
            rowReorder: {
                selector: 'td:nth-child(2)'
            },
            responsive: true
            
         
       
        })
        setTimeout(() => {

            var column1 = table.column(4);
            column1.visible(!column1.visible());

            var column2 = table.column(6);
            column2.visible(!column2.visible());

            var column3 = table.column(7);
            column3.visible(!column3.visible());

            var column4= table.column(9);
            column4.visible(!column4.visible());

            var column5= table.column(10);
            column5.visible(!column5.visible());
         
            
        }, 1000);

        minDate = new DateTime($('#min'), {
            format: 'MMMM Do YYYY'
        });
        maxDate = new DateTime($('#max'), {
            format: 'MMMM Do YYYY'
        });


    }

    getLog(myGuard_id ,myActiveJob_id)
 
});

