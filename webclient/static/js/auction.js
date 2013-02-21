// Generated by CoffeeScript 1.4.0
(function() {
  var auction, autobidder;

  $(document).ready(function() {
    if (auction.init()) {
      window.setInterval(auction.update, 1000);
    }
    return autobidder.init();
  });

  auction = {
    init: function() {
      return jQuery.ajax({
        url: AUCTION_DETAIL,
        data: {
          id: auction_id
        },
        success: function(data) {
          var b, i, m, n, p, t, u, w;
          if (data.result) {
            auction = data.result;
            i = auction.id;
            n = auction.name;
            b = auction.base_price;
            u = auction.product_url;
            m = auction.image_url;
            p = auction.price;
            w = auction.winner;
            t = secondsToHms(auction.time_left);
            $('#auction-name').text(auction.name);
            $('#auction-image img').attr('src', auction.image_url);
            $('#auction-detail div.price span.right').html('P' + auction.price);
            $('#auction-detail div.winner span.right').html(auction.winner);
            $('#auction-detail div.time-left').html(secondsToHms(auction.time_left));
            return true;
          } else {
            return false;
          }
        }
      });
    },
    update: function() {
      return jQuery.ajax({
        url: AUCTION_RECENT_BIDS,
        data: {
          id: auction_id
        },
        success: function(data) {
          var recent_bids;
          if (data.result) {
            return recent_bids = data.result;
          }
        }
      });
    }
  };

  autobidder = {
    init: function() {
      return jQuery.ajax({
        url: AUTOBIDDER_STATUS_BY_AUCTION,
        data: {
          id: auction_id
        },
        success: function(data) {
          if (data.result) {
            autobidder = data.result;
            if (!autobidder.id) {
              $('#create-autobidder').show();
              return $('#cancel-autobidder').hide();
            } else {
              $('#cancel-autobidder').show();
              return $('#create-autobidder').hide();
            }
          }
        }
      });
    }
  };

}).call(this);
