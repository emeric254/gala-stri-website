# -*- coding: utf-8 -*-

import logging
from tornado import escape
from Handlers.BaseHandler import BaseHandler

logger = logging.getLogger(__name__)


class RegisteredHandler(BaseHandler):
    """handle / endpoint"""

    def get(self):
        """Serve Get and return registered/confirmation page"""
        courriel = self.get_query_argument('courriel', default='')
        if courriel:
            self.render('registered.html', courriel=courriel)
            return
        self.redirect('/')
