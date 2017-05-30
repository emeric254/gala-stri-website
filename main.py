#!/usr/bin/env python
# -*- coding: utf-8 -*-

import uuid
import logging
from redis import Redis
from tornado import ioloop, web
from Handlers.MainHandler import MainHandler
from Handlers.LoginHandler import LoginHandler
from Handlers.LogoutHandler import LogoutHandler

logging.basicConfig(format='%(asctime)s [%(levelname)s] %(message)s', filename='website.log',level=logging.INFO)

app_port = '8080'
redis_host = '127.0.0.1'
redis_port = '6379'
redis_db = 0
redis_password = None


class Application(web.Application):

    def __init__(self, redis_client: Redis):
        handlers = [
            (r'/', MainHandler),
            (r'/login', LoginHandler, dict(redis_client=redis_client)),
            (r'/logout', LogoutHandler),
        ]
        settings = {
            'cookie_secret': ''.join([str(uuid.uuid4()) for _ in range(8)]),
            'template_path': './templates',
            'static_path': './static',
            'login_url': '/login',
            'xsrf_cookies': True,
        }
        super(Application, self).__init__(handlers, **settings)


def main():
    redis_client = Redis(host=redis_host, port=redis_port, db=redis_db, password=redis_password)
    app = Application(redis_client=redis_client)
    app.listen(port=app_port)
    ioloop.IOLoop.current().start()


if __name__ == '__main__':
    main()
