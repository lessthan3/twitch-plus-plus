
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

    case 'channel.index':
      var matches = channel_regex.exec(href);
      if(matches) {
        var name = matches[1];
        var embed_url = channels[name];
        if(embed_url) {
          embedChannel(embed_url);
        }
        else {
          embedChannelPlayer(name);
        }
      }
      break;

    case 'loading':
      break;

    case 'team.index':
      var matches = team_regex.exec(href);
      if(matches) {
        var name = matches[1];
        var embed_url = teams[name];
        if(embed_url) {
          embedTeam(embed_url);
        }
      }
      break

    case 'user.channel.profile.index':
      break;
  
  }
}

// team map
teams = {
  'esl': 'http://live.esl-one.com'
};

// channel map
channels = {
  'capcomfighters': 'http://live.capcomprotour.com',
  'crosscountertv': 'http://www.crosscounter.tv',
  'deadmau5': 'http://live.deadmau5.com',
  'maestroio': 'http://www.maestro.io/webinar',
  'monstercat': 'http://live.monstercat.com',
  'wargamingasia': 'http://www.battleviewer.com/asia',
  'wgleagueru': 'http://www.battleviewer.com/russia',
  'wgleu': 'http://www.battleviewer.com/europe',
  'wglna': 'http://www.battleviewer.com'
};

// http://www.twitch.tv/deadmau5
var channel_regex = /twitch.tv\/([^\#\&\?\/]*)$/;

// http://www.twitch.tv/team/esl
var team_regex = /twitch.tv\/team\/([^\#\&\?\/]*)$/;

// embed maestro channel into the page
var embedChannel = function(embed_url) {

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
      embedChannel(embed_url);
    }, 100);
  }
}

// embed maestro channel player into the page
var embedChannelPlayer = function(name) {

  var $el = $('#player');
  if($el.length > 0) {
    $('.app-main').addClass('maestro-player');

    var $iframe = $("<iframe>");
    $iframe.attr('id', 'maestro-embed');
    $iframe.attr("src", "http://www.maestro.io/twitch?embed=true&v=tl-" + name);
    $iframe.attr("height", "100%");
    $iframe.attr("width", "100%");
    $iframe.attr("frameborder", "0");
    $el.html('');
    $el.append($iframe);
  }
  else {
    setTimeout(function() {
      embedChannelPlayer(name);
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
run();
