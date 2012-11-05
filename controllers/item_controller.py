#!/usr/bin/env python
# -*- coding: utf-8 -*-

import models.item as item

from google.appengine.ext import db

class ItemController(object):

	@staticmethod
	def items_list():
		'''
			Get a list of all item names
		'''
		return item.Item.all()

	@staticmethod
	def item_add(name, quantity, price, url, image_url):
		'''
			Create a new item with the specified properties (administrative only)
		'''
		return item.Item.create(name, quantity, price, url, image_url)

	@staticmethod
	def item_get_info(name):
		'''
			Get the quantity, base price, product url, and image url for the
			specified item
		'''
		pass

	@staticmethod
	def item_update_price(name, price):
		'''
			Update the price of the specified item (administrative only)
		'''
		pass

	@staticmethod
	def item_update_quantity(name, quantity):
		'''
			Update the quantity of the specified item (administrative only)
		'''
		pass

	@staticmethod
	def item_list_auctions(name):
		'''
			List all auctions that have occurred for the specified item
		'''
		pass

