# -*- coding: utf-8 -*-

import logging
from tornado.web import authenticated
from Handlers.BaseHandler import BaseHandler

logger = logging.getLogger(__name__)


class AdminHandler(BaseHandler):
    """Admin Handler which require a connected user"""

    @authenticated
    def get(self):
        self.render('admin.html')
