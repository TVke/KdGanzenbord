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
			}/* ,
			unsubscribe: function(callback) {
				for (let i = 0, ilen = _self.subs.length; i < ilen; ++i) {
					if (_self.subs[i] === callback) {
						_self.subs.splice(i, 1);
					}
				}
			}*/
		};
		return _self.methods;
	};
var gameView = {
	playerAmount: document.getElementById("playerAmount"),
	startButton: document.querySelector("#begin button"),
	diceContainer: document.getElementById("dices"),
	dices: document.querySelectorAll("#dices div"),
	pawns: document.querySelectorAll("div[id^='pawn-']"),
	tiles: document.querySelectorAll("#board div"),
	players: document.querySelectorAll("#players div"),
	playerNames: document.querySelectorAll("#players span"),
	playerButtons: document.querySelectorAll("#players div button"),
	endMessage: document.querySelector("#end p")
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
		for (let i = 0, pawnsLength = gameModel.pawns.length; i < pawnsLength; ++i) {
			// alles behalven de te verplaatsen pion
			if (i != pawnId) {
				if (gameModel.pawns[i].publish() == place) {
					gameView.pawns[i].classList.add("temp");
/*
					setTimeout(function(){
						if(typeof gameModel.tempPos.publish() === "undefined"){
							gameView.pawns[pawnId].publish(1);
						}else{
							gameView.pawns[pawnId].publish(gameModel.tempPos.publish());
						}
						gameView.pawns[i].classList.toggle("temp");
					}, 700);
*/
					setTimeout(function() {
						var tempP = gameModel.tempPos.publish();
						if (tempP <= 63 && tempP >= 1) {
							gameView.pawns[pawnId].className = "place-" + tempP;
						} else if (tempP > 63) {
							gameView.pawns[pawnId].className = "place-63";
							setTimeout(function() {
								gameView.pawns[pawnId].className = "place-" + (63 - (parseInt(place) - 63));
							}, 700);
						} else if (tempP < 0) {
							gameView.pawns[pawnId].className = "place-1";
						}
						gameView.pawns[pawnId].classList.toggle("temp");
					}, 700);
				}
			}
		}
		if (place <= 63 && place >= 1) {
			gameView.pawns[pawnId].className = "place-" + place;
		} else if (place > 63) {
			gameView.pawns[pawnId].className = "place-63";
			setTimeout(function() {
				gameView.pawns[pawnId].className = "place-" + (63 - (parseInt(place) - 63));
			}, 700);
		} else if (place < 1) {
			gameView.pawns[pawnId].className = "place-1";
		}
	},
	startRules: function(data) {
		switch (gameModel.dices[0].publish()) {
		case 3:
			if (gameModel.dices[1].publish() == 6) {
				gameModel.pawns[gameModel.activePlayer.publish()].publish(26);
			}
			break;
		case 4:
			if (gameModel.dices[1].publish() == 5) {
				gameModel.pawns[gameModel.activePlayer.publish()].publish(53);
			}
			break;
		case 5:
			if (gameModel.dices[1].publish() == 4) {
				gameModel.pawns[gameModel.activePlayer.publish()].publish(53);
			}
			break;
		case 6:
			if (gameModel.dices[1].publish() == 3) {
				gameModel.pawns[gameModel.activePlayer.publish()].publish(26);
			}
			break;
		default:
			gameController.rules(data);
			break;
		}
	},
	rules: function(data) {
		var testRules = true;
		// check de ganzen
		for (let i = 0, ilen = gameModel.geese.length; i < ilen; ++i) {
			if (gameModel.geese[i] == data) {
				setTimeout(function() {
					gameModel.pawns[gameModel.activePlayer.publish()].publish(data + gameModel.currentThrow.publish());
				}, 700);
				testRules = false;
				break;
			}
		}
		var playerId = gameModel.activePlayer.publish();
		if (testRules) { // pas de regels toe
			switch (data) {
			case 6:
				gameModel.pawns[playerId].publish(12);
				break;
			case 19:
				console.log("skipturn");
				gameController.skipTurn(gameModel.activePlayer.publish());
				break;
			case 31:
				console.log("stickyPlace31");
				gameController.stickyPlace(gameModel.activePlayer.publish(), 31);
				break;
			case 42:
				gameModel.pawns[playerId].publish(39);
				break;
			case 52:
				console.log("stickyPlace52");
				gameController.stickyPlace(gameModel.activePlayer.publish(), 52);
				break;
			case 58:
				gameModel.pawns[playerId].publish(0);
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
	skipTurn: function() { // Een beurt overslaan
		gameController.nextPlayer();
	},
	stickyPlace: function() { // Wie hier komt moet er blijven tot een andere speler er komt. Degene die er het eerst was speelt dan verder.
		gameController.skipTurn()
	},
	nextPlayer: function() {
		var activeID = gameModel.activePlayer.publish();
		//volgende speler activeren
		if (activeID < (gameModel.players.length - 1)) {
			gameView.playerButtons[++activeID].removeAttribute('disabled');
		} else {
			gameModel.activePlayer.publish(0);
			gameView.playerButtons[0].removeAttribute('disabled');
		}
	},
	win: function() {
		var winnerName = gameView.playerNames[gameModel.activePlayer.publish()].innerHTML;
		gameView.endMessage.innerHTML = winnerName;
	}
};
var gameConnector = {
	dices: function(DOMElement) {
		var dice = new Observable();
		dice.subscribe(function(data) {
			DOMElement.className = "rolled-" + data;
		});
		return dice;
	},
	pawns: function(DOMElementId) {
		var pawn = new Observable();
		pawn.publish(0);
		pawn.subscribe(function(data) {
			if (data != 9) {
				gameController.movePawn(DOMElementId, data);
				setTimeout(function() {
					gameController.rules(data);
				}, 700);
			} else {
				gameController.movePawn(DOMElementId, data);
				setTimeout(function() {
					gameController.startRules(data);
				}, 700);
			}
		});
		return pawn;
	}
};
var gameSetup = {
	players: function(players, namen = ["Speler 1", "Speler 2", "Speler 3", "Speler 4"]) {
		// loopt het aantal meespelende spelers
		for (let i = 0; i < players; ++i) {
			// player = het DOM element met id player-1,2,3,4,...
			var player = gameView.players[i];
			// haalt de classe hidden weg
			player.removeAttribute("class");
			//zet de naam in de array bij de Models
			gameModel.players.push(namen[i]);
			// zet de namen in de view
			gameView.playerNames[i].innerHTML = namen[i];
			// button functionaliteit
			var playerButton = gameView.playerButtons[i];
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
				gameModel.geese.push(++goosespaceOne);
				gameModel.geese.push(++goosespaceTwo);
			} else {
				var goosespaceTree = goosespace - 4;
				gameView.tiles[--goosespaceTree].classList.add("goose");
				gameModel.geese.push(++goosespaceTree);
			}
		}
	}
};
// eerst aangeroepen functie
var init = function() {
		gameSetup.goose();
		gameSetup.dices(2);
/*
		gameView.startButton.addEventListener("click",function(){
			var PlayerAmount = gameView.playerAmount.value;
			gameSetup.players(PlayerAmount);
			gameSetup.pawns(PlayerAmount);
		});
*/
		var PlayerAmount = gameView.playerAmount.value;
		gameSetup.players(PlayerAmount);
		gameSetup.pawns(PlayerAmount);
}();