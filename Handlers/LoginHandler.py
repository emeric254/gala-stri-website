# -*- coding: utf-8 -*-

import os
import json
import logging
from tornado import escape
from Handlers.BaseHandler import BaseHandler

logger = logging.getLogger(__name__)

config_file = './admin.conf'
conf = {}

""" Configuration file example :
{
    "username": "admin",
    "password": "password"
}
"""


def load_conf():
    global conf
    if os.path.exists(config_file) and os.path.isfile(config_file):
        with open(config_file, mode='r', encoding='UTF-8') as file:
            conf = json.load(file)
    else:
        logger.error('Can not found ADMIN configuration file : ' + config_file)
        raise FileNotFoundError
    if not {'username', 'password'} <= conf.keys():
        logger.error('Invalid ADMIN configuration in : ' + config_file)
        raise ValueError
load_conf()


def load_conf_from_env():
    if 'ADMIN_USERNAME' in os.environ:
        conf['username'] = os.environ['ADMIN_USERNAME']
    if 'ADMIN_PASSWORD' in os.environ:
        conf['password'] = os.environ['ADMIN_PASSWORD']
load_conf_from_env()


class LoginHandler(BaseHandler):
    """Handle user login actions"""

    def failed_auth(self):
        """Increase wrong auth tries counter after a failed authentication"""
        logging.info('invalid credentials from %s', self.request.remote_ip)
        pass  # TODO ban

    def get(self):
        """Get login form"""
        if not self.is_blocked():
            if not self.is_connected():
                self.render('login.html')
                return
            self.redirect('/admin')

    def post(self):
        """Post connection form and try to connect with these credentials"""
        if not self.is_blocked():
            if not self.is_connected():
                getusername = escape.xhtml_escape(self.get_argument('username'))
                getpassword = escape.xhtml_escape(self.get_argument('password'))
                if getpassword == conf['password'] and getusername == conf['username']:
                    # set user connected cookie
                    self.set_secure_cookie('user', getusername, expires_days=1)
                    # remove wrong auth tries counter
                    # TODO remove ban counter
                    # connected
                    logger.info('user connected : ' + getusername)
                    self.redirect('/admin')
                    return
                self.failed_auth()
            self.send_error(status_code=400)
