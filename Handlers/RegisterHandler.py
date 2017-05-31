# -*- coding: utf-8 -*-

import logging
from tornado import escape
from Handlers.BaseHandler import BaseHandler
from Tools import PostgreSQL, VerifyFields

logger = logging.getLogger(__name__)


class RegisterHandler(BaseHandler):
    """handle / endpoint"""

    def get(self):
        """Serve Get and return main page"""
        self.render('register.html')

    def post(self):
        """Get user completed form and verify it before save it"""
        prenom = escape.xhtml_escape(self.get_body_argument('prenom'))[:64]
        nom = escape.xhtml_escape(self.get_body_argument('nom'))[:64]
        courriel = escape.xhtml_escape(self.get_body_argument('courriel'))[:96]
        genre = escape.xhtml_escape(self.get_body_argument('genre'))[:16]
        promotion = int(escape.xhtml_escape(self.get_body_argument('promotion'))[:4])
        prenom_accompagnateurs = self.get_body_arguments('accompagnateurs-prenom')
        nom_accompagnateurs = self.get_body_arguments('accompagnateurs-nom')
        accompagnateurs = []
        size = len(prenom_accompagnateurs)
        size = size if size < 11 else 10
        if size == len(nom_accompagnateurs):
            for i in range(0, size):
                a_prenom = escape.xhtml_escape(prenom_accompagnateurs[i])
                a_nom = escape.xhtml_escape(nom_accompagnateurs[i])
                if not a_prenom or not a_nom:
                    self.send_error(status_code=400)
                    return
                accompagnateurs.append((a_prenom, a_nom))
        if VerifyFields.verify_all(prenom, nom, courriel, genre, promotion, accompagnateurs):
            if PostgreSQL.insert_inscrit(prenom, nom, genre, courriel, promotion, accompagnateurs):
                self.render('registered.html')
                return
        self.send_error(status_code=400)
