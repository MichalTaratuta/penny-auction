// Generated by CoffeeScript 1.4.0
  var auction_ids, auction_list, auctions;

  $(document).ready(function() {
    auctions.init();
    if ($("#auctions").length !== 0) {
      return window.setInterval(auctions.updateAuctions, 1000);
    }
  });

  auction_ids = [];

  auction_list = [];

  auctions = {
    fetchingAuctionUpdates: null,
    init: function() {
      var buildAuction;
      return jQuery.ajax({
        url: AUCTIONS_LIST_CURRENT,
        data: {
          count: 30
        },
        success: function(data) {
          var b, i, ix, m, n, p, t, u, w, _results;
          $("#auctions").html("");
          auctions = data.result;
          _results = [];
          for (ix in auctions) {
            i = auctions[ix].id;
            n = auctions[ix].name;
            b = auctions[ix].base_price;
            u = auctions[ix].product_url;
            m = auctions[ix].image_url;
            p = auctions[ix].price;
            w = auctions[ix].winner;
            t = secondsToHms(auctions[ix].time_left);
            auction_ids.push(i);
            auction_list[i] = auctions[ix];
            _results.push($("#auctions").append(buildAuction(i, n, b, u, m, p, w, t)));
          }
          return _results;
        }
      }, $("ul#auctions").delegate("div.bid", "click", function() {
        var auction_id, id;
        id = $(this).closest('li').attr('id');
        if (auction_list[id].t > 11.0) {
          document.location.href = "/auction/" + id;
        }
        if (user.bids > 0) {
          auction_id = $(this).closest('li').attr("id");
          return jQuery.ajax({
            url: AUCTION_BID,
            data: {
              id: auction_id
            },
            success: function(data) {
              user.bids -= 1;
              user.update();
              if (user.bids % 5 === 0) {
                return user.refresh();
              }
            }
          });
        }
      }), buildAuction = function(id, productName, basePrice, productUrl, imageUrl, currentPrice, currentWinner, timeTilEnd) {
        var tmplAuction;
        tmplAuction = void 0;
        tmplAuction = '';
        tmplAuction += ' <li id="{auction-id}">\n';
        tmplAuction += '\t\t<!-- top block -->\n';
        tmplAuction += '\t\t<div class="top-block">\n';
        tmplAuction += '\t\t\t<h3 class="nocufon"><a href="{url}" title="{item-name}">{item-name}</a></h3>\n';
        tmplAuction += '\t\t\t<div class="imgb thumbnail-zoom">\n';
        tmplAuction += '\t\t\t\t<a href="/auction/{auction-id}" class="fadeable">\n';
        tmplAuction += '\t\t\t\t\t<span class="light-background">\n';
        tmplAuction += '\t\t\t\t\t<span class="thumb-arrow">&#8594;</span>\n';
        tmplAuction += '\t\t\t\t\t</span>\n';
        tmplAuction += '\t\t\t\t\t\t<span>\n';
        tmplAuction += '\t\t\t\t\t\t<img src="{image-url}" width="194" height="144" alt="{item-name}" />\n';
        tmplAuction += '\t\t\t\t\t\t<!--<span class="sale-img">NEW<span>ITEM</span></span>-->\n';
        tmplAuction += '\t\t\t\t\t</span>\n';
        tmplAuction += '\t\t\t\t</a>\n';
        tmplAuction += '\t\t\t</div>\n';
        tmplAuction += '\t\t\t<span class="winner"><a href="#">{winner}</a></span>\n';
        tmplAuction += '\t\t\t<span class="price">P {current-price}</span>\n';
        tmplAuction += '\t\t\t<span class="timeleft">{time-remaining}</span>\n';
        tmplAuction += '\t\t</div>\n';
        tmplAuction += '\t\t<!-- top block -->\n';
        tmplAuction += '\t\t<div class="bid js-button"><a href="javascript:void(0);" class="button-default cart"><span class="hover">BID NOW</span><span>BID NOW</span></a></div>\n';
        tmplAuction += '\t</li>\n';
        tmplAuction = tmplAuction.replaceAll("{auction-id}", id);
        tmplAuction = tmplAuction.replaceAll("{url}", productUrl);
        tmplAuction = tmplAuction.replaceAll("{item-name}", productName);
        tmplAuction = tmplAuction.replaceAll("{image-url}", imageUrl);
        tmplAuction = tmplAuction.replaceAll("{current-price}", currentPrice);
        tmplAuction = tmplAuction.replaceAll("{winner}", currentWinner);
        tmplAuction = tmplAuction.replaceAll("{time-remaining}", timeTilEnd);
        return tmplAuction;
      });
    },
    updateAuctions: function() {
      var fetchingAuctionUpdates, i, id, tmplist, _i, _len;
      if (auction_ids.length === 0) {
        return;
      }
      console.log("Auction List Length: " + auction_list.length);
      tmplist = [];
      i = 0;
      for (_i = 0, _len = auction_ids.length; _i < _len; _i++) {
        id = auction_ids[_i];
        try {
          if (auction_list[id].time_left > 0.0) {
            tmplist.push(id);
          }
        } catch (error) {
          console.log("!!! ERROR !!! :: [" + id + "] :: " + error);
        }
        i++;
      }
      auction_ids = tmplist;
      if (fetchingAuctionUpdates) {
        fetchingAuctionUpdates.abort();
      }
      return fetchingAuctionUpdates = jQuery.ajax({
        url: AUCTIONS_STATUS_BY_ID,
        data: {
          ids: auction_ids.join()
        },
        success: function(data) {
          return $.map(data, function(auction) {
            var a, buttonText, ix, p, t, w, _results;
            auctions = data.result;
            console.log("Updated Auctions Length: " + auctions.length);
            auction_list = [];
            _results = [];
            for (ix in auctions) {
              i = auctions[ix].id;
              p = auctions[ix].price;
              w = auctions[ix].winner;
              t = secondsToHms(auctions[ix].time_left);
              a = auctions[ix].active;
              auction_list[i] = auctions[ix];
              if (auctions[ix].time_left > 11.0) {
                buttonText = "Starting Soon...";
              } else {
                buttonText = "BID NOW!";
              }
              $("#" + i + " span.winner").html("<a href=\"#\">" + w + "</a>");
              $("#" + i + " span.price").text("P " + p);
              $("#" + i + " span.timeleft").html(t);
              if (auctions[ix].time_left === 0) {
                if (w === "No Bidder") {
                  buttonText = "SOLD";
                } else {
                  buttonText = "ENDED";
                }
              }
              _results.push($("#" + i + " div.bid").html('<a href="javascript:void(0);" class="button-default cart"><span class="hover">' + buttonText + '</span><span>' + buttonText + '</span></a>'));
            }
            return _results;
          });
        }
      });
    }
  };
