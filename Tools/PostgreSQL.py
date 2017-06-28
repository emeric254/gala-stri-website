# -*- coding: utf-8 -*-

import os
import logging
import psycopg2

logger = logging.getLogger(__name__)


def get_conf():
    db_host = '127.0.0.1'
    if 'OPENSHIFT_POSTGRESQL_DB_HOST' in os.environ:
        db_host = os.environ['OPENSHIFT_POSTGRESQL_DB_HOST']
    db_port = '5432'
    if 'OPENSHIFT_POSTGRESQL_DB_PORT' in os.environ:
        db_port = os.environ['OPENSHIFT_POSTGRESQL_DB_PORT']
    db_user = 'postgres'
    if 'OPENSHIFT_POSTGRESQL_DB_USERNAME' in os.environ:
        db_user = os.environ['OPENSHIFT_POSTGRESQL_DB_USERNAME']
    db_password = '123456789'
    if 'OPENSHIFT_POSTGRESQL_DB_PASSWORD' in os.environ:
        db_password = os.environ['OPENSHIFT_POSTGRESQL_DB_PASSWORD']
    db_name = 'sampledb'
    return db_host, db_port, db_user, db_password, db_name


def get_session():
    (db_host, db_port, db_user, db_password, db_name) = get_conf()
    return psycopg2.connect(dbname=db_name, user=db_user, password=db_password, host=db_host, port=db_port)


def init_db():
    with get_session() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_type WHERE typname = 'personne_type'")
            result = cur.fetchone()
            if not result:
                cur.execute("CREATE TYPE personne_type AS ENUM "
                            "('personnel', 'professionnel', 'ancien', 'etudiant', 'autre');")
            cur.execute("SELECT 1 FROM pg_type WHERE typname = 'status_accompagnateur'")
            result = cur.fetchone()
            if not result:
                cur.execute("CREATE TYPE status_accompagnateur AS ENUM ('attente', 'refus', 'valide');")
            cur.execute("CREATE TABLE IF NOT EXISTS personnes ("
                        "id SERIAL PRIMARY KEY,"
                        "prenom VARCHAR(64) NOT NULL,"
                        "nom VARCHAR(64) NOT NULL,"
                        "status personne_type NOT NULL,"
                        "paiement BOOL NOT NULL DEFAULT FALSE,"
                        "UNIQUE (prenom, nom));")
            cur.execute("CREATE TABLE IF NOT EXISTS inscrits ("
                        "f_id_personne INT NOT NULL PRIMARY KEY REFERENCES personnes (id),"
                        "courriel VARCHAR(96) NOT NULL,"
                        "promo int NOT NULL);")
            cur.execute("CREATE TABLE IF NOT EXISTS accompagnants ("
                        "f_id_personne INT NOT NULL REFERENCES personnes (id),"
                        "f_id_inscrit INT NOT NULL REFERENCES inscrits (f_id_personne),"
                        "validation status_accompagnateur NOT NULL DEFAULT 'attente',"
                        "PRIMARY KEY(f_id_personne, f_id_inscrit));")


def reset_db():
    with get_session() as conn:
        with conn.cursor() as cur:
            cur.execute("DROP TABLE IF EXISTS accompagnants;"
                        "DROP TABLE IF EXISTS inscrits;"
                        "DROP TABLE IF EXISTS personnes;")
            cur.execute("DROP TYPE IF EXISTS personne_type;"
                        "DROP TYPE IF EXISTS status_accompagnateur;")


def insert_accompagnants(cur, inscrit_id: int, accompagnateurs: list):
    for (a_prenom, a_nom) in accompagnateurs:
        try:
            cur.execute("INSERT INTO personnes (prenom, nom, status) VALUES (%s, %s, %s);", (a_prenom, a_nom, 'autre'))
        except psycopg2.IntegrityError as err:
            logger.warning(str(err))
            return False
        cur.execute("SELECT currval(pg_get_serial_sequence('personnes','id'));")
        inserted_a_id = cur.fetchone()
        if inserted_a_id:
            a_status = 'valide' if accompagnateurs.index((a_prenom, a_nom)) < 3 else 'attente'
            cur.execute("INSERT INTO accompagnants (f_id_personne, f_id_inscrit, validation) VALUES (%s, %s, %s);",
                        (inserted_a_id[0], inscrit_id, a_status))
        else:
            return False
    return True


