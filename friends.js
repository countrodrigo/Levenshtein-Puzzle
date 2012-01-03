
/*
@author Alain Rodriguez
@title Causes Puzzle
@description Determine the extended social network of a word. A word's friends
	are those words within a Levenshtein distance of 1, and	its extended network
	encompasses its friends, friend's friends, etc.
*/

var Fs = require('fs');

var usersAlphaSorted = [];

var getPossibleFriends = function(user){
	var letters = "abcdefghijklmnopqrstuvwxyz";
	var friends = [];

	for(var idx = 0; idx < user.length; ++idx){
		// Remove each letter
		friends.push(user.substring(0, idx) + user.substring(idx + 1));
		
		for(var letterIdx = 0; letterIdx < letters.length; ++letterIdx){
			// Modify each letter
			friends.push(user.substring(0, idx) + letters[letterIdx] + user.substring(idx + 1));
			// Add a letter around each letter
			friends.push(user.substring(0, idx) + letters[letterIdx] + user.substring(idx));
		}
	}
	// Add a letter at the end
	for(var letterIdx = 0; letterIdx < letters.length; ++letterIdx){
		friends.push(user + letters[letterIdx]);
	}

	return friends;
};

var getSocialNetworkSize = function(user){
	var searchSpace = {};
	var seeds = [];
	var matches = [user];

	var networkSize = 0;

	// Prepare the initial search space as a map
	usersAlphaSorted.forEach(function(user){
		searchSpace[user] = true;
	});

	do{
		seeds = matches;
		matches = [];

		seeds.forEach(function(seed){
			getPossibleFriends(seed).forEach(function(possibleFriend){
				if(searchSpace[possibleFriend]){
					networkSize++;
					matches.push(possibleFriend);
					delete searchSpace[possibleFriend];
				}
			});
		});

	}while(matches.length);

	return networkSize;
};

// Init the data structures
(function(){
	try{
		usersAlphaSorted = Fs.readFileSync("word.list", 'utf8').split('\n');
	}catch(ex){
		console.log("Failed to load the data file: %s", ex.message);
		process.exit(1);
	}
}());

// Actually find the network for 'causes'
(function(){
	console.time("networkSearch");
	var causesNetworkSize = getSocialNetworkSize("causes");
	console.timeEnd("networkSearch");

	console.log("Causes' network is %d large", causesNetworkSize);

	return;
}());
