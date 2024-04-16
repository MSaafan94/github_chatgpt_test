odoo.define('website_portal.leave_portal', function (require) {
    "use strict";

    var rpc = require('web.rpc')
    var publicWidget = require('web.public.widget');
    var time = require('web.time');


    publicWidget.registry.EmpPortalTimeOff = publicWidget.Widget.extend({
        selector: '.new_timeoff_form',
        events: {
            'click .new_timeoff_confirm': '_onNewTimeOffConfirm',
            'click .edit_timeoff_confirm': '_onEditTimeOffConfirm',
        },

        //--------------------------------------------------------------------------
        // Private
        //--------------------------------------------------------------------------

        _buttonExec: function ($btn, callback) {
            // TODO remove once the automatic system which does this lands in master
            $btn.prop('disabled', true);
            return callback.call(this).guardedCatch(function () {
                $btn.prop('disabled', false);
            });
        },
        /**
         * @private
         * @returns {Promise}
         */
        _createTimeOff: function () {

            return this._rpc({
                model: 'hr.leave',
                method: 'create_timeoff_portal',
                args: [{
                    description: $('.new_timeoff_form .name').val(),
                    timeoff_type: $('.new_timeoff_form .holiday_status_id').val(),
                    from: this._parse_date($('.new_timeoff_form .request_date_from').val()),
                    to: this._parse_date($('.new_timeoff_form .request_date_to').val()),
                    half_day: $('.new_timeoff_form .request_unit_half').prop("checked"),
                    custom_hours: $('.new_timeoff_form .request_unit_hours').prop("checked"),
                    request_hour_from: $('.new_timeoff_form .request_hour_from').val(),
                    request_hour_to: $('.new_timeoff_form .request_hour_to').val(),
                    lesson_plan_link: $('.new_timeoff_form .lesson_plan_link').val(),
                    request_date_from_period: $('.new_timeoff_form .request_date_from_period').val(),
                    room_number: $('.new_timeoff_form .room_number').val(),
                    supervision_duties: $('.new_timeoff_form .supervision_duties').val(),
                    teaching_subject: $('.new_timeoff_form .teaching_subject').val(),
                    rotation_day: $('.new_timeoff_form .rotation_day').val(),
                    Teaching_block: $('.new_timeoff_form .Teaching_block').val(),
                    student_special_attention: $('.new_timeoff_form .student_special_attention').val(),
                    medical_issues: $('.new_timeoff_form .medical_issues').val(),
                    teaching_stuff_note: $('.new_timeoff_form .teaching_stuff_note').val(),
                    lesson_plan_file:  $('.new_timeoff_form .base64_file').val(),
                    sub_id: $('.new_timeoff_form .sub_id_select').val(),
                    attachment_1: $('.new_timeoff_form .base64_file1').val(),
                    file_name1: $('.new_timeoff_form .file_name1').val(),
                    attachment_2: $('.new_timeoff_form .base64_file2').val(),
                    file_name2: $('.new_timeoff_form .file_name2').val(),
                    attachment_3: $('.new_timeoff_form .base64_file3').val(),
                    file_name3: $('.new_timeoff_form .file_name3').val(),
                    attachment_4: $('.new_timeoff_form .base64_file4').val(),
                    file_name4: $('.new_timeoff_form .file_name4').val(),
                    attachment_5: $('.new_timeoff_form .base64_file5').val(),
                    file_name5: $('.new_timeoff_form .file_name5').val(),
                    attachment_6: $('.new_timeoff_form .base64_file6').val(),
                    file_name6: $('.new_timeoff_form .file_name6').val(),


                }],
            }).then(function (response) {
                if (response.errors) {
                    toastr.error('Something went wrong ' + response.errors + ' , try again.')
                    return Promise.reject(response);
                } else {
                    window.location = '/my/leave/' + response.id;
                }
            });
        },
        /**
         * @private
         * @returns {Promise}
         */
        _editTimeOffRequest: function () {
            
            return this._rpc({
                model: 'hr.leave',
                method: 'update_timeoff_portal',
                args: [[parseInt($('.edit_timeoff_form .timeoff_id').val())], {
                    timeoffID: parseInt($('.edit_timeoff_form .timeoff_id').val()),
                    description: $('.edit_timeoff_form .name').val(),
                    timeoff_type: $('.edit_timeoff_form .holiday_status_id').val(),
                    from: this._parse_date($('.edit_timeoff_form .request_date_from').val()),
                    to: this._parse_date($('.edit_timeoff_form .request_date_to').val()),
                    half_day: $('.edit_timeoff_form .request_unit_half').prop("checked"),
                    custom_hours: $('.edit_timeoff_form .request_unit_hours').prop("checked"),
                    request_hour_from: $('.edit_timeoff_form .request_hour_from').val(),
                    lesson_plan_link: $('.edit_timeoff_form .lesson_plan_link').val(),
                    request_hour_to: $('.edit_timeoff_form .request_hour_to').val(),
                    request_date_from_period: $('.edit_timeoff_form .request_date_from_period').val(),
                }],
            }).then(function (response) {
               
                                if (response.errors) {
                               
                    toastr.error('Something went wrong ' + response.errors + ' , try again.')
                    return Promise.reject(response);
                } else {
                   
                    window.location.reload();
                }
               
            });
        },

        //--------------------------------------------------------------------------
        // Handlers
        //--------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} ev
         */
        _onNewTimeOffConfirm: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            if ($("#leave_form").valid()) {
                this._buttonExec($(ev.currentTarget), this._createTimeOff);
            } else {
                toastr.warning('Please fill the mandatory fields.')
            }

        },
        /**
         * @private
         * @param {Event} ev
         */
        _onEditTimeOffConfirm: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            if ($("#leave_form").valid()) {
                this._buttonExec($(ev.currentTarget), this._editTimeOffRequest);
            } else {
                toastr.warning('Please fill the mandatory fields.')
            }            
            
        },

       update_file_to: function (ev) {
         var f = ev;
        var reader = new FileReader();
        var base64String ;
        reader.onload = (function(theFile) {
        return function(e) {
        var binaryData = e.target.result;
      //Converting Binary Data to base 64
         var base64String = window.btoa(binaryData);
      //showing file converted to base64
      document.getElementById('base64').value = base64String;
    };
  })(f);
  // Read in the image file as a data URL.
  reader.readAsBinaryString(f);
       },

        _parse_date: function (value) {
      console.log($('.new_timeoff_form .base64_file').val(),)

            var date = moment(value, "YYYY-MM-DD", true);
            if (date.isValid()) {
                return time.date_to_str(date.toDate());
            } else {
                return false;
            }
        },
    });

    $(document).ready(function(){
        var holidayStatusId = getHolidayStatusId();
        if (!holidayStatusId) {
            $(".half_day_option, .custom_hrs_option").hide();
        }
    });
    
    function getHolidayStatusId() {
        return $("#holiday_status_id").val();
    }

    $(document).ready(function () {

        /* Half Day Checkbox */
        function check_from_duration($this) {
            var $challenges_details = $('#from_period_div');
            var $challenges_input = $challenges_details.find('#select_from_period');
            if ($this.prop('checked')) {
                $challenges_details.show();
                $challenges_input.attr('required', 'required');
            } else {
                $challenges_details.hide();
                $challenges_input.removeAttr('required');
                $challenges_input.val('')
            }
        }

        $('#half_day_input_id').each(function () {
            check_from_duration($(this));
        });

        $(document).on("change", "#half_day_input_id", function () {
            $("#unit_hours_input_id").prop("checked", false);
            $('.custom_hour_divs').hide()
            $('.select_period_select').removeAttr('required');
            $('.select_period_select').val('')

            check_from_duration($(this));
        });

        /* Custom Hours Checkbox */
        function check_custom_hours($this) {
            var $challenges_details = $('.custom_hour_divs');
            var $challenges_input = $challenges_details.find('.select_period_select');
            if ($this.prop('checked')) {
                $challenges_details.show();
                $challenges_input.attr('required', 'required');
            } else {
                $challenges_details.hide();
                $challenges_input.removeAttr('required');
                $challenges_input.val('')
            }
        }

        $('#unit_hours_input_id').each(function () {
            check_custom_hours($(this));
        });

        $(document).on("change", "#unit_hours_input_id", function () {
            $("#half_day_input_id").prop("checked", false);
            $('#from_period_div').hide()
            $('#select_from_period').removeAttr('required');
            $('#select_from_period').val('')

            check_custom_hours($(this));
        });

        /* Time off Type selection */
        $(document).on("change", ".time_off_type_select", function () {
            var self = this
            rpc.query({
                model: 'hr.leave.type',
                method: 'search_read',
                args: [[['id', '=', $(this).val()]], ['id', 'request_unit']],
            }).then(function (rec) {
                if (rec && rec[0]) {
                    if (rec[0].request_unit == 'hour') {
                        $('.half_day_option').show()
                        $('.custom_hrs_option').show()
                    } else if (rec[0].request_unit == 'half_day') {
                        $('.half_day_option').show()
                        $('.custom_hrs_option').hide()
                    } else {
                        $('.half_day_option').hide()
                        $('.custom_hrs_option').hide()
                    }
                }

            })

        });
        $(document).on("change", ".maintenance_type_custom", function () {
            var self = this
            let type = $(this).val()
            if(type == "order"){
                $('.order_type').show()
                $('.repair_type').hide()
                
            }else{
                $('.order_type').hide()
                $('.repair_type').show() 
            }
            
        });
        $(document).on("submit", "#pd_form", function(event) {
              var hasValidQty = true; // Assume validity initially

              // Loop through all inputs with class "qty"
              $('.qty').each(function() {
                var qtyValue = parseInt($(this).val(), 10);
                // Check if the current input value is greater than zero
                if (qtyValue <= 0 || isNaN(qtyValue)) {
                  $(this).addClass('is-invalid')
                  hasValidQty = false; // Mark invalid quantity found
                  return false; // Exit the loop early if invalid
                }else{
                  $(this).removeClass('is-invalid')
                }
              });

              if (!hasValidQty) {
                event.preventDefault(); // Prevent form submission
              }
        });
        $(document).on("change", ".item_select", function (e) {
            console.log("item select")
            var xxx = e
            let other = false
            if (e.target.selectedOptions.length > 0){
                other = e.target.selectedOptions[0].dataset.other
            }
            if(other){
                e.target.parentNode.nextElementSibling.children[0].required = true
            }else{
                e.target.parentNode.nextElementSibling.children[0].required = false
            }
            
            e.target.parentNode.nextElementSibling.children[0].value = e.target.selectedOptions[0].dataset.desc

            // console.log(e.target.children(":selected"))
            // var self = this
            // let type = $(this).val()
            // if(type == "order"){
            //     $('.order_type').show()
            //     $('.repair_type').hide()
                
            // }else{
            //     $('.order_type').hide()
            //     $('.repair_type').show() 
            // }
            
        });
    });
})
;
