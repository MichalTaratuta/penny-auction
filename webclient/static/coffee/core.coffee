# API
API = "http://localhost:8081"

# Autobidder
CREATE_AUTO_BIDDER = "/create_auto_bidder"
GET_AUTO_BIDDER_STATUS = "/get_auto_bidder_status"
CANCEL_AUTO_BIDDER = "/cancel_auto_bidder"
LIST_AUTO_BIDDERS_FOR_USER = "/list_auto_bidders_for_user"
LIST_AUTO_BIDDERS_FOR_AUCTION = "/list_auto_bidders_for_auction"

# User Auth
USER_REGISTER = "/user_register"
USER_AUTHENTICATE = "/user_authenticate"
GET_NONCE = "/get_nonce"
USER_USERNAME_EXISTS = "/user_username_exists"
USER_EMAIL_EXISTS = "/user_email_exists"

# Auctions
BID = "/bid"
GET_AUCTION_INFO = "/get_auction_info"

# Misc
AJAX_KEYPRESS_DELAY = 500 # In milliseconds, how long to wait after a keypress before initiating ajax request.

$(document).ready ->
	
	# Set up the jQuery AJAX stuff 
	$.ajaxSetup
		async: true
		dataType: "jsonp"
		jsonp: false
		cache: false # default for 'jsonp'
		type: "GET"
		beforeSend: (xhr, settings) ->
			# Before every AJAX request, do this
		complete: (xhr, status) ->
			# After every AJAX request, and after success/error handlers are
			# called
		error: (xhr, status, error) ->
			# Error handler
			showDialog "error", "Unexpected Error", error

	# Bid Button Clicked 
	$(".auction-bid-button").click ->
		auction_id = $(this).parent().attr("id")
		jQuery.ajax
			url: API + BID
			data:
				id: auction_id
			success: (data) ->
				alert data

	# validate cookie 
	cookie = getCookie("pisoauction")
	if cookie? and cookie isnt ""
		return

	# 1s Timer 
	window.setInterval (->
		$(".auction-time-remaining").each (i) ->
			parts = @innerHTML.split(":")
			d = new Date()
			d.setHours parts[0]
			d.setMinutes parts[1]
			d.setSeconds parts[2]
			oldHours = d.getHours()
			d.setSeconds d.getSeconds() - 1
			if oldHours >= d.getHours()
				@innerHTML = padzero(d.getHours(), 2) + ":" + padzero(d.getMinutes(), 2) + ":" + padzero(d.getSeconds(), 2)
				if @innerHTML is "00:00:00"
					@style.backgroundColor = "#CC0000"
					$(this).animate
						backgroundColor: "#FFFFFF"
					, "slow"
			else
				@innerHTML = "00:00:00"

	), 1000

	# Count auctions down 
	$(".auction-time-remaining").each (i) ->
		parts = @innerHTML.split(":")
		d = new Date()
		d.setHours parts[0]
		d.setMinutes parts[1]
		d.setSeconds parts[2]
		oldHours = d.getHours()
		@innerHTML = padzero(d.getHours(), 2) + ":" + padzero(d.getMinutes(), 2) + ":" + padzero(d.getSeconds(), 2)  if oldHours >= d.getHours()

	$("#messageDialog").dialog
		autoOpen: false
		modal: true
		width: 300
		height: 200
		buttons:
			Ok: ->
				$(this).dialog "close"

# Login Stuff

	$("#login-username").focus ->
  		if $(this).val() is "username"
    		$(this).val ""
    		$(this).css "color", "#000"

	$("#login-password").focus ->
 		if $(this).val() is "password"
    		$(this).val ""
    		$(this).css "color", "#000"

	$("#login-username").blur ->
  		if $(this).val() is ""
    		$(this).val "username"
    		$(this).css "color", "#ddd"

	$("#login-password").blur ->
  		if $(this).val() is ""
    		$(this).val "password"
    		$(this).css "color", "#ddd"

	$("#login-form").submit (e) ->
		username = $("#login-username").val()
		password = $("#login-password").val()
		callApi USER_AUTHENTICATE,
			username: username
			password: password
		, (data) ->
			if data.exception
				showDialog "error", "Login Error", data.exception
				return

			if data.result
				# Logged in
				return

		false

	$("#registration-form").submit (e) ->
		username = $("#register-username").val()
		email = $("#register-email").val()
		password = $("#register-password").val()
		callApi USER_REGISTER,
			username: username
			email: email
			password: password
		, (data) ->
			if data.exception
				showDialog "error", "Registration Error", data.exception
				return

			if data.result
				# User Registered
				return

		false

	# END $(document).ready

typewatch = (->
	timer = 0
	(callback, ms) ->
		clearTimeout timer
		timer = setTimeout(callback, ms)
)()

showDialog = (dialogType, title, message) ->
	# figure out which icon to use
	icon = "info"
	switch dialogType
		when "info"
			icon = "info"
		when "error"
			icon = "alert"
		else
			icon = "info"
	
	# update the message dialog
	$("#messageDialog p").html "<span class='ui-icon ui-icon-" + icon + "' style='float:left; margin:0 7px 20px 0;'></span>" + message
	$("#messageDialog").dialog title: title
	
	# show the message dialog
	$("#messageDialog").dialog "open"

padzero = (number, length) ->
	str = "" + number
	str = "0" + str	while str.length < length
	str
	
getCookie = (c_name) ->
	i = undefined
	x = undefined
	y = undefined
	ARRcookies = document.cookie.split(";")
	i = 0
	while i < ARRcookies.length
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="))
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1)
		x = x.replace(/^\s+|\s+$/g, "")
		return unescape(y)	if x is c_name
		i++
		
callApi = (method, data, callback) ->
	jQuery.ajax
		url: API + method
		data: data
		jsonp: "callback"
		success: callback
