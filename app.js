
(function() {

  var channels = {};
  var teams = {};

  // get teams and channels
  var loadChannelMap = function(next) {
    var _id = "562fefe0d63d393f2a8712ef";
    $.ajax({
      dataType: 'json',
      url: 'https://lessthan3.firebaseio.com/objects/' + _id + '/data.json',
      error: function() {
        return next(false);
      },
      success: function (data) {
        var index;

        for(index in (data.channels || [])) {
          var channel = data.channels[index];
          channels[channel.name] = channel.url;
        }

        for (index in (data.teams || [])) {
          var team = data.teams[index];
          teams[team.name] = team.url;
        }
        return next(true);
      }
    });
  };

  // run the app
  var run = function() {

    // check for team pages
    // they don't use the ember app
    if(team_regex.exec(document.location.href)) {
      route('team.index');
    }

    // other parts of the site use the ember app
    else {
      if(window.App) {
        var app, name;

        // listen for page loads
        app = App.__container__.lookup('controller:application');
        app.addObserver('currentRouteName', function() {

          // wait for Ember's event loop so the document url is updated
          Ember.run.next(function(){
            name = app.get('currentRouteName');
            route(name);
          });
        });

        // fire initial route
        name = app.get('currentRouteName');
        route(name);
      }
      else {
        setTimeout(run, 100);
      }
    }
  }

  // on page routing, take action
  var route = function(name) {

    // reset styling
    resetStyles();

    var href = document.location.href;

    switch(name) {

      // video on demand
      case 'archive':

        /* not supported
        var matches = vod_regex.exec(href);
        if(matches) {
          var video_id = matches[3];
          var code = 't-b' + video_id;
          embedPlayerByCode(code);
        } */
        break;

      // main channel pages
      case 'channel.index':
        var matches = channel_regex.exec(href);
        if(matches) {
          var name = matches[1];
          var embed_url = channels[name];
          if(embed_url) {
            embedChannelByUrl(embed_url);
          }
          else {
            /* non-mapped channels not supported
            var code = 'tl-' + name;
            embedPlayerByCode(code);
            */
          }
        }
        break;

      // video on demand
      case 'chapter':

        /* not supported
        var matches = vod_regex.exec(href);
        if(matches) {
          var video_id = matches[3];
          var code = 't-c' + video_id;
          embedPlayerByCode(code);
        } */
        break;

      // loading view
      case 'loading':
        break;

      // team index pages
      case 'team.index':
        var matches = team_regex.exec(href);
        if(matches) {
          var name = matches[1];
          var embed_url = teams[name];
          if(embed_url) {
            embedTeam(embed_url);
          }
        }
        break;

      // channel profile pages
      case 'user.channel.profile.index':
        break;

      // video on demand pages
      case 'vod':

        /* not supported
        var matches = vod_regex.exec(href);
        if(matches) {
          var video_id = matches[3];
          var code = 't-v' + video_id;
          embedPlayerByCode(code);
        } */
        break;
    }
  }

  // http://www.twitch.tv/deadmau5
  var channel_regex = /twitch.tv\/([^\#\&\?\/]*)$/;

  // http://www.twitch.tv/team/esl
  var team_regex = /twitch.tv\/team\/([^\#\&\?\/]*)$/;

  // http://www.twitch.tv/deadmau5/v/20476473
  var vod_regex = /twitch.tv\/([^\#\&\?\/]*)\/([b|c|v])\/([^\#\&\?\/]*)$/;

  // embed maestro channel into the page
  var embedChannelByUrl = function(embed_url) {

    var $el = $('#player');
    if($el.length > 0) {
      $('.app-main').addClass('maestro-site');

      // inject site into main column
      var $iframe = $("<iframe>");
      $iframe.attr('id', 'maestro-embed');
      $iframe.attr("src", embed_url);
      $iframe.attr("width", "100%");
      $iframe.attr("height", $(window).height());
      $iframe.attr("frameborder", "0");
      $iframe.css("height", $(window).height() + 'px');
      $el.html($iframe);
    }
    else {
      setTimeout(function() {
        embedChannelByUrl(embed_url);
      }, 100);
    }
  }

  // embed maestro player into the page by video code
  var embedPlayerByCode = function(code) {

    var $el = $('#player');
    if($el.length > 0) {
      $('.app-main').addClass('maestro-player');

      var $iframe = $("<iframe>");
      $iframe.attr('id', 'maestro-embed');
      $iframe.attr("src", "http://www.maestro.io/twitch?embed=true&v=" + code);
      $iframe.attr("height", "100%");
      $iframe.attr("width", "100%");
      $iframe.attr("frameborder", "0");
      $el.html('');
      $el.append($iframe);
    }
    else {
      setTimeout(function() {
        embedPlayerByCode(code);
      }, 100);
    }
  }

  // embed maestro channel into the team page
  var embedTeam = function(embed_url) {

    // inject site into main column
    var $iframe = $("<iframe>");
    $iframe.attr("src", embed_url);
    $iframe.attr("width", "100%");
    $iframe.attr("height", "100%");
    $iframe.attr("frameborder", "0");
    var $el = $('.main.team');
    $el.html($iframe);
    $el.css('margin', '0');
    $el.css('padding', '0');
    $el.css('height', $(window).height() - 60);
    $el.css('width', '100%');
  }

  // reset modified styling
  var resetStyles = function() {
    $('.app-main').removeClass('maestro-site');
    $('.app-main').removeClass('maestro-player');
  }

  // start
  loadChannelMap(function(success) {
    if(success) {
      run();
    }
  });

})();
