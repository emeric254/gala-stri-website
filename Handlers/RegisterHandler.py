# -*- coding: utf-8 -*-

import logging
from tornado import escape
from Handlers.BaseHandler import BaseHandler
from Tools import PostgreSQL, VerifyFields, EmailSender

logger = logging.getLogger(__name__)


class RegisterHandler(BaseHandler):
    """handle / endpoint"""

    def get(self):
        """Serve Get and return register/form page"""
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
        if size and size == len(nom_accompagnateurs):
            for i in range(0, size):
                a_prenom = escape.xhtml_escape(prenom_accompagnateurs[i])[:64]
                a_nom = escape.xhtml_escape(nom_accompagnateurs[i])[:64]
                if a_prenom and a_nom:
                    accompagnateurs.append((a_prenom, a_nom))
        if VerifyFields.verify_all(prenom, nom, courriel, genre, promotion, accompagnateurs):
            if PostgreSQL.insert_inscrit(prenom, nom, genre, courriel, promotion, accompagnateurs):
                EmailSender.send_simple_mail(to=courriel, subject='Confirmation Gala STRI 2017',
                                             text='Votre inscription à bien été prise en compte.')
                self.render('registered.html')
                return
        self.send_error(status_code=400)  # bad request
