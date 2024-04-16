# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
from datetime import datetime, timedelta

from odoo import http
from odoo.exceptions import AccessError, MissingError, UserError, AccessDenied

from odoo.http import request
from odoo.tools.translate import _
from odoo.addons.portal.controllers.portal import pager as portal_pager, CustomerPortal
from odoo.addons.portal.controllers.mail import _message_post_helper
from odoo.osv.expression import OR
import werkzeug
import base64
from dateutil.relativedelta import relativedelta
from io import StringIO, BytesIO

from werkzeug.utils import redirect


class PRPortal(CustomerPortal):
    @http.route(['/my/maintenance_request', '/my/maintenance_request/page/<int:page>'], type='http', auth="user",
                website=True)
    def my_ment(self, page=1, date_begin=None, date_end=None, sortby=None, search=None, search_in='content',
                approval=False, *args,
                **kw):
        values = self._prepare_portal_layout_values()
        domain = []

        searchbar_sortings = {
            'date': {'label': _('Newest'), 'order': 'create_date desc'},
            'name': {'label': _('Name'), 'order': 'pd_activity'},
        }
        searchbar_inputs = {
            'pd': {'input': 'pd_activity', 'label': _('Search <span class="nolabel"> (in PD)</span>')},
            'id': {'input': 'id', 'label': _('Search ID')},
            'all': {'input': 'all', 'label': _('Search in All')},
        }
        emp = request.env['hr.employee'].sudo().search([('user_id', '=', request.env.user.id)],
                                                       limit=1)
        is_super_user = request.env.user.has_group('maintenance_custom.maintenance_super_user')

        if not approval:
            if not is_super_user:
                domain.append(('employee_id', '=', emp.id))
        else:
            states = []
            if request.env.user.has_group('maintenance_custom.can_submit_maintenance_request'):
                states.append('submited')
            if request.env.user.has_group('maintenance_custom.can_dm_maintenance_request'):
                states.append('dm_to_approve')
            if request.env.user.has_group('maintenance_custom.can_om_maintenance_request'):
                states.append('om_to_approve')
            if request.env.user.has_group('maintenance_custom.can_mm_maintenance_request'):
                states.append('mm_to_approve')
            domain += [('employee_id', 'in', request.env.user.my_employee_ids.ids), ('state', 'in', states)]

        # default sort by value
        if not sortby:
            sortby = 'date'
        order = searchbar_sortings[sortby]['order']

        # archive groups - Default Group By 'create_date'
        # archive_groups = self._get_archive_groups('helpdesk.ticket', domain) if values.get('my_details') else []
        if date_begin and date_end:
            domain += [('create_date', '>', date_begin), ('create_date', '<=', date_end)]

        # search
        if search and search_in:
            search_domain = []
            if search_in in ('id', 'all'):
                search_domain = OR([search_domain, [('id', 'ilike', search)]])
            if search_in in ('pd_activity', 'all'):
                search_domain = OR([search_domain, [('pd_activity', 'ilike', search)]])
            if search_in in ('customer', 'all'):
                search_domain = OR([search_domain, [('partner_id', 'ilike', search)]])
            if search_in in ('message', 'all'):
                search_domain = OR([search_domain, [('message_ids.body', 'ilike', search)]])
            domain += search_domain

        # pager
        pd_count = request.env['maintenance.request'].sudo().search_count(domain)
        pager = portal_pager(
            url="/my/purchase_request",
            url_args={'date_begin': date_begin, 'date_end': date_end, 'sortby': sortby},
            total=pd_count,
            page=page,
            step=self._items_per_page
        )
        ments = request.env['maintenance.request'].sudo().search(domain, order=order, limit=self._items_per_page,
                                                          offset=pager['offset'])
        request.session['my_ment_history'] = ments.ids[:100]

        values.update({
            'date': date_begin,
            'ments': ments,
            'page_name': 'ment_request',
            'default_url': '/my/maintenance_request',
            'pager': pager,
            # 'archive_groups': archive_groups,
            'searchbar_sortings': searchbar_sortings,
            'searchbar_inputs': searchbar_inputs,
            'sortby': sortby,
            'search_in': search_in,
            'search': search,
            'approval': approval
        })

        return request.render("website_portal.portal_ment", values)

    @http.route(['''/my/maintenance_request/<model('maintenance.request'):ment>'''], type='http', auth="user",
                website=True)
    def portal_my_mr(self, ment, **kw):
        user = request.env.user
        emp = request.env['hr.employee'].sudo().search([('user_id', '=', user.id)], limit=1)
        attachment_obj = http.request.env['ir.attachment']
        attachment_ids = attachment_obj.sudo().search([('res_model', '=', 'maintenance.request'),
                                                       ('res_id', '=', ment.id)])

        return request.render(
            "website_portal.portal_maint_review", {
                'ment': ment,
                'attachment_ids': attachment_ids,
                'page_name': 'my_pr',
                'emp_id': emp and emp.id or False,
            })

    @http.route(['''/my/maintenance_request/confirm/<model('maintenance.request'):ment>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_maintenance_request_confirm(self, ment, **kw):
        ment.sudo().confirm()
        return werkzeug.utils.redirect('/my/maintenance_request')

    @http.route(['''/my/maintenance_request/edit/<model('maintenance.request'):ment>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_maintenance_request_edit(self, ment, **kw):
        selection_maint_value = dict(ment._fields['maintenance_type_custom'].selection)
        selection_schedule_date_value = dict(ment._fields['maintenance_type_portal'].selection)
        selection_priority_value = dict(ment._fields['priority'].selection)
        attachment_obj = http.request.env['ir.attachment']
        attachment_ids = attachment_obj.sudo().search([('res_model', '=', 'maintenance.request'),
                                                       ('res_id', '=', ment.id)])

        return request.render(
            "website_portal.portal_maint_edit", {
                'ment': ment,
                'selection_maint_value': [('Repair Order','repair'),('Work Order','order')] if ment.maintenance_type_custom == 'repair' else [('Work Order','order'),('Repair Order','repair')],
                'selection_schedule_date_value': list(selection_schedule_date_value.items()),
                'selection_priority_value': list(selection_priority_value.items()),
            'order_types': request.env['maintenance.request.order.type'].sudo().search([]),
            'repair_types': request.env['maintenance.request.repair.type'].sudo().search([]),
                'attachment_ids': attachment_ids,
            })

    @http.route(['''/my/maintenance_request/edit/<model('maintenance.request'):ment>'''], type='http',
                methods=['POST'], auth="user",
                website=True,
                csrf=False)
    def portal_my_maintenance_request_update(self, ment, **kw):
        attachment_list = request.httprequest.files.getlist('attachment')

        for attachment in attachment_list:
            file_name = attachment.filename
            print(file_name.lower())
            if file_name and not file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.pdf')):
                raise UserError('Allowed Attachment Format PDF, PNG, JPG, JPEG')
            if attachment.filename:
                attachments = {
                    'res_name': attachment.filename,
                    'res_model': 'maintenance.request',
                    'res_id': ment.id,
                    'datas': base64.encodebytes(attachment.read()),
                    'type': 'binary',
                    'name': attachment.filename,
                }
                attachment_obj = http.request.env['ir.attachment']
                attachment_obj.sudo().create(attachments)
        ment.sudo().write({'location': kw.get('location'),
                           'maintenance_type_portal': kw.get('schedule_date'),
                           'maintenance_type_custom': kw.get('maintenance_type_custom'),
                           'priority': kw.get('priority'),
                           'description' :  kw.get('description'),
                           'order_type_id' :  int(kw.get('order_type_id',False)) if kw.get('order_type_id',False) else False,
                           'repair_type_id' :  int(kw.get('repair_type_id',False)) if kw.get('repair_type_id',False) else False,
                           
                           })
        mr_link = "/my/maintenance_request/%s" % (ment.id)
        return werkzeug.utils.redirect(mr_link)

    @http.route(
        ['''/attachment/delete/<model('ir.attachment'):attachment_id>/<model('maintenance.request'):ment>'''],
        type='http', methods=['GET'], auth="user",
        website=True, csrf=False
    )
    def delete_attachment_maint(self, attachment_id, ment, **kw):
        if attachment_id:
            attachment_id.sudo().unlink()
            return werkzeug.utils.redirect(f'/my/maintenance_request/edit/{ment.id}')
        else:
            return request.not_found()

    @http.route(['''/my/maintenance_request/delete/<model('maintenance.request'):ment>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_maintenance_request_delete(self, pd, **kw):
        pd.sudo().unlink()
        return werkzeug.utils.redirect('/my/maintenance_request')

    @http.route(['/my/maintenance_request_insert_view'], type='http', auth="user",
                website=True)
    def my_mn(self, **kw):
        values = self._prepare_portal_layout_values()
        values.update({
            'order_types': request.env['maintenance.request.order.type'].sudo().search([]),
            'repair_types': request.env['maintenance.request.repair.type'].sudo().search([]),
            'employee_name': http.request.env.user.employee_id.name,
            'employee_room_number': http.request.env.user.employee_id.employee_room.name,

        })

        return request.render("website_portal.maintenance_request_submit", values)

    @http.route(['''/my/maintenance_request/confirm/<model('maintenance.request'):pd>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_ment_confirm(self, pd, **kw):
        pd.sudo().confirm()
        return werkzeug.utils.redirect('/my/maintenance_request')

    @http.route(['''/my/maintenance_request/submit/<model('maintenance.request'):pd>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_ment_submit(self, pd, **kw):
        pd.sudo().submit()
        return werkzeug.utils.redirect('/my/maintenance_request?approval=1')

    @http.route(['''/my/maintenance_request/dm/<model('maintenance.request'):pd>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_ment_dm_approval(self, pd, **kw):
        pd.sudo().dm_approval()
        return werkzeug.utils.redirect('/my/maintenance_request?approval=1')

    @http.route(['''/my/maintenance_request/mm/<model('maintenance.request'):pd>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_ment_mm_approval(self, pd, **kw):
        pd.sudo().mm_approval()
        return werkzeug.utils.redirect('/my/maintenance_request?approval=1')

    @http.route(['''/my/maintenance_request/om/<model('maintenance.request'):pd>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_ment_om_approval(self, pd, **kw):
        pd.sudo().om_approval()
        return werkzeug.utils.redirect('/my/maintenance_request?approval=1')

    @http.route(['''/my/maintenance_request/delete/<model('maintenance.request'):pd>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_delete(self, pd, **kw):
        pd.sudo().unlink()
        return werkzeug.utils.redirect('/my/maintenance_request')

    @http.route(['/maintenance/insert'], type='http', auth="public", methods=['POST'], website=True)
    def mn_submitted(self, **kw):
        description = kw['name']
        location = kw['location']
        maintenance_type_custom = kw['maintenance_type_custom']
        maintenance_type_portal = kw['schedule_date']
        priority = kw['priority']
        repair_type_id = kw.get('repair_type_id', False)
        order_type_id = kw.get('order_type_id', False)
        if 'attachment' in request.params:
            del kw['attachment']
        attachment_list = request.httprequest.files.getlist('attachment')
        ment = http.request.env['maintenance.request'].sudo().create({
            'description': description,
            'location': location,
            'maintenance_type_custom': maintenance_type_custom,
            'maintenance_type_portal': maintenance_type_portal,
            'priority': priority,
            'repair_type_id': repair_type_id,
            'order_type_id': order_type_id,
            'employee_id': http.request.env.user.employee_id.id,
        })
        # raise UserError(kw.get('attachment')))
        for attachment in attachment_list:
            file_name = attachment.filename
            print(file_name.lower())
            if file_name and not file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.pdf')):
                raise UserError('Allowed Attachment Format PDF, PNG, JPG, JPEG')
            attachments = {
                'res_name': attachment.filename,
                'res_model': 'maintenance.request',
                'res_id': ment.id,
                'datas': base64.encodebytes(attachment.read()),
                'type': 'binary',
                'name': attachment.filename,
            }
            attachment_obj = http.request.env['ir.attachment']
            attachment_obj.sudo().create(attachments)
        # return request.render(
        #     "website_portal.portal_maint_success")
        mr_link = "/my/maintenance_request/%s" % (ment.id)
        return werkzeug.utils.redirect(mr_link)
