# -*- coding: utf-8 -*-

import logging
from tornado.web import authenticated
from Handlers.BaseHandler import BaseHandler
from Tools import PostgreSQL

logger = logging.getLogger(__name__)


class ValidationHandler(BaseHandler):
    """Validation Handler which require a connected user"""

    @authenticated
    def post(self, path_request):
        PostgreSQL.valider_accompagnant(path_request)
        self.write({})

    @authenticated
    def delete(self, path_request):
        PostgreSQL.refuser_accompagnant(path_request)
        self.write({})
