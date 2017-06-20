# -*- coding: utf-8 -*-

import logging
from tornado.web import RequestHandler

logger = logging.getLogger(__name__)


class BaseHandler(RequestHandler):
    """Superclass for Handlers which require a connected user"""

    def get_current_user(self):
        """Get current connected user

        :return: current connected user
        """
        return self.get_secure_cookie('user')

    def is_connected(self):
        """True if the user is connected"""
        return self.get_current_user() and len(self.get_current_user()) > 1

    def is_blocked(self):
        """Send 403 to a blocked ip"""
        pass  # TODO add ban
