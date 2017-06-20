#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import uuid
import logging
from tornado import ioloop, web
from Handlers.MainHandler import MainHandler
from Handlers.RegisterHandler import RegisterHandler
from Handlers.RegisteredHandler import RegisteredHandler
from Handlers.LoginHandler import LoginHandler
from Handlers.LogoutHandler import LogoutHandler
from Handlers.AdminHandler import AdminHandler
from Handlers.ListingHandler import ListingHandler
from Handlers.PaiementHandler import PaiementHandler
from Handlers.ValidationHandler import ValidationHandler
# from Tools import PostgreSQL

logging.basicConfig(format='%(asctime)s [%(levelname)s] %(message)s', level=logging.INFO)

app_port = '8080'
if 'OPENSHIFT_PYTHON_PORT' in os.environ:
    app_port = os.environ['OPENSHIFT_PYTHON_PORT']


class Application(web.Application):

    def __init__(self):
        handlers = [
            (r'/', MainHandler),
            (r'/register', RegisterHandler),
            (r'/registered', RegisteredHandler),
            (r'/login', LoginHandler),
            (r'/logout', LogoutHandler),
            (r'/admin', AdminHandler),
            (r'/liste/(.+)$', ListingHandler),
            (r'/paiement/(.+)$', PaiementHandler),
            (r'/validation/(.+)$', ValidationHandler),
        ]
        settings = {
            'cookie_secret': ''.join([str(uuid.uuid4()) for _ in range(16)]),
            'template_path': './templates',
            'static_path': './static',
            'login_url': '/login',
            'xsrf_cookies': True,
        }
        super(Application, self).__init__(handlers, **settings)


def main():
    # PostgreSQL.reset_db()
    # PostgreSQL.init_db()
    app = Application()
    app.listen(port=app_port)
    ioloop.IOLoop.current().start()


if __name__ == '__main__':
    main()
