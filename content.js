var currentLoggedInUser = $('#user-links img.avatar').attr('alt').replace('@', '');
//var socket;
var server = 'https://achievibit.herokuapp.com/';
// if (currentLoggedInUser) {
// 	socket = io(server);

// 	socket.on(currentLoggedInUser, function(achievement) {
// 		console.log('got new achievement!!!', achievement);
// 	});
// }

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
					'<a target="_blank" href="', server, getUrlParams, '" aria-label="' + resp.achievements[i].short + '" class="tooltipped tooltipped-n avatar-group-item" itemprop="follows">',
						'<img alt="Start using achievements" class="avatar" height="35" src="' + resp.achievements[i].avatar + '" width="35">',
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