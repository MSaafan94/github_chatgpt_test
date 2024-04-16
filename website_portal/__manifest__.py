# -*- coding: utf-8 -*-
{
    'name': "website_portal",

    'summary': """
        Short (1 phrase/line) summary of the module's purpose, used as
        subtitle on modules listing or apps.openerp.com""",

    'description': """
        Long description of module's purpose
    """,

    'author': "My Company",
    'website': "http://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/13.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',
    'license': 'AGPL-3',
    # any module necessary for this one to work correctly
    'depends': ['base', 'portal', 'professional_development_process', 'bi_material_purchase_requisitions', 'hr',
                'hr_employee_custom',
                'website',
                'web',
                'website_blog'],

    # always loaded
    'data': [

        'security/security.xml',
        'security/ir.model.access.csv',
        'views/views.xml',
        'views/portal_templates.xml',
        'views/leaves.xml',
        'views/my_profile.xml',
        'views/portal_reimbursement.xml',
        'views/maintenance.xml',
        'views/pd_view.xml',
        'views/pr_view.xml',
        'views/blogs.xml',
        'views/attendance.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'website_portal/static/fontawesome-free/css/all.min.css',
            'website_portal/static/css/adminlte.min.css',
            'website_portal/static/toastr/toastr.min.css',
            # 'website_portal/static/js/adminlte.min.js',
            'website_portal/static/toastr/toastr.min.js',
            'website_portal/static/jquery-validation/jquery.validate.min.js',
            'website_portal/static/jquery-validation/additional-methods.min.js',
            # 'website_portal/static/js/select2.min.js',
            'website_portal/static/js/custom.js',
            'website_portal/static/js/main.js',
            'website_portal/static/js/fiels.js'
        ]
    }
}
