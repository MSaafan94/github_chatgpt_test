import json
import werkzeug
import itertools
import pytz
import babel.dates
from collections import OrderedDict

from odoo import http, fields
from odoo.addons.http_routing.models.ir_http import slug, unslug
from odoo.addons.website.controllers.main import QueryURL
from odoo.http import request
from odoo.osv import expression
from odoo.tools import html2plaintext
from odoo.tools.misc import get_lang

from odoo.addons.http_routing.models.ir_http import slug, unslug
from odoo.addons.website.controllers.main import QueryURL
from odoo.addons.website_blog.controllers.main import WebsiteBlog
from odoo import http, fields, SUPERUSER_ID
from odoo.http import request
class BlogInherit(WebsiteBlog):
    @http.route([
        '/blog',
        '/blog/page/<int:page>',
        '/blog/tag/<string:tag>',
        '/blog/tag/<string:tag>/page/<int:page>',
        '''/blog/<model("blog.blog", "[('website_id', 'in', (False, current_website_id))]"):blog>''',
        '''/blog/<model("blog.blog"):blog>/page/<int:page>''',
        '''/blog/<model("blog.blog"):blog>/tag/<string:tag>''',
        '''/blog/<model("blog.blog"):blog>/tag/<string:tag>/page/<int:page>''',
    ], type='http', auth="user", website=True)
    def blog(self, blog=None, tag=None, page=1, **opt):
        Blog = request.env['blog.blog']
        if blog and not blog.can_access_from_current_website():
            raise werkzeug.exceptions.NotFound()

        blogs = Blog.search(request.website.website_domain(), order="create_date asc, id asc")

        if not blog and len(blogs) == 1:
            return werkzeug.utils.redirect('/blog/%s' % slug(blogs[0]), code=302)

        date_begin, date_end, state = opt.get('date_begin'), opt.get('date_end'), opt.get('state')

        values = self._prepare_blog_values(blogs=blogs, blog=blog, date_begin=date_begin, date_end=date_end, tags=tag, state=state, page=page)

        # in case of a redirection need by `_prepare_blog_values` we follow it
        if isinstance(values, werkzeug.wrappers.Response):
            return values

        if blog:
            values['main_object'] = blog
            values['edit_in_backend'] = True
            values['blog_url'] = QueryURL('', ['blog', 'tag'], blog=blog, tag=tag, date_begin=date_begin, date_end=date_end)
        else:
            values['blog_url'] = QueryURL('/blog', ['tag'], date_begin=date_begin, date_end=date_end)

        return request.render("website_blog.blog_post_short", values)

    @http.route(['''/blog/<model("blog.blog", "[('website_id', 'in', (False, current_website_id))]"):blog>/feed'''], type='http', auth="user", website=True)
    def blog_feed(self, blog, limit='15', **kwargs):
        v = {}
        v['blog'] = blog
        v['base_url'] = blog.get_base_url()
        v['posts'] = request.env['blog.post'].search([('blog_id', '=', blog.id)], limit=min(int(limit), 50), order="post_date DESC")
        v['html2plaintext'] = html2plaintext
        r = request.render("website_blog.blog_feed", v, headers=[('Content-Type', 'application/atom+xml')])
        return r


    @http.route([
        '''/blog/<model("blog.blog", "[('website_id', 'in', (False, current_website_id))]"):blog>/post/<model("blog.post", "[('blog_id','=',blog[0])]"):blog_post>''',
    ], type='http', auth="user", website=True)
    def blog_post(self, blog, blog_post, tag_id=None, page=1, enable_editor=None, **post):
        """ Prepare all values to display the blog.

        :return dict values: values for the templates, containing

         - 'blog_post': browse of the current post
         - 'blog': browse of the current blog
         - 'blogs': list of browse records of blogs
         - 'tag': current tag, if tag_id in parameters
         - 'tags': all tags, for tag-based navigation
         - 'pager': a pager on the comments
         - 'nav_list': a dict [year][month] for archives navigation
         - 'next_post': next blog post, to direct the user towards the next interesting post
        """
        if not blog.can_access_from_current_website():
            raise werkzeug.exceptions.NotFound()

        BlogPost = request.env['blog.post']
        date_begin, date_end = post.get('date_begin'), post.get('date_end')

        pager_url = "/blogpost/%s" % blog_post.id

        pager = request.website.pager(
            url=pager_url,
            total=len(blog_post.website_message_ids),
            page=page,
            step=self._post_comment_per_page,
            scope=7
        )
        pager_begin = (page - 1) * self._post_comment_per_page
        pager_end = page * self._post_comment_per_page
        comments = blog_post.website_message_ids[pager_begin:pager_end]

        domain = request.website.website_domain()
        blogs = blog.search(domain, order="create_date, id asc")

        tag = None
        if tag_id:
            tag = request.env['blog.tag'].browse(int(tag_id))
        blog_url = QueryURL('', ['blog', 'tag'], blog=blog_post.blog_id, tag=tag, date_begin=date_begin, date_end=date_end)

        if not blog_post.blog_id.id == blog.id:
            return request.redirect("/blog/%s/post/%s" % (slug(blog_post.blog_id), slug(blog_post)), code=301)

        tags = request.env['blog.tag'].search([])

        # Find next Post
        blog_post_domain = [('blog_id', '=', blog.id)]
        if not request.env.user.has_group('website.group_website_designer'):
            blog_post_domain += [('post_date', '<=', fields.Datetime.now())]

        all_post = BlogPost.search(blog_post_domain)

        if blog_post not in all_post:
            return request.redirect("/blog/%s" % (slug(blog_post.blog_id)))

        # should always return at least the current post
        all_post_ids = all_post.ids
        current_blog_post_index = all_post_ids.index(blog_post.id)
        nb_posts = len(all_post_ids)
        next_post_id = all_post_ids[(current_blog_post_index + 1) % nb_posts] if nb_posts > 1 else None
        next_post = next_post_id and BlogPost.browse(next_post_id) or False

        values = {
            'tags': tags,
            'tag': tag,
            'blog': blog,
            'blog_post': blog_post,
            'blogs': blogs,
            'main_object': blog_post,
            'nav_list': self.nav_list(blog),
            'enable_editor': enable_editor,
            'next_post': next_post,
            'date': date_begin,
            'blog_url': blog_url,
            'pager': pager,
            'comments': comments,
        }
        response = request.render("website_blog.blog_post_complete", values)

        request.session[request.session.sid] = request.session.get(request.session.sid, [])
        if not (blog_post.id in request.session[request.session.sid]):
            request.session[request.session.sid].append(blog_post.id)
            # Increase counter
            blog_post.sudo().write({
                'visits': blog_post.visits + 1,
                'write_date': blog_post.write_date,
            })
        return response

    @http.route('/blog/<int:blog_id>/post/new', type='http', auth="user", website=True)
    def blog_post_create(self, blog_id, **post):
        # Use sudo so this line prevents both editor and admin to access blog from another website
        # as browse() will return the record even if forbidden by security rules but editor won't
        # be able to access it
        if not request.env['blog.blog'].browse(blog_id).sudo().can_access_from_current_website():
            raise werkzeug.exceptions.NotFound()

        new_blog_post = request.env['blog.post'].create({
            'blog_id': blog_id,
            'is_published': False,
        })
        return werkzeug.utils.redirect("/blog/%s/post/%s?enable_editor=1" % (slug(new_blog_post.blog_id), slug(new_blog_post)))

    @http.route('/blog/post_duplicate', type='http', auth="user", website=True, methods=['POST'])
    def blog_post_copy(self, blog_post_id, **post):
        """ Duplicate a blog.

        :param blog_post_id: id of the blog post currently browsed.

        :return redirect to the new blog created
        """
        new_blog_post = request.env['blog.post'].with_context(mail_create_nosubscribe=True).browse(int(blog_post_id)).copy()
        return werkzeug.utils.redirect("/blog/%s/post/%s?enable_editor=1" % (slug(new_blog_post.blog_id), slug(new_blog_post)))

    @http.route(['/blog/render_latest_posts'], type='json', auth='user', website=True)
    def render_latest_posts(self, template, domain, limit=None, order='published_date desc'):
        dom = expression.AND([
            [('website_published', '=', True), ('post_date', '<=', fields.Datetime.now())],
            request.website.website_domain()
        ])
        if domain:
            dom = expression.AND([dom, domain])
        posts = request.env['blog.post'].search(dom, limit=limit, order=order)
        return request.website.viewref(template).render({'posts': posts})
