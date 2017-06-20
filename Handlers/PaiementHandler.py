# -*- coding: utf-8 -*-

import logging
from tornado.web import authenticated
from Handlers.BaseHandler import BaseHandler
# from Tools import PostgreSQL

logger = logging.getLogger(__name__)


class PaiementHandler(BaseHandler):
    """Paiement Handler which require a connected user"""

    @authenticated
    def get(self, path_request):
        self.write(path_request)

    @authenticated
    def post(self, path_request):
        self.write(path_request)

    @authenticated
    def delete(self, path_request):
        self.write(path_request)
