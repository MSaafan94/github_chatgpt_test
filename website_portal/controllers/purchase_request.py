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

    @http.route(['/my/purchase_request', '/my/purchase_request/page/<int:page>'], type='http', auth="user",
                website=True)
    def my_pr(self, page=1, date_begin=None, date_end=None, sortby=None, search=None, search_in='content', *args,
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
        domain.append(('employee_id', '=', emp.id))
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
        pd_count = request.env['material.purchase.requisition'].sudo().search_count(domain)
        pager = portal_pager(
            url="/my/purchase_request",
            url_args={'date_begin': date_begin, 'date_end': date_end, 'sortby': sortby},
            total=pd_count,
            page=page,
            step=self._items_per_page
        )
        pds = request.env['material.purchase.requisition'].search(domain, order=order, limit=self._items_per_page,
                                                                  offset=pager['offset'])
        request.session['my_pd_history'] = pds.ids[:100]

        values.update({
            'date': date_begin,
            'pds': pds,
            'page_name': 'pr_request',
            'default_url': '/my/purchase_request',
            'pager': pager,
            # 'archive_groups': archive_groups,
            'searchbar_sortings': searchbar_sortings,
            'searchbar_inputs': searchbar_inputs,
            'sortby': sortby,
            'search_in': search_in,
            'search': search,
        })

        return request.render("website_portal.portal_pr", values)

    @http.route('/my/purchase_request/submit', type='http', auth="public", website=True)
    def website_pr_form(self, **kwargs):
        vendors = http.request.env['res.partner'].sudo().search(
            [('supplier_rank', '>', 0)])
        products = http.request.env['product.product'].sudo().search(
            [('purchase_ok', '=', True),('detailed_type','!=','service'),('is_educational','=',False),'|',('is_portal_item','=',True),('is_other','=',True)],order = "is_other desc,name asc")
        currencies = http.request.env['res.currency'].sudo().search([])
        return request.render("website_portal.pr_submit",
                              {'products': products, 'currencies': currencies, 'vendors': vendors,
                               'page_name': 'pr_request_new'})

    @http.route(['''/my/purchase_request/<model('material.purchase.requisition'):pr>'''], type='http', auth="user",
                website=True)
    def portal_my_pr(self, pr, **kw):
        user = request.env.user
        emp = request.env['hr.employee'].sudo().search([('user_id', '=', user.id)], limit=1)
        attachment_obj = http.request.env['ir.attachment']
        attachment_ids = attachment_obj.sudo().search([('res_model', '=', 'material.purchase.requisition'),
                                                       ('res_id', '=', pr.id)])

        return request.render(
            "website_portal.portal_my_pr", {
                'pr': pr,
                'attachment_ids': attachment_ids,
                'page_name': 'my_pr',
                'emp_id': emp and emp.id or False
            })

    @http.route(
        ['''/attachment/delete/<model('ir.attachment'):attachment_id>/<model('material.purchase.requisition'):pr>'''],
        type='http', methods=['GET'], auth="user",
        website=True, csrf=False
        )
    def delete_attachment(self, attachment_id, pr, **kw):        
        if attachment_id:
            attachment_id.sudo().unlink()
            return werkzeug.utils.redirect(f'/my/purchase_request/edit/{pr.id}')
        else:
            return request.not_found()

    @http.route(['''/my/purchase_request/<model('material.purchase.requisition'):pr>'''], type='http', methods=['GET'],
                auth="user",
                website=True,
                csrf=False)
    def portal_my_purchase_request_delete(self, pd, **kw):
        pd.sudo().unlink()
        return werkzeug.utils.redirect('/my/purchase_request')

    @http.route(['/attachment/download'], type='http', auth='public')
    def download_attachment(self, attachment_id):
        attachment = request.env['ir.attachment'].sudo().search_read(
            [('id', '=', int(attachment_id))],
            ["name", "datas", "res_model", "res_id", "type", "url"]
        )
        if attachment:
            attachment = attachment[0]
        else:
            return redirect('/event')

        if attachment["type"] == "url":
            if attachment["url"]:
                return redirect(attachment["url"])
            else:
                return request.not_found()
        elif attachment["datas"]:
            print(base64.standard_b64decode(attachment["datas"]))

            data = BytesIO(base64.standard_b64decode(attachment["datas"]))
            return http.send_file(data, filename=attachment['name'], as_attachment=True)
        else:
            return request.not_found()

    @http.route(['''/my/purchase_request/edit/<model('material.purchase.requisition'):pr>'''], type='http', auth="user",
                website=True,
                methods=['POST', 'GET'])
    def portal_my_pr_edit(self, pr, **kw):

        if not kw:
            user = request.env.user
            emp = request.env['hr.employee'].sudo().search([('user_id', '=', user.id)], limit=1)
            attachment_obj = http.request.env['ir.attachment']
            attachment_ids = attachment_obj.sudo().search([('res_model', '=', 'material.purchase.requisition'),
                                                           ('res_id', '=', pr.id)])
            products = http.request.env['product.product'].sudo().search(
                [('purchase_ok', '=', True),('detailed_type','!=','service'),('is_educational','=',False),'|',('is_portal_item','=',True),('is_other','=',True)],order = "is_other desc,name asc")
            currencies = http.request.env['res.currency'].sudo().search([])
            vendors = http.request.env['res.partner'].sudo().search(
                [('supplier_rank', '>', 0)])
            return request.render(
                "website_portal.portal_my_pr_edit", {
                    'pr': pr,
                    'products': products,
                    'attachment_ids': attachment_ids,
                    'vendors': vendors,
                    'currencies': currencies,
                    'page_name': 'my_pr',
                    'emp_id': emp and emp.id or False
                })
        else:
            line_ids = request.httprequest.form.getlist('line_id')
            description = request.httprequest.form.getlist('description')
            product_id = request.httprequest.form.getlist('product_id')

            requisition_action = request.httprequest.form.getlist('requisition_action')
            vendor_id = request.httprequest.form.getlist('vendor_id')
            qty = request.httprequest.form.getlist('qty')
            vendor_text = request.httprequest.form.getlist('vendor_text')
            print(request.params)
            print(vendor_text)
            # estimate_cost = request.httprequest.form.getlist('estimate_cost')
            # currency_id = request.httprequest.form.getlist('currency_id')
            product_id = request.httprequest.form.getlist('product_id')
            uom_id = request.httprequest.form.getlist('uom_id')
            requisition_id = request.httprequest.form.getlist('requisition_id')
            del kw['description']
            if 'requisition_action' in request.params:
                del kw['requisition_action']
            del kw['requisition_responsible_employee_id']

            if 'department_id' in request.params:
                del kw['department_id']

            if 'company_id' in request.params:
                del kw['company_id']

            if 'qty' in request.params:
                del kw['qty']
            if 'line_id' in request.params:
                del kw['line_id']

            if 'requisition_id' in request.params:
                del kw['requisition_id']
            if 'estimate_cost' in request.params:
                del kw['estimate_cost']

            if 'currency_id' in request.params:
                del kw['currency_id']

            if 'product_id' in request.params:
                del kw['product_id']
            if 'vendor_text' in request.params:
                del kw['vendor_text']
            if 'uom_id' in request.params:
                del kw['uom_id']
            if 'vendor_id' in request.params:
                del kw['vendor_id']
            kw['employee_id'] = http.request.env.user.employee_id.id
            for idx, line_id in enumerate(line_ids):
                try:
                    description[idx]
                    val_description = description[idx]
                except:
                    val_description = False
                try:
                    qty[idx]
                    val_qty = float(qty[idx])
                except:
                    val_qty = False
                try:
                    product_id[idx]
                    val_product_id = int(product_id[idx])
                except:
                    val_product_id = False
                try:
                    uom_id[idx]
                    val_uom_id = int(uom_id[idx])
                except:
                    val_uom_id = False
                try:
                    requisition_id[idx]
                    val_requisition_id = int(requisition_id[idx])
                except:
                    val_requisition_id = False
                try:
                    requisition_action[idx]
                    val_requisition_action = requisition_action[idx]
                except:
                    val_requisition_action = False
                try:
                    vendor_id[idx]
                    val_vendor_id = int(vendor_id[idx])
                except:
                    val_vendor_id = False
                try:
                    vendor_text[idx]
                    val_vendor_text = (vendor_text[idx])
                except:
                    val_vendor_text = False
                # try:
                #     estimate_cost[idx]
                #     val_estimate_cost = float(estimate_cost[idx])
                # except:
                #     val_estimate_cost = False
                # try:
                #     currency_id[idx]
                #     val_currency_id = int(currency_id[idx])
                # except:
                #     val_currency_id = False

                vals = {
                    'description': val_description,
                    'requisition_id' : pr.id,
                    'qty': val_qty,
                    'product_id': val_product_id,
                    'uom_id': val_uom_id or request.env['product.product'].browse(val_product_id).uom_id.id,
                    'requisition_action': val_requisition_action,
                    'vendor_id': val_vendor_id,
                    # 'estimate_cost': val_estimate_cost,
                    # 'currency_id': val_currency_id,
                    'vendor_text': val_vendor_text,
                }
                if not val_qty:
                    raise UserError("Quantity Cant Be Zero")
                print(vals)
                try:                        
                    if line_id != '':
                        exisisting_line = http.request.env['requisition.line'].sudo().search([('id', '=', line_ids[idx])])

                        exisisting_line.write(vals)
                    else:
                        http.request.env['requisition.line'].sudo().create(vals)
                        
                except:
                    print(line_ids)
            if 'attachment' in request.params:
                del kw['attachment']
                attachment_list = request.httprequest.files.getlist('attachment')
                for attachment in attachment_list:
                    if attachment:
                        attachments = {
                            'res_name': attachment.filename,
                            'res_model': 'material.purchase.requisition',
                            'res_id': pr,
                            'datas': base64.encodebytes(attachment.read()),
                            'type': 'binary',
                            'name': attachment.filename,
                        }
                        attachment_obj = http.request.env['ir.attachment']
                        attachment_obj.sudo().create(attachments)
            if 'attachment' in kw:
                del kw['attachment']
            pr.sudo().write(kw)


            pr_link = "/my/purchase_request/%s" % (pr.id)
            return werkzeug.utils.redirect(pr_link)

    @http.route(['''/my/purchase_request/delete/<model('material.purchase.requisition'):pd>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_purchase_request_delete(self, pd, **kw):
        pd.sudo().unlink()
        return werkzeug.utils.redirect('/my/purchase_request')

    @http.route(['''/my/purchase_request/receive/<model('material.purchase.requisition'):pd>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_purchase_request_receive(self, pd, **kw):
        pd.sudo().action_received()
        return werkzeug.utils.redirect('/my/purchase_request')

    @http.route(['''/my/purchase_request/confirm/<model('material.purchase.requisition'):pd>'''], type='http',
                methods=['GET'], auth="user",
                website=True,
                csrf=False)
    def portal_my_purchase_request_confirm(self, pd, **kw):
        pd.sudo().confirm_requisition()
        return werkzeug.utils.redirect('/my/purchase_request')

    @http.route(['''/my/purchase_request/line/delete/<model('requisition.line'):rl>'''], type='http', methods=['GET'],
                auth="user",
                website=True,
                csrf=False)
    def portal_my_purchase_request_line_delete(self, rl, **kw):
        requistion = rl.requisition_id
        if rl:
            rl.sudo().unlink()
        return self.portal_my_pr_edit(requistion)

    @http.route(['''/my/pd/edit/<model('material.purchase.requisition'):pd>'''], type='http', auth="user", website=True,
                methods=['POST', 'GET'])
    def my_purchase_edit(self, pd, **kw):
        if not kw:
            user = request.env.user
            emp = request.env['hr.employee'].sudo().search([('user_id', '=', user.id)], limit=1)
            attachment_obj = http.request.env['ir.attachment']
            attachment_ids = attachment_obj.sudo().search([('res_model', '=', 'material.purchase.requisition'),
                                                           ('res_id', '=', pd.id)])
            return request.render(
                "website_portal.portal_my_pd_edit", {
                    'pd': pd,
                    'attachment_ids': attachment_ids,
                    'page_name': 'PD Request',
                    'emp_id': emp and emp.id or False
                })
        else:

            pd.sudo().write(kw)
            if 'attachment' in request.params:
                del kw['attachment']
                attachment_list = request.httprequest.files.getlist('attachment')
                for attachment in attachment_list:
                    # if attachment:
                    attachments = {
                        'res_name': attachment.filename,
                        'res_model': 'material.purchase.requisition',
                        'res_id': pd,
                        'datas': base64.encodebytes(attachment.read()),
                        'type': 'binary',
                        'name': attachment.filename,
                    }
                    attachment_obj = http.request.env['ir.attachment']
                    attachment_obj.sudo().create(attachments)
            pd_link = "/my/pd/%s" % (pd.id)
            return werkzeug.utils.redirect(pd_link)
        print(kw)
        print(request.params)

    @http.route(['/purchase_request/pr_insert'], type='http', auth="public", methods=['POST'], website=True)
    def pr_submitted(self, **kw):
        product_id = request.httprequest.form.getlist('product_id')
        requisition_action = request.httprequest.form.getlist('requisition_action')
        vendor_id = request.httprequest.form.getlist('vendor_id')
        qty = request.httprequest.form.getlist('qty')
        # estimate_cost = request.httprequest.form.getlist('estimate_cost')
        vendor_text = request.httprequest.form.getlist('vendor_text')
        # currency_id = request.httprequest.form.getlist('currency_id')
        product_id = request.httprequest.form.getlist('product_id')
        desc = request.httprequest.form.getlist('desc')
        # print(currency_id)
        # del kw['product_id']
        if 'attachment' in request.params:
            del kw['attachment']
        attachment_list = request.httprequest.files.getlist('attachment')
        if 'requisition_action' in request.params:
            del kw['requisition_action']
        del kw['requisition_responsible_employee_id']
        del kw['department_id']
        del kw['company_id']
        del kw['qty']
        if 'estimate_cost' in request.params:
            del kw['estimate_cost']
        if 'vendor_text' in request.params:
            del kw['vendor_text']
        if 'desc' in request.params:
            del kw['desc']
        if 'currency_id' in request.params:
            del kw['currency_id']
        if 'vendor_id' in request.params:
            del kw['vendor_id']
        if 'product_id' in request.params:
            del kw['product_id']
        if not (http.request.env.user.employee_id):
            raise AccessDenied()
        kw['employee_id'] = http.request.env.user.employee_id.id
        pr = http.request.env['material.purchase.requisition'].sudo().create(kw)
        # pr.confirm_requisition()
        print(attachment_list)
        for attachment in attachment_list:
            file_name = attachment.filename
            print(file_name.lower())
            if file_name and not file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.pdf')):
                raise UserError('Allowed Attachment Format PDF, PNG, JPG, JPEG')
            attachments = {
                'res_name': attachment.filename,
                'res_model': 'material.purchase.requisition',
                'res_id': pr,
                'datas': base64.encodebytes(attachment.read()),
                'type': 'binary',
                'name': attachment.filename,
            }
            attachment_obj = http.request.env['ir.attachment']
            attachment_obj.sudo().create(attachments)
        if 'product_id' in request.params:
            for idx, current_product_id in enumerate(product_id):
                if current_product_id != "":
                    # print(currency_id[idx])
                    if idx in vendor_id:
                        vendor = vendor_id[idx]
                    else:
                        vendor = False
                    if idx in product_id:
                        product = product_id[idx]
                    else:
                        product = False
                    current_product_id = int(current_product_id)
                    vals = {
                        'requisition_id': pr.id,
                        'description': (desc[idx]) if desc[idx] and len(desc[idx]) else 
 http.request.env['product.product'].sudo().browse(current_product_id).name,
                        # 'requisition_action': requisition_action[idx],
                        'vendor_id': vendor,
                        'product_id': current_product_id,
                        'qty': float(qty[idx]) if qty[idx].isdigit() else 0,
                        # 'estimate_cost': float(estimate_cost[idx]) if estimate_cost[idx].isdigit() else 0,
                        'uom_id' : request.env['product.product'].browse(current_product_id).uom_id.id,
                        # 'vendor_text': (vendor_text[idx]),
                        # 'currency_id': int(currency_id[idx]),

                    }
                    http.request.env['requisition.line'].sudo().create(vals)
        pr_link = "/my/purchase_request/%s" % (pr.id)
        return werkzeug.utils.redirect(pr_link)