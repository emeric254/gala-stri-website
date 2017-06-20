# -*- coding: utf-8 -*-

import os
import json
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger(__name__)

config_file = './smtp.gmail.conf'
conf = {}

""" Configuration file example :
{
    "gmail_host": "smtp.gmail.com",
    "gmail_port": 587,
    "gmail_user": "user@gmail.com",
    "gmail_pwd": "password"
}
"""


def load_conf():
    global conf
    if os.path.exists(config_file) and os.path.isfile(config_file):
        with open(config_file, mode='r', encoding='UTF-8') as file:
            conf = json.load(file)
    else:
        logger.error('Can not found GMAIL SMTP configuration file : ' + config_file)
        raise FileNotFoundError
    if not {'gmail_host', 'gmail_port', 'gmail_user', 'gmail_pwd'} <= conf.keys():
        logger.error('Invalid GMAIL SMTP configuration in : ' + config_file)
        raise ValueError
load_conf()


def load_conf_from_env():
    if 'GMAIL_USER' in os.environ:
        conf['gmail_user'] = os.environ['GMAIL_USER']
    if 'GMAIL_PASSWORD' in os.environ:
        conf['gmail_pwd'] = os.environ['GMAIL_PASSWORD']
load_conf_from_env()


def send_multiple_mail(to: list, subject: str = '', text: str = '', html: str = ''):
    smtpserver = smtplib.SMTP(conf['gmail_host'], conf['gmail_port'])
    smtpserver.ehlo()
    smtpserver.starttls()
    smtpserver.login(conf['gmail_user'], conf['gmail_pwd'])
    # construct mail
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = conf['gmail_user']
    msg['To'] = ", ".join(to)
    if text or not html:
        msg.attach(MIMEText(text, 'plain'))
    if html:
        msg.attach(MIMEText(html, 'html'))
    # Send the message via local SMTP server.
    ret = smtpserver.sendmail(from_addr=conf['gmail_user'], to_addrs=to, msg=msg.as_string())
    if ret:
        logger.warning(ret)
    smtpserver.quit()


def send_simple_mail(to: str, subject: str = '', text: str = ''):
    send_multiple_mail(to=[to], subject=subject, text=text)


def send_html_mail(to: str, subject: str = '', text: str = '', html: str = ''):
    send_multiple_mail(to=[to], subject=subject, text=text, html=html)
