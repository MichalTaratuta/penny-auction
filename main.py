#!/usr/bin/env python

from google.appengine.ext import db
from lib import web

import sys
import random

urls = (
	'/', 'index',
	'/create_auto_bidder', 'create_auto_bidder',
	'/get_auto_bidder_status', 'get_auto_bidder_status',
	'/cancel_auto_bidder', 'cancel_auto_bidder',
	'/list_auto_bidders_for_user', 'list_auto_bidders_for_user',
	'/list_auto_bidders_for_auction', 'list_auto_bidders_for_auction',

	'/get_nonce', 'get_nonce',
	'/user_register', 'register',
	'/user_login', 'login',
	'/user_logout', 'logout',
	'/user_validate_email', 'validate_email'
)


class index:
	def GET(self):
		return "index stub"

class create_auto_bidder:
	def GET(self):
		return "create_auto_bidder stub"

class cancel_auto_bidder:
	def GET(self):
		return "cancel_auto_bidder stub"

class list_auto_bidders:
	def GET(self):
		return "list_auto_bidder stub"

class get_auto_bidder_status:
	def GET(self):
		return "get_auto_bidder_status stub"

class list_auto_bidders_for_auction:
	def GET(self):
		return "list_auto_bidders_for_auction stub"



class get_nonce:
	def GET(self):
		'''
			Get a random number, to be used only once, hence nonce ("Number used
			ONCE")
		'''
		return random.randint(32768, sys.maxint)

class register:
	'''
		Register a new account
	'''
	def GET(self):
		return False

class login:
	def GET(self):
		'''
			Login to the API and return a hash which corresponds to the
			username, password, and salt
		'''
		inputs = web.input()
		salt1 = inputs.salt1

		return salt1

class logout:
	def GET(self):
		'''
			Log out of the service
		'''
		return True

class validate_email:
	def GET(self):
		'''
			 Validate the user's email
		'''
		return True


app = web.application(urls, globals())
main = app.cgirun()

