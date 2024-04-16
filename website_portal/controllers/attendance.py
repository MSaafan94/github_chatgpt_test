# -*- coding: utf-8 -*-

from odoo import http, _
from odoo.addons.portal.controllers.portal import CustomerPortal, pager as portal_pager
# from odoo.addons.payment.controllers.portal import PaymentProcessing
from odoo.exceptions import AccessError, MissingError
from odoo.addons.account.controllers.portal import PortalAccount
from odoo.http import content_disposition, dispatch_rpc, request, \
    serialize_exception as _serialize_exception, Response
from datetime import datetime, timedelta
from odoo.addons.portal.controllers.mail import _message_post_helper
from datetime import date
from collections import ChainMap
from pytz import timezone, utc
from time import gmtime, strftime
import calendar
import base64
import werkzeug
import werkzeug.exceptions
import werkzeug.utils
import werkzeug.wrappers
import werkzeug.wsgi
import json
from datetime import date

from odoo import models, fields, api, exceptions, _
from odoo.osv import osv


class PortalAccount(PortalAccount):
    @http.route(['/my/attendances'], type='http', auth="public", website=True)
    def portal_employee_attendance(self, **kw):
        employee = request.env['hr.employee'].sudo().search([('user_id', '=', request.uid)], limit=1)
        attendance = request.env['hr.attendance'].sudo().search([('employee_id', '=', employee[0].id)])
        import datetime
        attendance_final = []
        if attendance:
            for line in attendance:
                attendance_dic = {'employee_id': line.employee_id.name,
                                  'check_in': (line.check_in + timedelta(hours=2)) if line.check_in else line.check_in,
                                  'check_out': (line.check_out + timedelta(hours=2)) if line.check_out else line.check_out,
                                  'late': str(datetime.timedelta(hours=line.late)),
                                  'early': str(datetime.timedelta(hours=line.early)),
                                  'over_time': str(datetime.timedelta(hours=line.over_time)),
                                  'worked_hours': str(datetime.timedelta(hours=line.worked_hours)),
                                  }
                attendance_final.append(attendance_dic)
        return request.render("website_portal.website_employee_attendance", {'attendance': attendance_final or []})



    def prepare_error_msg(self, e):
        msg = ''
        if hasattr(e, 'name'):
            msg += e.name
        elif hasattr(e, 'msg'):
            msg += e.msg
        elif hasattr(e, 'args'):
            msg += e.args[0]
        return msg
