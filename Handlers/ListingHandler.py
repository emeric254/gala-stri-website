# -*- coding: utf-8 -*-

import json
import logging
from tornado.web import authenticated
from Handlers.BaseHandler import BaseHandler
from Tools import PostgreSQL

logger = logging.getLogger(__name__)


class ListingHandler(BaseHandler):
    """Listing Handler which require a connected user"""

    @authenticated
    def get(self, path_request):
        if path_request == 'inscrits':
            self.write(json.dumps(PostgreSQL.get_all_inscrit()))
            return
        elif path_request == 'accompagnants':
            self.write(json.dumps(PostgreSQL.get_all_accompagnants()))
            return
        elif path_request.startswith('inscrits') and '/' in path_request:
            (_, id) = path_request.rsplit('/', 1)
            try:
                id = int(id)
                if id < 0:
                    raise ValueError
            except ValueError:
                self.send_error(status_code=400)
                return
            self.write(json.dumps(PostgreSQL.get_all_accompagnants_inscrit(id)))
            return
        self.send_error(status_code=400)

    @authenticated
    def delete(self, path_request):
        if path_request.startswith('inscrits/'):
            PostgreSQL.supprimer_inscrit(path_request[9:])
            self.write({})
            return
        elif path_request.startswith('accompagnants/'):
            PostgreSQL.supprimer_accompagnant(path_request[14:])
            self.write({})
            return
        self.send_error(status_code=400)
