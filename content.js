$('body').append('<div class="achievibit-container"><div class="tits"></div></div>');
var currentLoggedInUser = $('#user-links img.avatar').attr('alt').replace('@', '');
var socket;
var server = 'https://achievibit.herokuapp.com/';
if (currentLoggedInUser) {
 	socket = io(server, { query: 'githubUsername=' + currentLoggedInUser });

 	socket.on(currentLoggedInUser, function(achievement) {
    var id = guid();
		console.log('got new achievement!!!', achievement);
		$('.achievibit-container').append([
    			'<div class="achievement-banner animated" id="', id, '">',
	        		'<div class="achievement-loader"></div>',
	        		'<div class="achievement-loader"></div>',
	        		'<div class="achievement-loader"></div>',
	        		'<div class="achievement-loader"></div>',
	        		'<div class="achievement-loader"></div>',
	        		'<div class="achievement-trophy" style="overflow: hidden;">',
	        			'<img src="', server, '/images/unlocked.png', '">',
	        		'</div>',
	        		'<div class="achievement-text">',
	            		'<div class="achievement-notification"><span>Achievement Unlocked</span></div>',
	            		'<div class="achievement-name">',
	            			'<img src="', server, achievement.avatar, '">',
	            			'<span>', achievement.name, '</span>',
	            		'</div>',
	        		'</div>',
    			'</div>'
		].join(''));

		setTimeout( function() {
      $('.achievibit-container #' + id).remove()
    }, 8.2 * 1000 );

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
	});
}

var getUrlParams = window.location.href.replace(window.location.origin + '/', '');

getUrlParams = getUrlParams.endsWith('/') ? getUrlParams.slice(0, -1) : getUrlParams;

var isUserProfile = getUrlParams !== '' && getUrlParams.split('/').length === 1;

var getParent = $( "[itemtype='http://schema.org/Person']" );

var username = getParent.find("[itemprop='additionalName']").text() || getUrlParams;

if (isUserProfile && getParent && getParent.length > 0) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", server + "raw/" + username, true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    // JSON.parse does not evaluate the attacker's scripts.
	    var resp = JSON.parse(xhr.responseText);

	    getParent.append([
			'<div class="border-top py-3 clearfix achievibit">',
				'<h2 class="mb-1 h4">Achievements</h2>',
			'</div>'
		].join(''));

		var achievibit = $('.achievibit');
		if (resp && resp.achievements) {
			for (var i = 0; i < resp.achievements.length; i++) {

				achievibit.append([
					'<a target="_blank" href="', server, username, '" aria-label="' + resp.achievements[i].short + '" class="tooltipped tooltipped-n avatar-group-item" itemprop="follows">',
						'<img alt="Start using achievements" class="avatar" height="35" src="' + (resp.achievements[i].avatar.startsWith('images/achievements') ? server : '') + resp.achievements[i].avatar + '" width="35">',
						'<span style="margin-left: 5px">' + resp.achievements[i].name + '</span>',
					'</a>'
				].join(''));
			}
		} else {
			achievibit.append([
				'<span>No achievements yet</span>'
			].join(''));
		}

	  }
	}
	xhr.send();
}
