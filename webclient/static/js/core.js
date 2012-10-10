// Generated by CoffeeScript 1.3.3
(function() {

  window.API = "http://localhost:8081";

  window.CREATE_AUTO_BIDDER = "/create_auto_bidder";

  window.GET_AUTO_BIDDER_STATUS = "/get_auto_bidder_status";

  window.CANCEL_AUTO_BIDDER = "/cancel_auto_bidder";

  window.LIST_AUTO_BIDDERS_FOR_USER = "/list_auto_bidders_for_user";

  window.LIST_AUTO_BIDDERS_FOR_AUCTION = "/list_auto_bidders_for_auction";

  window.AUCTIONS_LIST_ACTIVE = "/auctions_list_active";

  window.AUCTIONS_STATUS_BY_ID = "/auctions_status_by_id";

  window.AUCTION_BID = "/auction_bid";

  window.USER_REGISTER = "/user_register";

  window.USER_AUTHENTICATE = "/user_authenticate";

  window.VALIDATE_EMAIL = "/user_validate_email";

  window.USER_USERNAME_EXISTS = "/user_username_exists";

  window.USER_EMAIL_EXISTS = "/user_email_exists";

  window.USER_INFO = "/user_info";

  window.USER_LOGOUT = "/user_logout";

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
    return user.init();
  });

  window.user = {
    fetchingInfo: null,
    username: null,
    bids: null,
    autobidders: null,
    loggedIn: false,
    init: function() {
      return user.refresh();
    },
    refresh: function() {
      var fetchingInfo;
      if (fetchingInfo) {
        fetchingInfo.abort();
      }
      return fetchingInfo = callApi(USER_INFO, {}, function(data) {
        if (data.result) {
          user.loggedIn = true;
          user.username = data.result[0]['username'];
          user.bids = data.result[0]['bids'];
          user.autobidders = data.result[0]['auto-bidders'];
          return $('div#login-wrapper').fadeOut('fast', function() {
            var newHtml;
            newHtml = '<span class="heading">';
            newHtml += '<img src="/images/ico_man.png" width="15" height="15" alt="man" />';
            newHtml += 'Logged in as <a href="#"><strong>' + user.username + '</strong></a></span>';
            newHtml += '<span class="logout"><a href="javascript:void(0);">Logout</a></span>';
            $('span.logout a').live('click', function(e) {
              e.preventDefault();
              return callApi(USER_LOGOUT, {}, function(data) {
                return document.location.href = '/';
              });
            });
            $(this).html(newHtml);
            $(this).fadeIn('slow');
            $('#top-account-info').fadeIn(1000);
            user.update();
            return fetchingInfo = null;
          });
        }
      });
    },
    update: function() {
      $('#topbar-bids').text(user.bids);
      return $('#topbar-autobidders').text(user.autobidders);
    }
  };

  window.login = {
    init: function() {
      $("#login-form").submit(function(e) {
        var password, username;
        e.preventDefault();
        username = $("#login-username").val();
        password = $("#login-password").val();
        return callApi(USER_AUTHENTICATE, {
          username: username,
          password: password
        }, function(data) {
          if (data.result != null) {
            document.location.href = "/";
          }
          if (data.exception != null) {
            return showDialog("error", "Login Error", data.exception);
          }
        });
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

  window.showDialog = function(dialogType, title, message) {
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

  window.padzero = function(number, length) {
    var str;
    str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  };

  window.getCookie = function(c_name) {
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

  window.callApi = function(method, data, callback) {
    return jQuery.ajax({
      url: API + method,
      data: data,
      jsonp: "callback",
      success: callback
    });
  };

  window.getParameterByName = function(name) {
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

  window.secondsToHms = function(d) {
    var h, m, s;
    d = Number(d);
    h = Math.floor(d / 3600);
    m = Math.floor(d % 3600 / 60);
    s = Math.floor(d % 3600 % 60);
    return padzero(h, 2) + ":" + padzero(m, 2) + ":" + padzero(s, 2);
  };

  String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof str2 === "string" ? str2.replace(/\$/g, "$$$$") : str2));
  };

}).call(this);
