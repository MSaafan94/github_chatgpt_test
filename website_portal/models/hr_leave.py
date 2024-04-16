# See LICENSE file for full copyright and licensing details.

import random
from odoo import api, fields, models, _
from datetime import datetime, date, timedelta, time
from pytz import timezone, UTC
import pytz
from odoo.tools import float_compare
from odoo.tools.float_utils import float_round
from odoo.tools import DEFAULT_SERVER_DATE_FORMAT as DF
import base64
from odoo.exceptions import UserError, AccessDenied

class EmpPortalPd(models.Model):
    _inherit = "res.users"
    my_employee_ids = fields.Many2many('hr.employee')
class EmpPortalPd(models.Model):
    _inherit = "pd.request"

    def attachment_format(self, res_id, attach):
        filename = None
        if attach:
            filename = attach.filename
            attachment = attach
            attachment = attachment.read()
            Attachments = self.env['ir.attachment']
            attachment_id = Attachments.create({
                'name': filename,
                'type': 'binary',
                'datas': base64.b64encode(attachment),
                'res_model': 'res.documents',
                'res_id': res_id,
            })
            return attachment_id

    @api.model
    def create_pd_portal(self, values):
        if not (self.env.user.employee_id):
            raise AccessDenied()
        user = self.env.user
        self = self.sudo()
        # try:
        attachment = values['files']
        values = {

            'employee_id': self.env.user.employee_id.id,
            'date_from': values['from'],
            'date_to': values['to'],
            'grade_level': values['grade'],
            'pd_activity': values['pd_activity'],
            'location_institution': values['location'],
            'additional_cost': values['add_cost'],
            'cost': values['cost'],
            'knowledge_description': values['knowledge'],
            'quality_description': values['quality'],
            'brief_explanation': values['brief'],

        }
        pd = self.env['pd.request'].sudo().create(values)

        attachment_id = self.attachment_format(pd.id, attachment)
        if attachment_id:
            pd.update({
                'attachment_ids': [(4, attachment_id.id)],
            })
        return {
            'id': pd.id
        }
        # except:
        #     return "error"


