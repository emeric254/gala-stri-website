# -*- coding: utf-8 -*-

import re
import logging
import datetime

logger = logging.getLogger(__name__)

EMAIL_REGEX = re.compile(r'[^@]+@[^@]+\.[^@]+')


def verify_identity(prenom: str, nom: str):
    return nom and len(nom) > 0 and prenom and len(prenom) > 0


def verify_email(courriel: str):
    return courriel and len(courriel) > 0 and EMAIL_REGEX.match(courriel)


def verify_promotion(promotion: int):
    return promotion and datetime.datetime.now().year <= promotion <= datetime.datetime.now().year + 3


def verify_genre(genre: str):
    return genre in ('personnel', 'professionnel', 'ancien', 'etudiant')


def verify_all(prenom: str, nom: str, courriel: str, genre: str, promotion, accompagnateurs: list):
    for (a_prenom, a_nom) in accompagnateurs:
        if not a_prenom or not len(a_prenom) > 0 or not a_nom or not len(a_nom) > 0:
            return False
    return verify_identity(prenom, nom) and verify_email(courriel) \
           and verify_genre(genre) and (verify_promotion(promotion) or genre != 'etudiant')
