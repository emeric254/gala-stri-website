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
    db_name = 'postgres'
    return db_host, db_port, db_user, db_password, db_name


def get_session():
    (db_host, db_port, db_user, db_password, db_name) = get_conf()
    return psycopg2.connect(dbname=db_name, user=db_user, password=db_password, host=db_host, port=db_port)


def init_db():
    conn = get_session()
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_type WHERE typname = 'personne_type'")
    result = cur.fetchone()
    if not result:
        cur.execute("CREATE TYPE personne_type AS ENUM ('personnel', 'professionnel', 'ancien', 'etudiant');")
    cur.execute("SELECT 1 FROM pg_type WHERE typname = 'status_accompagnateur'")
    result = cur.fetchone()
    if not result:
        cur.execute("CREATE TYPE status_accompagnateur AS ENUM ('attente', 'refus', 'valide');")
    cur.execute("CREATE TABLE IF NOT EXISTS personnes ("
                "id SERIAL PRIMARY KEY,"
                "nom VARCHAR(64) NOT NULL,"
                "prenom VARCHAR(64) NOT NULL,"
                "status personne_type NOT NULL,"
                "paiement BOOL NOT NULL DEFAULT FALSE);")
    cur.execute("CREATE TABLE IF NOT EXISTS inscrits ("
                "f_id_personne SERIAL PRIMARY KEY REFERENCES personnes (id),"
                "courriel VARCHAR(96) NOT NULL,"
                "promo int NOT NULL);")
    cur.execute("CREATE TABLE IF NOT EXISTS accompagnateurs ("
                "f_id_personne SERIAL REFERENCES personnes (id),"
                "f_id_inscrit SERIAL REFERENCES inscrits (f_id_personne),"
                "status status_accompagnateur NOT NULL DEFAULT 'attente',"
                "PRIMARY KEY(f_id_personne, f_id_inscrit));")
    conn.commit()
    cur.close()
    conn.close()


def reset_db():
    conn = get_session()
    cur = conn.cursor()
    cur.execute("DROP TABLE accompagnateurs; DROP TABLE inscrits; DROP TABLE personnes;")
    cur.execute("DROP TYPE personne_type; DROP TYPE status_accompagnateur;")
    conn.commit()
    cur.close()
    conn.close()
