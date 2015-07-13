$(document).ready(function() {
  var coder_ids = ["nightblue3", "freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","comster404","brunofin","thomasballinger","noobs2ninjas","beohoff"];
  var url = "https://api.twitch.tv/kraken/streams/freecodecamp";
  // var url = "https://api.twitch.tv/kraken/streams/lirik";
  var channelUrl, game, viewers, fps, preview, displayName;
  
  var coderStatus = [];
  var coderNames = [];
  var coderIcons = [];
  var online = [];

  getFCC();

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

  function findOnline() {
    var queryUrl = "https://api.twitch.tv/kraken/streams?channel=" + coder_ids.join(",");
    $.ajax({
      url: queryUrl,
      type: "POST",
      dataType: "jsonp",
    })
    .done(function(obj, status, jqXHR) {
      var streams = obj["streams"];
      if (streams === null) {
        return;
      }
      // console.log(obj);
      for (var i = 0; i < streams.length; i++) {
        var coderName = streams[i].channel.display_name.toLowerCase();
        online.push(coderName);
        var coderIcon = streams[i]["channel"]["logo"];  
        if (coderIcon === null) {
          coderIcon = "http://www.clker.com/cliparts/d/L/P/X/z/i/no-image-icon-th.png";
        }
        var coderPreview = streams[i]["preview"]["small"];
        channelUrl = streams[i]["channel"]["url"];
        $('.coders').append('\n' +
          '<tr>\n' +
          '   <td> <img  class="img-circle" width=50px height=50px src="'+ coderIcon + '" /> </td>\n' +
          '   <td> ' + coderName + '<span class="details">This is a footnote la di dah di dah rum tum tiddle um tum</span></td>' +
          '   <td> <a href="' + channelUrl + '" target="_blank"> <span class="text-success"> <strong><i class="fa fa-check"></i> </strong></span></a> </td>' +
          '</tr>\n');
      };
    })
    .fail(function(jqXHR, status, errorThrown) {
      alert("Sorry - Twitch is unavailable");
      console.log("getJSON status = " + status + " for " + url);
      throw errorThrown;
    })
    .always(function(obj, status, jqXHR) {
    });
  }

  function findOffline() {
    for (var i = 0; i < coder_ids.length; i++) {
      (function(i) {
        coderNames[i] = coder_ids[i].toLowerCase();
        if (online.indexOf(coderNames[i]) >= 0) return;
        var queryUrl = "https://api.twitch.tv/kraken/users/" + coderNames[i];
        // console.log(queryUrl);
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
            '<tr>\n' +
            '   <td> <img  class="' + coderNames[i] +' -icon img-circle" width=50px height=50px src="'+ coderIcons[i] + '" /> </td>\n' +
            '   <td> <span class="' + coderNames[i] + '-name">' + coderNames[i] + '</span> </td>' +
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

}); 