class EmpPortalTimeOff(models.Model):
    _inherit = "hr.leave"

    def get_attachment(self,attach,file_name1,res_id):
        file_name = file_name1
        if not file_name.lower().endswith(('.png', '.jpg', '.jpeg', 'pdf')):
            raise UserError('Allowed Attachment Format PDF, PNG, JPG, JPEG or PDF')
        if attach:
            # filename = attach.filename
            # attachment = attach
            # attachment = attachment.read()
            Attachments = self.env['ir.attachment']
            attachment_id = Attachments.create({
                'name': file_name,
                'type': 'binary',
                'datas': attach,
                'res_model': 'hr.leave',
                'res_id': res_id,
            })
            return attachment_id
    def update_timeoff_portal(self, values):
        dt_from = values['from']
        dt_to = values['to']
        if dt_from:
            dt_from = datetime.strptime(dt_from, DF).date()
        if dt_to:
            dt_to = datetime.strptime(dt_to, DF).date()
        date_from_time_str = str(dt_from) + ' ' + values['request_hour_from']
        date_to_time_str = str(dt_to) + ' ' + values['request_hour_to']
        date_from = False
        date_to = False
        if values['request_hour_to'] and values['request_hour_from']:
            date_from = datetime.strptime(date_from_time_str, "%Y-%m-%d %H:%M") - timedelta(hours=2)
            date_to = datetime.strptime(date_to_time_str, "%Y-%m-%d %H:%M") - timedelta(hours=2)
        for timeoff in self:
            timeoff_values = {
                'name': values['description'],
                'holiday_status_id': int(values['timeoff_type']),
                'request_date_from': dt_from,
                'request_date_to': dt_to,
                'request_unit_half': values['half_day'],
                'request_unit_hours': values['custom_hours'],
                'request_hour_from': date_from,
                'request_hour_to': date_to,
                'lesson_plan_link': values['lesson_plan_link'],
                'request_date_from_period': values['request_date_from_period'],
            }
            if values['timeoffID']:
                timeoff_rec = self.env['hr.leave'].sudo().browse(values['timeoffID'])
                if timeoff_rec:
                    timeoff_rec.sudo().write(timeoff_values)
                    timeoff_rec._onchange_request_parameters()
        return True

    @api.model
    def create_timeoff_portal(self, values):
        if not (self.env.user.employee_id):
            raise AccessDenied()
        user = self.env.user
        self = self.sudo()
        # if not (values['description'] and values['timeoff_type'] and values['from'] and values['to']):
        #     return {
        #         'errors': _('All fields are required !')
        #     }
        date_from = False
        date_to = False
        date_from_time_str = str(values['from']) + ' ' + values['request_hour_from']
        date_to_time_str = str(values['to']) + ' ' + values['request_hour_to']
        if values['request_hour_to'] and values['request_hour_from']:
            date_from = datetime.strptime(date_from_time_str, "%Y-%m-%d %H:%M") - timedelta(hours=2)
            date_to = datetime.strptime(date_to_time_str, "%Y-%m-%d %H:%M") - timedelta(hours=2)

        subs_id = []
        if 'sub_id' in values:
            for sub in values['sub_id']:
                subs_id.append(int(sub))
        if 'attachment_1' in values:
            attachment_1 = values['attachment_1']
            file_name1 = values['file_name1']
        else:
            attachment_1 =''
            file_name1 =''

        if 'attachment_2' in values:
            attachment_2 = values['attachment_2']
            file_name2 = values['file_name2']

        else:
            attachment_2 =''
            file_name2 =''


        if 'attachment_3' in values:
            attachment_3 = values['attachment_3']
            file_name3 = values['file_name3']

        else:
            attachment_3 =''
            file_name3 =''


        if 'attachment_4' in values:
            attachment_4 = values['attachment_4']
            file_name4 = values['file_name4']

        else:
            attachment_4 =''
            file_name4 =''


        if 'attachment_5' in values:
            attachment_5 = values['attachment_5']
            file_name5 = values['file_name5']
        else:
            attachment_5 =''
            file_name5 =''


        if 'attachment_6' in values:
            attachment_6 = values['attachment_6']
            file_name6 = values['file_name6']
        else:
            attachment_6 =''
            file_name6 =''

        values = {
            'name': values['description'],
            'holiday_status_id': int(values['timeoff_type']),
            'request_date_from': values['from'],
            'request_date_to': values['to'],
            'request_unit_half': values['half_day'],
            'request_unit_hours': values['custom_hours'],
            'request_hour_from': date_from,
            'request_hour_to': date_to,
            'room_number': values['room_number'] if 'room_number' in values else False,
            'supervision_duties': values['supervision_duties'] if 'supervision_duties' in values else False,
            'teaching_subject': values['teaching_subject'] if 'teaching_subject' in values else False,
            'rotation_day': values['rotation_day'] if 'rotation_day' in values else False,
            'Teaching_block': values['Teaching_block'] if 'Teaching_block' in values else False,
            'lesson_plan_file': values['lesson_plan_file'] if 'lesson_plan_file' in values else False,
            'student_special_attention': values['student_special_attention'] if 'student_special_attention' in values else False,
            'medical_issues': values['medical_issues'] if 'medical_issues' in values else False,
            'teaching_stuff_note': values['teaching_stuff_note'] if 'teaching_stuff_note' in values else False,
            'lesson_plan_link': values['lesson_plan_link'] if 'lesson_plan_link' in values else False,
            'request_date_from_period': values['request_date_from_period'] if 'request_date_from_period' in values else False,
            'sub_id': [(6, 0, subs_id)],
        }
        tmp_leave = self.env['hr.leave'].sudo().new(values)
        tmp_leave._onchange_request_parameters()
        values = tmp_leave._convert_to_write(tmp_leave._cache)
        mytimeoff = self.env['hr.leave'].sudo().create(values)
        if attachment_1:
            attachment_id = self.get_attachment(attachment_1,file_name1,mytimeoff.id)
        if attachment_2:
            attachment_id = self.get_attachment(attachment_2,file_name2,mytimeoff.id)

        if attachment_3:
            attachment_id = self.get_attachment(attachment_3,file_name3,mytimeoff.id)

        if attachment_4:
            attachment_id = self.get_attachment(attachment_4,file_name4,mytimeoff.id)

        if attachment_5:
            attachment_id = self.get_attachment(attachment_5,file_name5,mytimeoff.id)

        if attachment_6:
            attachment_id = self.get_attachment(attachment_6,file_name6,mytimeoff.id)


        return {
            'id': mytimeoff.id
        }


# class EmployeePublic(models.Model):
#     _inherit = 'hr.employee.public'
#
#     attendance_rule = fields.Char()
#     emp_contract_type_id = fields.Many2one(comodel_name='hr.employee.contract.type',
#                                            string="Contract Type",
#                                            )
