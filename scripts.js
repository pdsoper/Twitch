$(document).ready(function() {
  var coder_ids = ["izakOOO", "imaqtpie", "MedryBW", "freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","comster404","brunofin","thomasballinger","noobs2ninjas","beohoff"];
  var url = "https://api.twitch.tv/kraken/streams/freecodecamp";
  // var url = "https://api.twitch.tv/kraken/streams/lirik";
  var channelUrl, game, viewers, fps, preview, displayName;
  
  var coderStatus = [];
  var coderNames = [];
  var coderIcons = [];
  var online = [];

  getOnLine(true);

  $('#all').click(function() {
    $('.coders').html("");
    getOnLine(true);
    $('.arrow-all').css("visibility", "visible");
    $('.arrow-on').css("visibility", "hidden");
    $('.arrow-off').css("visibility", "hidden");
  })

  $('#online').click(function() {
    $('.coders').html("");
    getOnLine(false);
    $('.arrow-all').css("visibility", "hidden");
    $('.arrow-on').css("visibility", "visible");
    $('.arrow-off').css("visibility", "hidden");
  })

  $('#offline').click(function() {
    $('.coders').html("");
    getOffLine();
    $('.arrow-all').css("visibility", "hidden");
    $('.arrow-on').css("visibility", "hidden");
    $('.arrow-off').css("visibility", "visible");
  })

  function getOnLine(andOffLine) {
    /* Retrieve and update information for anyone in the coder_ids list who is online */
    var queryUrl = "https://api.twitch.tv/kraken/streams?channel=" + coder_ids.join(",");
    $.ajax({
      url: queryUrl,
      type: "POST",
      dataType: "jsonp",
    })
    .done(function(obj, status, jqXHR) {
      var streams = obj.streams;
      // console.log(obj);
      // $('#online').html(makeJSONTable(obj,"Online Users"));
      for (var i = 0; i < streams.length; i++) {
        var coderName = streams[i].channel.display_name.toLowerCase();
        online.push(coderName);
        var coderIcon = streams[i].channel.logo;  
        var status = streams[i].channel.status;
        if (coderIcon === null) {
          coderIcon = "http://www.clker.com/cliparts/d/L/P/X/z/i/no-image-icon-th.png";
        }
        channelUrl = streams[i].channel.url;
        $('.coders').append('\n' +
          '<tr class="online">\n' +
          '   <td> <img class="coder-img" src="'+ coderIcon + '" /> </td>\n' +
          '   <td>' + coderName + '<span class="details">' + status + '</span></td>' +
          '   <td> <a href="' + channelUrl + '" target="_blank"> <span class="text-success"> <strong><i class="fa fa-check"></i> </strong></span></a> </td>' +
          '</tr>\n');
      };
      if (andOffLine === true) {
        getOffLine();
      }
    })
    .fail(function(jqXHR, status, errorThrown) {
      alert("Sorry - Twitch is unavailable");
      console.log("getJSON status = " + status + " for " + url);
      throw errorThrown;
    })
    .always(function(obj, status, jqXHR) {
    });
  }

  function getOffLine() {
    for (var i = 0; i < coder_ids.length; i++) {
      (function(i) {
        coderNames[i] = coder_ids[i].toLowerCase();
        if (online.indexOf(coderNames[i]) >= 0) return;
        var queryUrl = "https://api.twitch.tv/kraken/users/" + coderNames[i];
        // console.log(queryUrl);
        // $('#offline').html(makeJSONTable(obj,"Online Users"));
        $.ajax({
            url: queryUrl,
            dataType: "jsonp",
            type: "POST",
        })
        .done(function(obj, status, jqXHR) {
          // console.log(obj);
          if (obj === null) {
            return;
          }
          coderIcons[i] = obj.logo;
          if (coderIcons[i] === null) {
            coderIcons[i] = "http://www.clker.com/cliparts/d/L/P/X/z/i/no-image-icon-th.png";
          }
          coderStatus[i] = '<i class="fa fa-exclamation"></i>';
          // console.log(obj, coderIcons[i]);
          $('.coders').append('\n' +
            '<tr class="offline">\n' +
            '   <td> <img  class="coder-img" src="'+ coderIcons[i] + '" /> </td>\n' +
            '   <td> ' + coderNames[i] + ' </td>' +
            '   <td> ' + coderStatus[i] + ' </td>' +
            '</tr>\n');
        })
        .fail(function(jqXHR, status, errorThrown) {
          alert("Sorry - Twitch is unavailable");
          console.log("getJSON status = " + status + " for " + url);
          throw errorThrown;
        })
        .always(function(obj, status, jqXHR) {
        });
      })(i) ;
     }
  }

  // Use API to search for Games = "Programming"
  // curl -H 'Accept: application/vnd.twitchtv.v3+json' \
  // -X GET https://api.twitch.tv/kraken/search/games?q=star&type=suggest
  // This doesn't look as straightforward as I'd hoped
  function getProgramming() {
    $.ajax({
        url: "https://api.twitch.tv/kraken/streams/eswc",
        type: "GET",
        dataType: "jsonp",
    })
    .done(function(data, textStatus, jqXHR) {
      console.log("HTTP Request Succeeded: " + jqXHR.status);
      // console.log(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log("HTTP Request Failed");
      console.log(jqXHR);
      console.log(errorThrown);
    })
    .always(function() {
      //data|jqXHR, textStatus, jqXHR|errorThrown
      findOnline();
      findOffline();
    });
  }

  function makeJSONTable(obj, heading) {
    /* This returns HTML for a nested table of JSON data. 
    Use Bootstrap, if available.  If not, use css */
    var bootstrap_enabled = (typeof $().modal === 'function');
    var tableBody = "";
    if (heading !== undefined) {
      tableBody += '<h4 style="background-color:white;color:black">' + heading + '</h4>';
    }
    if (obj === null) {
      return tableBody;
    }
    if (bootstrap_enabled) {
      tableBody += '<table class="table table-striped table-bordered">\n';
    } else {
      tableBody += '<table style="background-color:white;color:black;border-collapse:collapse">\n';
    }
    $.each(obj, function(k, v) {
      if (bootstrap_enabled) {
        tableBody += '<tr><td>' + k + '</td><td>';
      } else {
        tableBody += '<tr style="background-color:white;color:black;border:1px solid black">'
                  +  '<td style="background-color:white;color:black;border:1px solid black">' 
                  + k + '</td><td>';
      }
      if (typeof v !== "object") {
        tableBody += v;
      } else {
        tableBody += makeJSONTable(v);
      }
    });
    tableBody += '</td></tr></table>';
    return tableBody; 
  }


/*
  function getFCC() {
    $.ajax({
        url: "https://api.twitch.tv/kraken/streams/eswc",
        type: "GET",
        dataType: "jsonp",
    })
    .done(function(data, textStatus, jqXHR) {
      console.log("HTTP Request Succeeded: " + jqXHR.status);
      // console.log(data);
      if (data.stream === null) {
        $('h3').html('<h3><span class="monospace">freeCodeCamp</span> is offline</h3>');
        return;
      }  
      channelUrl = data.stream.channel.url;
      displayName = data.stream.channel.display_name;
      online.push(displayName.toLowerCase());
      game = data.stream.game;
      $('h3').html('<h3><span class="monospace text-primary">' + displayName + '</span> is <a href="' + channelUrl + '" target="_blank">online!</a></h3>');
      viewers = data.stream.viewers;
      fps =  Math.round(data.stream.average_fps);
      // preview = data.stream.preview.small;
      $('.details').html('<span class="monospace">' + displayName + '</span> currently has ' + viewers + ' viewers and is running ' + game + ' at ' + fps + ' frames per second.');
      // $('.preview').html('<a href="' + channelUrl +'"><img class="img-responsive" src="' + preview + '" alt=Snapshot preview of "' + game + '" /></a>');
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log("HTTP Request Failed");
      console.log(jqXHR);
      console.log(errorThrown);
    })
    .always(function() {
      //data|jqXHR, textStatus, jqXHR|errorThrown
      findOnline();
      findOffline();
    });
  }
*/

}); 


