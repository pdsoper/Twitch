$(document).ready(function() {
  var coder_ids = ["freecodecamp", "MedryBW", "storbeck", "terakilobyte", "habathcx","RobotCaleb","comster404","brunofin","thomasballinger","noobs2ninjas","beohoff"];
  
  var coderStatus = [];
  var coderNames = [];
  var coderIcons = [];
  var online = [];
  var coders = [];

  getOnLine(true);

  $('#all').click(function(event) {
    $('.coders').html("");
    $('.coders').html(makeTable(coders));
    $('.arrow-all').css("visibility", "visible");
    $('.arrow-on').css("visibility", "hidden");
    $('.arrow-off').css("visibility", "hidden");
  })

  $('#online').click(function(event) {
    $('.coders').html("");
    $('.coders').html(makeTable(coders.filter(function(a) { return a.online; })));
    $('.arrow-all').css("visibility", "hidden");
    $('.arrow-on').css("visibility", "visible");
    $('.arrow-off').css("visibility", "hidden");
  })

  $('#offline').click(function(event) {
    $('.coders').html("");
    $('.coders').html(makeTable(coders.filter(function(a) { return !a.online; })));
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
      // console.log(obj.streams);
      // $('#online').html(makeJSONTable(obj,"Online Users"));
      coders = obj.streams.map(function(current, index, array) {
        var coderName = current.channel.display_name.toLowerCase();
        var coderIcon = current.channel.logo;  
        var status = current.channel.status;
        var channelUrl = current.channel.url;
        online.push(coderName);
        if (coderIcon === null) {
          coderIcon = "http://www.clker.com/cliparts/d/L/P/X/z/i/no-image-icon-th.png";
        }
        return {
          name: coderName,
          icon: coderIcon,
          status: current.channel.status,
          url: current.channel.url,
          online: true,
        };
      });
      if (true) {
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
        // $('#offline').html(makeJSONTable(obj,"Offline Users"));
        $.ajax({
            url: queryUrl,
            dataType: "jsonp",
            type: "POST",
        })
        .done(function(obj, status, jqXHR) {
          if (obj === null) {
            return;
          }
          coderIcons[i] = obj.logo;
          if (coderIcons[i] === null) {
            coderIcons[i] = "http://www.clker.com/cliparts/d/L/P/X/z/i/no-image-icon-th.png";
          }
          coders = coders.concat([{
            name: coderNames[i],
            icon: coderIcons[i],
            status: "",
            url: "",
            online: false,
          }]);
          // console.log(coders);
          $('.coders').html(makeTable(coders));
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

  function makeTable(arr) {
    return arr.reduce(function(previous, current, index, array) {
      var tr = 
        '<tr>\n' +
        '   <td> <img class="coder-img" src="'+ current.icon + '" /> </td>\n' +
        '   <td>' + current.name;
      if (current.online) {
        tr += '<span class="details">' + current.status + '</span></td>' +
        '   <td> <a href="' + current.rl + '" target="_blank">' +
        '   <strong><i class="fa fa-check"></i> </strong></a> </td>' +
        '</tr>\n';
      } else {
        tr += '</td><td><strong><i class="fa fa-exclamation"></i> </strong> </td>' +
        '</tr>\n';  
      }
      return previous + tr;
    },'');
  }
  

  /* Consider using an API to search for Games = "Programming"
  in order to populate the initial list.
  This doesn't look as straightforward as I'd hoped, since "program" a
  and "programming" return a lot of false hits */
  
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

}); 
