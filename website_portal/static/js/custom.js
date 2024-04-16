//This is the Range Date Picker
$(document).ready(function(){
    $("#multii").select2();

       var html = '<tr><td><select class="form-control" id="product-name"><option value="325">Floor Cleaner</option><option value="324">Pupa One Piece Paragon White -2</option></select></td><td>10</td><td></td><td></td><td><button class="btn btn-danger remove"><i class="fa fa-times" aria-hidden="true"></i></button></td></tr>'; 
    	$("#addProduct").click(function(){
    		var clone = $('#invoice > tbody tr:last').clone();
    clone.find('input').val('');
    clone.find('select').val('');
    clone.find('.qty').val(0);
            
    clone.insertAfter('#invoice > tbody tr:last');
    });
       
     $(document).on('click','.remove',function(){
         var lenRow = $('#invoice tbody tr').length;
         if (lenRow == 1 || lenRow <= 1) {
        alert("Can't remove all row!");
    } else {
       
        $(this).parents('tr').remove();
    }
    });

    $("#pd_product_id").on('change', function() {
        if ($(this).find(':selected').attr('pd') == 'True'){
        $("#pd_div").show()
        $("#pd_div select").attr('required','required')
        $("#pd_div select").addClass('is-invalid')
        }else{
          $("#pd_div").hide()
         $("#pd_div select").removeAttr('required')
         $("#pd_div select").removeClass('is-invalid')
         $("#pd_div select").val('')
        }

   });
});
$('#checkInDate').datepicker({

    dateFormat: 'dd/mm/yy',
    prevText: '<i class="fa fa-chevron-left"></i>',
    nextText: '<i class="fa fa-chevron-right"></i>',
    // onSelect: function(datePicked) {
    //
    //     $('#checkOutDate').datepicker('option', 'minDate', datePicked);
    // }
});

$('#checkOutDate').datepicker({
    dateFormat: 'dd/mm/yy',
    prevText: '<i class="fa fa-chevron-left"></i>',
    nextText: '<i class="fa fa-chevron-right"></i>',
    // onSelect: function(datePicked) {
    //
    //     $('#checkInDate').datepicker('option', 'maxDate', datePicked);
    //
    // }
});

// no react or anything
// let state = {};
//
// // state management
// function updateState(newState) {
// 	state = { ...state, ...newState };
// 	console.log(state);
// }

// event handlers
// $("input").change(function(e) {
// 	let files = $('#uploadddd')[0].files;
// 	let filesArr = Array.from(files);
// 	updateState({ files: files, filesArr: filesArr });
//
// 	renderFileList();
// });

// $(".files").on("click", "li > i", function(e) {
// 	let key = $(this)
// 		.parent()
// 		.attr("key");
// 	let curArr = state.filesArr;
// 	curArr.splice(key, 1);
// 	updateState({ filesArr: curArr });
// 	renderFileList();
// });

// $("#pd_form").on("submit", function(e) {
//            e.preventDefault();
//             e.stopPropagation();
//             alert("ddd")
//             if ($("#pd_form").valid()) {
//                 $("#pd_form").submit()
//             } else {
//                 toastr.warning('Please fill the mandatory fields.')
//             }
// });


// render functions
// function renderFileList() {
// 	let fileMap = state.filesArr.map((file, index) => {
// 		let suffix = "bytes";
// 		let size = file.size;
// 		if (size >= 1024 && size < 1024000) {
// 			suffix = "KB";
// 			size = Math.round(size / 1024 * 100) / 100;
// 		} else if (size >= 1024000) {
// 			suffix = "MB";
// 			size = Math.round(size / 1024000 * 100) / 100;
// 		}
// getBase64(file);
// 		return `<li key="${index}">${
// 			file.name
// 		} <span class="file-size">${size} ${suffix}</span></li>`;
// 	});
// 	$("#attached_files").html(fileMap);
// }
//
// function getBase64(file) {
//    var reader = new FileReader();
//    reader.readAsDataURL(file);
//    reader.onload = function () {
//      console.log(reader.result);
//    };
//    reader.onerror = function (error) {
//      console.log('Error: ', error);
//    };
// }