def insert_inscrit(prenom: str, nom: str, status: str, courriel: str, promotion: int, accompagnateurs: list):
    success = False
    with get_session() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute("INSERT INTO personnes (prenom, nom, status) VALUES (%s, %s, %s);", (prenom, nom, status))
            except psycopg2.IntegrityError as err:
                logger.warning(str(err))
                conn.rollback()
                return success
            cur.execute("SELECT currval(pg_get_serial_sequence('personnes','id'));")
            inserted_id = cur.fetchone()
            if inserted_id:
                cur.execute("INSERT INTO inscrits (f_id_personne, courriel, promo) VALUES (%s, %s, %s);",
                            (inserted_id[0], courriel, promotion))
                if insert_accompagnants(cur, inserted_id[0], accompagnateurs):
                    success = True
                else:
                    conn.rollback()
            else:
                conn.rollback()
    return success


def get_all_inscrit():
    with get_session() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT p.id, p.prenom, p.nom, p.status, p.paiement, i.courriel, i.promo "
                        "FROM personnes p, inscrits i "
                        "WHERE p.id = i.f_id_personne "
                        "ORDER BY p.status, p.id DESC;")
            results = cur.fetchall()
    return results


def get_all_accompagnants():
    with get_session() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT p.id, p2.prenom || ' ' || p2.nom, p.prenom, p.nom, p.status, p.paiement, a.validation "
                        "FROM personnes p, accompagnants a "
                        "INNER JOIN personnes p2 ON p2.id = a.f_id_inscrit "
                        "WHERE p.id = a.f_id_personne "
                        "ORDER BY a.f_id_inscrit, a.validation, p.status, p.id DESC;")
            results = cur.fetchall()
    return results


def get_all_accompagnants_inscrit(id_inscrit):
    with get_session() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT p.id, a.f_id_personne, a.f_id_inscrit, "
                        "p.prenom, p.nom, p.status, p.paiement, a.validation "
                        "FROM personnes p, accompagnants a "
                        "WHERE p.id = a.f_id_personne AND a.f_id_inscrit = (%s) "
                        "ORDER BY a.validation, p.status, p.id DESC;", (id_inscrit,))
            results = cur.fetchall()
    return results


def accepter_paiement(id_personne):
    with get_session() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute("UPDATE personnes SET paiement = True WHERE id = (%s);", (id_personne,))
            except psycopg2.DataError as err:
                logger.warning(str(err))
                conn.rollback()
                return False
    return True


def refuser_paiement(id_personne):
    with get_session() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute("UPDATE personnes SET paiement = False WHERE id = (%s);", (id_personne,))
            except psycopg2.DataError as err:
                logger.warning(str(err))
                conn.rollback()
                return False
    return True


def valider_accompagnant(id_personne):
    with get_session() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute("UPDATE accompagnants SET validation = 'valide' "
                            "WHERE f_id_personne = (%s);", (id_personne,))
            except psycopg2.DataError as err:
                logger.warning(str(err))
                conn.rollback()
                return False
    return True


def refuser_accompagnant(id_personne):
    with get_session() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute("UPDATE accompagnants SET validation = 'refus' WHERE f_id_personne = (%s);", (id_personne,))
            except psycopg2.DataError as err:
                logger.warning(str(err))
                conn.rollback()
                return False
    return True


def attente_accompagnant(id_personne):
    with get_session() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute("UPDATE accompagnants SET validation = 'attente' "
                            "WHERE f_id_personne = (%s);", (id_personne,))
            except psycopg2.DataError as err:
                logger.warning(str(err))
                conn.rollback()
                return False
    return True


def supprimer_inscrit(id_personne):
    with get_session() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute("DELETE FROM accompagnants WHERE f_id_inscrit = (%s);", (id_personne,))
                cur.execute("DELETE FROM inscrits WHERE f_id_personne = (%s);", (id_personne,))
                cur.execute("DELETE FROM personnes WHERE id = (%s);", (id_personne,))
            except psycopg2.IntegrityError as err:
                logger.warning(str(err))
                conn.rollback()
                return False
    return True


def supprimer_acconpagnant(id_personne):
    with get_session() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute("DELETE FROM accompagnants WHERE f_id_personne = (%s);", (id_personne,))
                cur.execute("DELETE FROM personnes WHERE id = (%s);", (id_personne,))
            except psycopg2.IntegrityError as err:
                logger.warning(str(err))
                conn.rollback()
                return False
        return True
