// Generated by CoffeeScript 1.3.3
(function() {
  var AJAX_KEYPRESS_DELAY, API, AUCTION_LIST_ACTIVE, BID, CANCEL_AUTO_BIDDER, CREATE_AUTO_BIDDER, GET_AUTO_BIDDER_STATUS, LIST_AUTO_BIDDERS_FOR_AUCTION, LIST_AUTO_BIDDERS_FOR_USER, USER_AUTHENTICATE, USER_EMAIL_EXISTS, USER_REGISTER, USER_USERNAME_EXISTS, VALIDATE_EMAIL, auctions, callApi, getCookie, getParameterByName, login, padzero, registration, showDialog, typewatch, validate_email;

  API = "http://pisoapi.appspot.com";

  CREATE_AUTO_BIDDER = "/create_auto_bidder";

  GET_AUTO_BIDDER_STATUS = "/get_auto_bidder_status";

  CANCEL_AUTO_BIDDER = "/cancel_auto_bidder";

  LIST_AUTO_BIDDERS_FOR_USER = "/list_auto_bidders_for_user";

  LIST_AUTO_BIDDERS_FOR_AUCTION = "/list_auto_bidders_for_auction";

  USER_REGISTER = "/user_register";

  USER_AUTHENTICATE = "/user_authenticate";

  VALIDATE_EMAIL = "/user_validate_email";

  USER_USERNAME_EXISTS = "/user_username_exists";

  USER_EMAIL_EXISTS = "/user_email_exists";

  BID = "/bid";

  AUCTION_LIST_ACTIVE = "/auction_list_active";

  AJAX_KEYPRESS_DELAY = 500;

  $(document).ready(function() {
    $.ajaxSetup({
      async: true,
      dataType: "jsonp",
      jsonp: false,
      cache: false,
      type: "GET",
      beforeSend: function(xhr, settings) {},
      complete: function(xhr, status) {},
      error: function(xhr, status, error) {
        if (result.statusText !== "abort") {
          return showDialog("error", "Unexpected Error", error);
        }
      }
    });
    $("#messageDialog").dialog({
      autoOpen: false,
      modal: true,
      width: 300,
      height: 200,
      buttons: {
        Ok: function() {
          return $(this).dialog("close");
        }
      }
    });
    login.init();
    registration.init();
    return validate_email.init();
  });

  auctions = {
    init: function() {
      return $.ajax({
        url: API + AUCTION_LIST_ACTIVE,
        success: function(data) {
          return $.map(data, function(auction) {
            $('#auction#{auction.id} span.winner').html('<a href="#">#{auction.winner}</a>');
            $('#auction#{auction.id} span.price').text(auction.current - price);
            return $('#auction#{auction.id} span.timeleft').html(auction.time - left);
          });
        },
        error: function(data) {
          return alert('Well, no auctions yet.');
        }
      });
    }
  };

  login = {
    init: function() {
      $("#top-account-info").hide();
      $("#login-username").val("username");
      $("#login-password").val("password");
      $("#login-form").submit(function(e) {
        var password, username;
        username = $("#login-username").val();
        password = $("#login-password").val();
        callApi(USER_AUTHENTICATE, {
          username: username,
          password: password
        }, function(data) {
          if (data.result != null) {
            $('div#login-wrapper').animate({
              marginRight: -400
            }, 1000);
            $('#top-account-info').fadeIn(1000);
          }
          if (data.exception) {
            return showDialog("error", "Login Error", data.exception);
          }
        });
        return false;
      });
      $("#login-form").delegate("#login-username, #login-password", "focus", function() {
        if ($(this).val() === "username" || $(this).val() === "password") {
          $(this).val("");
          return $(this).addClass("login-focus");
        }
      });
      return $("#login-form").delegate("#login-username, #login-password", "blur", function() {
        if ($(this).val() === "") {
          $(this).val($(this).attr("id").split("-")[1]);
          return $(this).removeClass("login-focus");
        }
      });
    }
  };

  registration = {
    init: function() {
      $("div#registration-complete").hide();
      return $("#registration-form").submit(function(e) {
        var email, error, first_name, last_name, password, termsaccepted, username;
        error = "<ul style='clear: both'>";
        first_name = $("#FirstName").val();
        last_name = $("#LastName").val();
        username = $("#Username").val();
        email = $("#Email").val();
        password = $("#Password").val();
        termsaccepted = $("#termsandconditions:checked").val();
        if (first_name.length === 0) {
          error += "<li>A First Name is required.<li/>";
        }
        if (last_name.length === 0) {
          error += "<li>A Last Name is required.<li/>";
        }
        if (username.length === 0) {
          error += "<li>A username is required.<li/>";
        }
        if (email.length === 0) {
          error += "<li>An email address is required.<li/>";
        }
        if (password.length === 0) {
          error += "<li>A password is required.<li/>";
        }
        if (!termsaccepted) {
          error += "<li>You must accept our terms and conditions to register an account.<li/>";
        }
        error += "</ul>";
        if (error !== "<ul style='clear: both'></ul>") {
          showDialog("error", "Registration Error", error);
          return false;
        }
        callApi(USER_REGISTER, {
          first_name: first_name,
          last_name: last_name,
          username: username,
          email: email,
          password: password
        }, function(data) {
          if (data.exception) {
            showDialog("error", "Registration Error", data.exception);
            return;
          }
          if (data.result) {
            $("div#registration-form").slideUp('slow', function() {
              $("div#registration-complete strong").text(email);
              return $("div#registration-complete").fadeIn(1000);
            });
          }
        });
        return false;
      });
    }
  };

  validate_email = {
    init: function() {
      var code;
      $("#validation-error").hide();
      $("#validation-success").hide();
      if ($("div#validate-email") != null) {
        code = getParameterByName('code');
        return callApi(VALIDATE_EMAIL, {
          code: code
        }, function(data) {
          $("div#validate-email div#please-wait").hide();
          if (data.exception) {
            $("#validation-error h2").text(data.exception);
            $("#validation-error").fadeIn(1000);
            return;
          }
          if (data.result) {
            $("#validation-success").fadeIn(1000);
          }
        });
      }
    }
    /*
    # Bid Button Clicked 
    $(".auction-bid-button").click ->
    	auction_id = $(@).parent().attr("id")
    	$.ajax
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
    				$(@).animate
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
    */

  };

  typewatch = (function() {
    var timer;
    timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      return timer = setTimeout(callback, ms);
    };
  })();

  showDialog = function(dialogType, title, message) {
    var icon;
    icon = "info";
    switch (dialogType) {
      case "info":
        icon = "info";
        break;
      case "error":
        icon = "alert";
        break;
      default:
        icon = "info";
    }
    $("#messageDialog p").html("<span class='ui-icon ui-icon-" + icon + "' style='float:left; margin:0 7px 20px 0;'></span>" + message);
    $("#messageDialog").dialog({
      title: title
    });
    return $("#messageDialog").dialog("open");
  };

  padzero = function(number, length) {
    var str;
    str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  };

  getCookie = function(c_name) {
    var ARRcookies, i, x, y;
    i = void 0;
    x = void 0;
    y = void 0;
    ARRcookies = document.cookie.split(";");
    i = 0;
    while (i < ARRcookies.length) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, "");
      if (x === c_name) {
        return unescape(y);
      }
      i++;
    }
  };

  callApi = function(method, data, callback) {
    return jQuery.ajax({
      url: API + method,
      data: data,
      jsonp: "callback",
      success: callback
    });
  };

  getParameterByName = function(name) {
    var regex, regexS, results;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    regexS = "[\\?&]" + name + "=([^&#]*)";
    regex = new RegExp(regexS);
    results = regex.exec(window.location.search);
    if (results == null) {
      return "";
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  };

}).call(this);