// var fileTypes = ['pdf', 'docx', 'rtf', 'jpg', 'jpeg', 'png', 'txt'];  //acceptable file types
// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var extension = input.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
//             isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
//
//         if (isSuccess) { //yes
//             var reader = new FileReader();
//             reader.onload = function (e) {
//                 if (extension == 'pdf') {
//                     $(input).closest('.fileUpload').find(".icon").attr('src', 'https://image.flaticon.com/icons/svg/179/179483.svg');
//                 } else if (extension == 'docx') {
//                     $(input).closest('.fileUpload').find(".icon").attr('src', 'https://image.flaticon.com/icons/svg/281/281760.svg');
//                 } else if (extension == 'rtf') {
//                     $(input).closest('.fileUpload').find(".icon").attr('src', 'https://image.flaticon.com/icons/svg/136/136539.svg');
//                 } else if (extension == 'png') {
//                     $(input).closest('.fileUpload').find(".icon").attr('src', 'https://image.flaticon.com/icons/svg/136/136523.svg');
//                 } else if (extension == 'jpg' || extension == 'jpeg') {
//                     $(input).closest('.fileUpload').find(".icon").attr('src', 'https://image.flaticon.com/icons/svg/136/136524.svg');
//                 } else if (extension == 'txt') {
//                     $(input).closest('.fileUpload').find(".icon").attr('src', 'https://image.flaticon.com/icons/svg/136/136538.svg');
//                 } else {
//                     //console.log('here=>'+$(input).closest('.uploadDoc').length);
//                     $(input).closest('.uploadDoc').find(".docErr").slideUp('slow');
//                 }
//             }
//
//             reader.readAsDataURL(input.files[0]);
//         } else {
//             //console.log('here=>'+$(input).closest('.uploadDoc').find(".docErr").length);
//             $(input).closest('.uploadDoc').find(".docErr").fadeIn();
//             setTimeout(function () {
//                 $('.docErr').fadeOut('slow');
//             }, 9000);
//         }
//     }
// }


// $(document).ready(function () {
//
//     $(document).on('change', '.up', function () {
//         var id = $(this).attr('id'); /* gets the filepath and filename from the input */
//         var profilePicValue = $(this).val();
//         var fileNameStart = profilePicValue.lastIndexOf('\\'); /* finds the end of the filepath */
//         profilePicValue = profilePicValue.substr(fileNameStart + 1).substring(0, 20); /* isolates the filename */
//         //var profilePicLabelText = $(".upl"); /* finds the label text */
//         if (profilePicValue != '') {
//             //console.log($(this).closest('.fileUpload').find('.upl').length);
//             $(this).closest('.fileUpload').find('.upl').html(profilePicValue); /* changes the label text */
//         }
//     });
//
//     $(".btn-new").on('click', function () {
//         $("#uploader").append('<div class="row uploadDoc"><div class="col-sm-3"><div class="docErr">Please upload valid file</div><!--error--><div class="fileUpload btn btn-orange"> <img src="https://image.flaticon.com/icons/svg/136/136549.svg" class="icon"><span class="upl" id="upload">Upload document</span><input type="file" class="upload up" id="up" onchange="readURL(this);" /></div></div><div class="col-sm-1"><a class="btn-check"><i class="fa fa-times"></i></a></div></div>');
//     });
//
//     $(document).on("click", "a.btn-check", function () {
//         if ($(".uploadDoc").length > 1) {
//             $(this).closest(".uploadDoc").remove();
//         } else {
//             alert("You have to upload at least one document.");
//         }
//     });
// });
$(function () {

    $('#pd_form,#reimbursement_form').validate({
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });

    $('#leave_form').validate({
        rules: {
            lesson_plan_link: {
              url: true
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
    
    $('[data-toggle="tooltip"]').tooltip({
        delay: {
            show: 50,
            hide: 300
        }
    });
})