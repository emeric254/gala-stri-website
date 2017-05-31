# -*- coding: utf-8 -*-

import logging
from Handlers.BaseHandler import BaseHandler
from Tools import PostgreSQL, VerifyFields

logger = logging.getLogger(__name__)


class RegisterHandler(BaseHandler):
    """handle / endpoint"""

    def initialize(self):
        self.conn = PostgreSQL.get_session()

    def get(self):
        """Serve Get and return main page"""
        self.render('register.html')

    def post(self):
        """Get user completed form and verify it before save it"""
        prenom = self.get_body_argument('prenom')
        nom = self.get_body_argument('nom')
        courriel = self.get_body_argument('courriel')
        genre = self.get_body_argument('genre')
        promotion = int(self.get_body_argument('promotion'))
        if VerifyFields.verify_all(prenom, nom, courriel, genre, promotion):
            PostgreSQL.insert_inscrit(prenom, nom, genre, courriel, promotion)
            self.render('registered.html')
        else:
            self.send_error(status_code=400)
