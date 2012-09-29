// Generated by CoffeeScript 1.3.3
(function() {
  var AJAX_KEYPRESS_DELAY, API, BID, CANCEL_AUTO_BIDDER, CREATE_AUTO_BIDDER, GET_AUCTION_INFO, GET_AUTO_BIDDER_STATUS, GET_NONCE, LIST_AUTO_BIDDERS_FOR_AUCTION, LIST_AUTO_BIDDERS_FOR_USER, USER_AUTHENTICATE, USER_EMAIL_EXISTS, USER_REGISTER, USER_USERNAME_EXISTS, callApi, getCookie, padzero, showDialog, typewatch;

  API = "http://localhost:8081";

  CREATE_AUTO_BIDDER = "/create_auto_bidder";

  GET_AUTO_BIDDER_STATUS = "/get_auto_bidder_status";

  CANCEL_AUTO_BIDDER = "/cancel_auto_bidder";

  LIST_AUTO_BIDDERS_FOR_USER = "/list_auto_bidders_for_user";

  LIST_AUTO_BIDDERS_FOR_AUCTION = "/list_auto_bidders_for_auction";

  USER_REGISTER = "/user_register";

  USER_AUTHENTICATE = "/user_authenticate";

  GET_NONCE = "/get_nonce";

  USER_USERNAME_EXISTS = "/user_username_exists";

  USER_EMAIL_EXISTS = "/user_email_exists";

  BID = "/bid";

  GET_AUCTION_INFO = "/get_auction_info";

  AJAX_KEYPRESS_DELAY = 500;

  $(document).ready(function() {
    var cookie;
    $.ajaxSetup({
      async: true,
      dataType: "jsonp",
      jsonp: false,
      cache: false,
      type: "GET",
      beforeSend: function(xhr, settings) {},
      complete: function(xhr, status) {},
      error: function(xhr, status, error) {
        return showDialog("error", "Unexpected Error", error);
      }
    });
    $(".auction-bid-button").click(function() {
      var auction_id;
      auction_id = $(this).parent().attr("id");
      return jQuery.ajax({
        url: API + BID,
        data: {
          id: auction_id
        },
        success: function(data) {
          return alert(data);
        }
      });
    });
    cookie = getCookie("pisoauction");
    if ((cookie != null) && cookie !== "") {
      return;
    }
    window.setInterval((function() {
      return $(".auction-time-remaining").each(function(i) {
        var d, oldHours, parts;
        parts = this.innerHTML.split(":");
        d = new Date();
        d.setHours(parts[0]);
        d.setMinutes(parts[1]);
        d.setSeconds(parts[2]);
        oldHours = d.getHours();
        d.setSeconds(d.getSeconds() - 1);
        if (oldHours >= d.getHours()) {
          this.innerHTML = padzero(d.getHours(), 2) + ":" + padzero(d.getMinutes(), 2) + ":" + padzero(d.getSeconds(), 2);
          if (this.innerHTML === "00:00:00") {
            this.style.backgroundColor = "#CC0000";
            return $(this).animate({
              backgroundColor: "#FFFFFF"
            }, "slow");
          }
        } else {
          return this.innerHTML = "00:00:00";
        }
      });
    }), 1000);
    $(".auction-time-remaining").each(function(i) {
      var d, oldHours, parts;
      parts = this.innerHTML.split(":");
      d = new Date();
      d.setHours(parts[0]);
      d.setMinutes(parts[1]);
      d.setSeconds(parts[2]);
      oldHours = d.getHours();
      if (oldHours >= d.getHours()) {
        return this.innerHTML = padzero(d.getHours(), 2) + ":" + padzero(d.getMinutes(), 2) + ":" + padzero(d.getSeconds(), 2);
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
    $("#login-username").focus(function() {
      if ($(this).val() === "username") {
        $(this).val("");
        return $(this).css("color", "#000");
      }
    });
    $("#login-password").focus(function() {
      if ($(this).val() === "password") {
        $(this).val("");
        return $(this).css("color", "#000");
      }
    });
    $("#login-username").blur(function() {
      if ($(this).val() === "") {
        $(this).val("username");
        return $(this).css("color", "#ddd");
      }
    });
    $("#login-password").blur(function() {
      if ($(this).val() === "") {
        $(this).val("password");
        return $(this).css("color", "#ddd");
      }
    });
    $("#login-form").submit(function(e) {
      var password, username;
      username = $("#login-username").val();
      password = $("#login-password").val();
      callApi(USER_AUTHENTICATE, {
        username: username,
        password: password
      }, function(data) {
        if (data.exception) {
          showDialog("error", "Login Error", data.exception);
          return;
        }
        if (data.result) {

        }
      });
      return false;
    });
    return $("#registration-form").submit(function(e) {
      var email, password, username;
      username = $("#Username").val();
      email = $("#Email").val();
      password = $("#Password").val();
      callApi(USER_REGISTER, {
        username: username,
        email: email,
        password: password
      }, function(data) {
        if (data.exception) {
          showDialog("error", "Registration Error", data.exception);
          return;
        }
        if (data.result) {
          $("#leftcol").html("<div class='content'><h1>Almost Done!</h1><br/><br/><h2>An email has been dispatched to " + email + ".<br/>Please click the link in the email we sent to verify your account.</h1></div>");
        }
      });
      return false;
    });
  });

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

}).call(this);
