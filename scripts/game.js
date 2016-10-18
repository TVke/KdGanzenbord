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
	geese: [],
	tempPos: new Observable(),
	activePlayer: new Observable(),
	currentThrow: new Observable()
};
var gameController = {
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
		// save temp data
		gameModel.tempPos.publish(currentPlace);
		gameModel.activePlayer.publish(activePlayerId);
		gameModel.currentThrow.publish(totalThrow);
	},
	movePawn: function(pawnId, place) {
		for (let i = 0, ilen = gameModel.pawns.length; i < ilen; ++i) {
			if (i != pawnId) {
				if (gameModel.pawns[i].publish() == place) {
					gameView.pawns[pawnId].classList.add("temp");
					setTimeout(function() {
						var tempP = gameModel.tempPos.publish();
						if (tempP <= 63 && tempP >= 1) {
							gameView.pawns[pawnId].className = "place-" + tempP;
						} else if (tempP < 63) {
							gameView.pawns[pawnId].className = "place-63";
							setTimeout(function() {
								gameView.pawns[pawnId].className = "place-" + (63 - (parseInt(place) - 63));
							}, 1000);
						} else if (tempP < 1) {
							gameView.pawns[pawnId].className = "place-1";
						}
						gameView.pawns[pawnId].classList.toggle("temp");
					}, 1000);
				}
			}
		}
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
	startRules: function() {
		if (typeof gameModel.tempPos !== "undefined" && gameModel.tempPos.publish() == 1) {
			switch (gameModel.dices[0].publish()) {
			case 3:
				if (gameModel.dices[1].publish() == 6) {
					gameController.movePawn(gameModel.activePlayer.publish(), 26);
				}
				break;
			case 4:
				if (gameModel.dices[1].publish() == 5) {
					gameController.movePawn(gameModel.activePlayer.publish(), 53);
				}
				break;
			case 5:
				if (gameModel.dices[1].publish() == 4) {
					gameController.movePawn(gameModel.activePlayer.publish(), 53);
				}
				break;
			case 6:
				if (gameModel.dices[1].publish() == 3) {
					gameController.movePawn(gameModel.activePlayer.publish(), 26);
				}
				break;
			}
		}
	},
	rules: function(data) {
		var testRules = true;
		// check de ganzen
		for (let i = 0, ilen = gameModel.geese.length; i < ilen; ++i) {
			if (gameModel.geese[i] == data) {
				// checkt maar 1 keer te fixen als er meer keren mmoet gecheckt worden ----------->  belangrijk to do
				setTimeout(function() {
					gameModel.pawns[gameModel.activePlayer.publish()].publish(data + gameModel.currentThrow.publish());
				}, 1000);
				testRules = false;
				break;
			}
		}
		var playerId = gameModel.activePlayer.publish();
		if (testRules) { // pas de regels toe
			switch (data) {
			case 6:
				gameModel.pawns[playerId].publish(12);
				//gameController.nextPlayer();
				break;
			case 19:
				console.log("skipturn");
				// Een beurt overslaan
				gameController.skipTurn(gameModel.activePlayer.publish());
				gameController.nextPlayer();
				break;
			case 31:
				// Wie hier komt moet er blijven tot een andere speler er komt. Degene die er het eerst was speelt dan verder.
				console.log("stickyPlace31");
				gameController.stickyPlace(gameModel.activePlayer.publish(), 31);
				gameController.nextPlayer();
				break;
			case 42:
				gameModel.pawns[playerId].publish(39);
				//gameController.movePawn(gameModel.activePlayer.publish(), 39);
				//gameController.nextPlayer();
				break;
			case 52:
				console.log("stickyPlace52");
				gameController.stickyPlace(gameModel.activePlayer.publish(), 52);
				gameController.nextPlayer();
				break;
			case 58:
				gameModel.pawns[playerId].publish(1);
				//gameController.movePawn(gameModel.activePlayer.publish(), 1);
				//gameController.nextPlayer();
				break;
			case 63:
				console.log("win");
				gameController.win();
				break;
			default:
				gameController.nextPlayer();
				break;
			}
		}
	},
	skipTurn: function() {
		console.log("skipTurn");
		gameController.nextPlayer();
	},
	stickyPlace: function() {
		console.log("stickyPlace 31 of 52");
		gameController.skipTurn()
	},
	nextPlayer: function() {
		var activeID = gameModel.activePlayer.publish();
		//volgende speler activeren
		if (activeID < (gameModel.players.length-1)) {
			gameView.playerButtons[++activeID].removeAttribute('disabled');
		} else {
			gameModel.activePlayer.publish(0);
			gameView.playerButtons[0].removeAttribute('disabled');
		}
	},
	win: function() {
		var winner = gameModel.activePlayer.publish();
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
			setTimeout(gameController.startRules, 1000);
		});
		return dice;
	},
	pawns: function(DOMElementId) {
		var pawn = new Observable();
		pawn.publish(1);
		pawn.subscribe(function(data) {
			gameController.movePawn(DOMElementId, data);
			setTimeout(function() {
				gameController.rules(data);
			}, 1000);
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
		for (let goosespace = 9; goosespace <= 63; goosespace += 9) {
			if (goosespace != 63) {
				var goosespaceOne = goosespace - 4;
				var goosespaceTwo = goosespace;
				gameView.tiles[--goosespaceOne].classList.add("goose");
				gameView.tiles[--goosespaceTwo].classList.add("goose");
				gameModel.gooses.push(++goosespaceOne);
				gameModel.gooses.push(++goosespaceTwo);
			} else {
				var goosespaceOne = goosespace - 4;
				gameView.tiles[--goosespaceOne].classList.add("goose");
				gameModel.gooses.push(++goosespaceOne);
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