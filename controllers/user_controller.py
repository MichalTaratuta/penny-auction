#!/usr/bin/env python
# -*- coding: utf-8 -*-

################################################################################
# © 2013
# main author: Darin Hoover
################################################################################

# make Python do floating-point division by default
from __future__ import division
# make string literals be Unicode strings
from __future__ import unicode_literals

from models import user, user_cookie
import lib.bcrypt.bcrypt as bcrypt
from lib import web
import logging

from google.appengine.ext import db
from google.appengine.api import mail

from datetime import datetime
import hashlib
import random
import sys

class UserController(object):

	@staticmethod
	def user_get_nonce():
		'''
			Get a random number, to be used only once, hence nonce ("Number used
			ONCE")
		'''
		return random.randint(32768, sys.maxint)

	@staticmethod
	def user_authenticate(username, password):
		'''
			Login to the API and return a hash which corresponds to the
			username, password, and salt
		'''

		# Verify the user exists in the database
		aUser = user.User.get_by_username(username)
		if aUser is None:
			raise Exception("Invalid username or password")

		# Verify the username/password combination (including the user's password
		# salt) matches the hashed password currently stored to the user object
		hashed_password = UserController.user_hash_password(username,
			password, aUser.password_salt)
		if hashed_password != aUser.hashed_password:
			raise Exception("Invalid username or password")

		UserController.create_cookie(aUser.username)

		return aUser.username

	@staticmethod
	def user_info():
		'''
			This will be used to authenticate a user's cookie information.
		'''

		username = UserController.validate_cookie()
		if username is None:
			raise Exception("Not logged in.")

		userInfo = user.User.get_by_username(username)

		if userInfo is None:
			return None # maybe raise an exception. Why would a cookie exist but no user?

		numBids = userInfo.bid_count
		AutoBidders = userInfo.active_autobidders.get()

		if AutoBidders is None:
			numAutoBidders = 0
		else:
			numAutoBidders = AutoBidders.size()


		result = []
		result.append({'username':username,'bids':numBids,'auto-bidders':numAutoBidders})
		#'auto-bidders':user.active_autobidders.count()}
		return result

	@staticmethod
	def user_logout():
		username = UserController.validate_cookie()
		user_cookie.UserCookie.delete_all_cookies(username)
		return username

	@staticmethod
	def user_register(first_name, last_name, username, email, password):
		'''
			Register a new account
		'''

		if user.User.username_exists(username):
			raise Exception("This username already exists.  Please choose another.")

		if user.User.email_exists(email):
			raise Exception("This email address has already been registered.  If you "
				           +"need help logging in, please <a href='/forgot_credentials'>click here.</a>")
		# create a new user and hash their password

		userInfo = UserController.create(first_name, last_name, username,
			email, password)

		message = mail.EmailMessage(sender="Darin Hoover <darinh@gmail.com>",
									subject="Please Validate Your Account")

		message.to = email # FirstName + " " + LastName + "<" + email + ">"

		message.body = """
		Dear """ + first_name + """:

		Your Piso Auction account has been created, but we still need to
		validate your email address.  Please click the following link
		to verify your email account:

		http://pisoauction.appspot.com/validate_email?code=""" + unicode(userInfo.email_validation_code) + """

		Once your email has been validated, you will be able to login.

		Please let us know if you have any questions.

		The Piso Auction Team
		"""

		message.html = """
		<html><head></head><body>
		Dear """ + first_name + """<br/>
		<br/>
		Your Piso Auction account has been created, but we still need to<br/>
		validate your email address.  Please click the following link<br/>
		to verify your email account:<br/>
		<br/>
		<a href='http://pisoauction.appspot.com/validate_email?code=""" + unicode(userInfo.email_validation_code) + """'>Validate Email</a><br/>
		<br/>
		Once your email has been validated, you will be able to login.<br/>
		<br/>
		Please let us know if you have any questions.<br/>
		<br/>
		The Piso Auction Team<br/>
		</body></html>
		"""

		message.send()


		# return the new user instance
		return userInfo.username

	@staticmethod
	def user_validate_email(email_validation_code):
		'''
			Attempts to validate a user's email with an email_validation_code
		'''

		if not email_validation_code:
			raise Exception("You must provide a validaton code.")

		return user.User.validate_email(email_validation_code)

	@staticmethod
	def user_update_password(user_object, new_password):
		'''
			Update the specified user to now have the specified salt. Also,
			recompute a random password salt
		'''
		# compute a new salt for the user
		new_salt = bcrypt.gensalt()

		# compute the new password hash using the new salt
		hashes = user.User.compute_secure_hashes(user_object.username,
				new_password)
		user_object.hashed_password = hashes["hashed_password"]
		user_object.password_salt = hashes["password_salt"]
		user_object.put()

	@staticmethod
	def user_hash_password(username, password, salt):
		'''
			Generate a password hash based on the provided username, password, and
			salt
		'''
		# compute the new password hash using the new salt
		return bcrypt.hashpw(password + username, salt)


	@staticmethod
	def create_cookie(username):
		'''
			Creates a cookie in user_cookie and sends it to the browser.
		'''

		# Cookie Design: http://jaspan.com/improved_persistent_login_cookie_best_practice
		# Cookie Syntax: http://webpy.org/cookbook/cookies

		token = bcrypt.gensalt()
		web.setcookie('PISOAUTH', token, 3600)
		user_cookie.UserCookie.create_cookie(username,token)

		return

	@staticmethod
	def validate_cookie():
		'''
			Validates the user's cookie
			Deletes the old one
			Creates a new one
			Returns the username
		'''

		# Do they have a cookie?
		token = web.cookies().get('PISOAUTH')
		if token is None:
			return None
		# Validate.
		aCookie = user_cookie.UserCookie.validate_cookie(token)

		if aCookie is None:
			return None
		else:
			username = aCookie.username
			aCookie.delete()
			UserController.create_cookie(username)
			return username

	@staticmethod
	def create(first_name,last_name,username,email,password):
		'''
			Define a new user in the database. Returns the model object for the
			new user to allow method chaining.
		'''

		secure_hashes = user.User.compute_secure_hashes(username, password)
		new_user = user.User(
				first_name=first_name,
				last_name=last_name,
				username=username,
				email=email,
				hashed_password=secure_hashes["hashed_password"],
				password_salt=secure_hashes["password_salt"],
				email_validation_code=secure_hashes["email_validation_code"]
		)
		new_user.put()
		return new_user

