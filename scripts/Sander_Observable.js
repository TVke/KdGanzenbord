function Observable() {
	var _self = this;
	_self.data;
	_self.subscribers = [];

	_self.methods = {
		subscribe : function(callback) {
			if(_self.subscribers.indexOf(callback) === -1) {
				_self.subscribers.push(callback);
			}
		},

		unsubscribe : function(callback) {
			if(_self.subscribers.indexOf(callback) > -1) {
				for(let subscribersIndex = 0; subscribersIndex < _self.subscribers.length; subscribersIndex++) {
		            if(_self.subscribers[subscribersIndex] === callback) {
		                _self.subscribers.splice(subscribersIndex, 1);
		                return;
	            	}
				}
			}
		},

		publish : function(data) {
			if(typeof data !== "undefined") {
				_self.data = data;
				for(let subscribersIndex = 0; subscribersIndex < _self.subscribers.length; subscribersIndex++) {
		            _self.subscribers[subscribersIndex](data);
		        }
			}
			else {
				return _self.data;
			}
		}
	}
	return _self.methods;
}
// Einde observable


var pawn = new Observable();
var pawnElement = document.getElementsByClassName("pawn-1")[0];

// Dummy dobbelsteenwaarde voor testdoeleinden
var totalDiceValue = 9;

var gooseSpaces = [];

// Array gooseSpaces vullen
for(let gooseSpace = 9; gooseSpace <= 63; gooseSpace += 9) {
	if(gooseSpace != 63) {
		gooseSpaces.push(gooseSpace - 4, gooseSpace);
	}
	else {
		gooseSpaces.push(gooseSpace - 4);
	}
}

function checkForGooseSpaces() {
	for(let gooseSpacesIndex = 0; gooseSpacesIndex < gooseSpaces.length; gooseSpacesIndex++) {
		var gooseSpace = gooseSpaces[gooseSpacesIndex];

		if(pawnElement.classList.contains("place-" + gooseSpace)) {
			movePawn(pawnElement, gooseSpace + totalDiceValue);
			return;
		}
	}
}

function checkForSpecialSpaces() {
	var pawnPlace = pawn.publish();
	var pawnPlaceNumber = parseInt(pawnPlace.slice(pawnPlace.indexOf("-") + 1));
	var overlayElement = document.getElementById("overlay");
	var endElement = document.getElementById("end");

	switch(pawnPlaceNumber) {
		case 6 : movePawn(pawnElement, 12);
			break;
		case 19 : // Een beurt overslaan
			break;
		case 31 : // Wie hier komt moet er blijven tot een andere speler er komt. Degene die er het eerst was speelt dan verder.
			break;
		case 42 : movePawn(pawnElement, 39);
			break;
		case 52 : // Wie hier komt moet er blijven tot een andere speler er komt. Degene die er het eerst was speelt dan verder.
			break;
		case 58 : movePawn(pawnElement, 1);
			break;
		case 63 : win();
			break;
	}
}

function win() {
	var pawnPlace = pawn.publish();
	var pawnPlaceNumber = parseInt(pawnPlace.slice(pawnPlace.indexOf("-") + 1));

	if(pawnPlaceNumber + totalDiceValue == 63) {
		overlayElement.classList.remove("hidden");
		endElement.classList.remove("hidden");
	}
}

pawn.subscribe(function() {
	checkForGooseSpaces();
	checkForSpecialSpaces();
});

// Publishing
var lastPlaceClass = pawnElement.classList[1];
var intervalID = setInterval(function() {
	var placeClass = pawnElement.classList[1];
    if (placeClass !== lastPlaceClass) {
        pawn.publish(placeClass);
    }
}, 2000);