var Observable = function() {
		var _self = this;
		_self.data;
		_self.subs = [];
		_self.methods = {
			publish: function(newData) {
				if (typeof newData !== 'undefined') {
					_self.data = newData;
					for (let i = 0, ilen = _self.subs.length; i < ilen; ++i) {
						_self.subs[i](_self.data);
					}
				} else {
					return _self.data;
				}
			},
			subscribe: function(callback) {
				if (_self.subs.indexOf(callback) === -1) {
					_self.subs.push(callback);
				}
			},
			unsubscribe: function(callback) {
				for (let i = 0, ilen = _self.subs.length; i < ilen; ++i) {
					if (_self.subs[i] === callback) {
						_self.subs.splice(i, 1);
					}
				}
			}
		};
		return _self.methods;
	};
var gameView = {
	playerAmount: document.getElementById("playerAmount"),
	diceContainer: document.getElementById("dices"),
	dices: document.querySelectorAll("#dices div"),
	pawns: document.querySelectorAll("div[id^='pawn-']"),
	tiles: document.querySelectorAll("#board div"),
	players: document.querySelectorAll("#players div"),
	playerButtons: document.querySelectorAll("#players div button")
};
var gameModel = {
	dices: [],
	pawns: [],
	tiles: [],
	players: [],
	gooses: []
};
var gameController = {
	testRules: function() {
		console.log("test");
	},
	movePawn: function(pawnId, place) {
		for (let i = 0, ilen = gameModel.pawns.length; i < ilen; ++i) {
			if (i != pawnId) {
				if (gameModel.pawns[i].publish() == place) {
					console.log("test");
				}
			}
		}
		console.log(place);
		if (place <= 63 && place >= 1) {
			gameView.pawns[pawnId].className = "place-" + place;
		} else if (place < 63) {
			gameView.pawns[pawnId].className = "place-63";
			setTimeout(function() {
				gameView.pawns[pawnId].className = "place-" + (63 - (parseInt(place) - 63));
			}, 1000);
		} else if (place < 1) {
			gameView.pawns[pawnId].className = "place-1";
		}
	},
	rollDices: function() {
		var activePlayerId;
		for (let i = 0, ilen = gameView.playerButtons.length; i < ilen; ++i) {
			if (gameView.playerButtons[i].disabled == false) {
				activePlayerId = i;
			}
		}
		var totalThrow = 0;
		for (let i = 0, ilen = gameModel.dices.length; i < ilen; ++i) {
			var randomNumber = Math.floor((Math.random() * 6) + 1);
			gameModel.dices[i].publish(randomNumber);
			totalThrow += randomNumber;
		}
		// toon dice container
		gameView.diceContainer.removeAttribute("class");
		// disable after button press
		gameView.playerButtons[activePlayerId].setAttribute('disabled', '');
		var currentPlace = gameModel.pawns[activePlayerId].publish();
		gameModel.pawns[activePlayerId].publish(currentPlace + totalThrow);
	},
	nextPlayer: function(index) {
		// maak de dobbel stenen weer onzichtbaar
/*
		gameView.diceContainer.setAttribute("class", "hidden");
		// checkt dat het niet de laatste player is
		if (index < gameModel.players.length) {
			gameView.players[index].querySelector("button").setAttribute('disabled', 'disabled');
			gameView.players[++index].querySelector("button").removeAttribute('disabled');
		} else {
			gameView.players[index].querySelector("button").setAttribute('disabled', 'disabled');
			gameView.players[0].querySelector("button").removeAttribute('disabled');
		}
*/
	}
};
var gameConnector = {
	players: function() {
		var player = new Observable();
		// bij een publish met een index nummer van de volgende speler wordt deze functie uitgevoerd
		player.subscribe(gameController.nextPlayer);
		return player;
	},
	dices: function(DOMElement) {
		var dice = new Observable();
		dice.subscribe(function(data) {
			DOMElement.className = "rolled-" + data;
			//gameController.testRules();
			
		});
		return dice;
	},
	pawns: function(DOMElementId) {
		var pawn = new Observable();
		pawn.publish(1);
		pawn.subscribe(function(data) {
			gameController.movePawn(DOMElementId, data);
		});
		return pawn;
	}
};
var gameSetup = {
	players: function(players) {
		// loopt het aantal meespelende spelers
		for (let i = 0; i < players; ++i) {
			// player = het DOM element met id player-1,2,3,4,...
			var player = gameView.players[i];
			// haalt de classe hidden weg
			player.removeAttribute("class");
			// maakt Observable object
			var newPlayer = gameConnector.players();
			//zet de Observable in de array bij de Models
			gameModel.players.push(newPlayer);
			// button functionaliteit
			playerButton = gameView.playerButtons[i];
			playerButton.addEventListener("click", function() {
				gameController.rollDices();
			});
			// maakt eerste button klikbaar
			if (i == 0) {
				playerButton.removeAttribute("disabled");
			}
		}
	},
	dices: function(dices) {
		for (let i = 0; i < dices; ++i) {
			var dice = gameView.dices[i];
			// Observable
			var newDice = gameConnector.dices(dice);
			gameModel.dices.push(newDice);
		}
	},
	pawns: function(players) {
		for (let i = 0; i < players; ++i) {
			var pawn = gameView.pawns[i];
			pawn.classList.toggle("hidden");
			// Observable
			var newPawn = gameConnector.pawns(i);
			gameModel.pawns.push(newPawn);
		}
	},
	goose: function() {
		for(let gooseSpace = 9; gooseSpace <= 63; gooseSpace += 9) {
			if(gooseSpace != 63) {
				var gooseSpaceOne = gooseSpace - 4;
				var gooseSpaceTwo = gooseSpace;
				gameView.tiles[--gooseSpaceOne].classList.add("goose");
				gameView.tiles[--gooseSpaceTwo].classList.add("goose");
			}
			else {
				var gooseSpaceOne = gooseSpace - 4;
				gameView.tiles[--gooseSpaceOne].classList.add("goose");
			}
		}
	}
};
// eerst aangeroepen functie  ------->  instellingen nog te regelen
var init = function() {
	gameSetup.goose();
	gameSetup.dices(2);
	
	// in addEventlistener
	var PlayerAmount = gameView.playerAmount.value;
	gameSetup.players(PlayerAmount);
	gameSetup.pawns(PlayerAmount);
}();
/* sander nog te implementeren
	
	
	
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
	var pawnPlaceClass = pawnElement.classList[1];
	var pawnPlaceNumber = parseInt(pawnPlaceClass.slice(pawnPlaceClass.indexOf("-") + 1));
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
		case 63 : overlayElement.classList.remove("hidden"); endElement.classList.remove("hidden");
			break;
	}
}

pawn.subscribe(function() {
	checkForGooseSpaces();
	checkForSpecialSpaces();
});

// Publishing
var lastPlaceClass = pawnElement.classList[1];
setInterval(function() {
	var placeClass = pawnElement.classList[1];
    if (placeClass !== lastPlaceClass) {
        pawn.publish(placeClass);
    }
}, 2000);
*/