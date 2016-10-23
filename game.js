var Observable = function() {
	var _self = this;
	_self.data;
	_self.subs = [];
	_self.methods = {
		publish: function (newData) {
			if (typeof newData !== 'undefined') {
				_self.data = newData;
				for (let i = 0, ilen = _self.subs.length; i < ilen; ++i) {
					_self.subs[i](_self.data);
				}
			} else {
				return _self.data;
			}
		},
		subscribe: function (callback) {
			if (_self.subs.indexOf(callback) === -1) {
				_self.subs.push(callback);
			}
		}
	};
	return _self.methods;
};
var gameView = {
	playerAmount: document.getElementById("playerAmount"),
	startButton: document.querySelector("#begin button"),
	dieContainer: document.getElementById("dice"),
	dice: document.querySelectorAll("#dice div"),
	pawns: document.querySelectorAll("div[id^='pawn-']"),
	tiles: document.querySelectorAll("#board div"),
	players: document.querySelectorAll("#players div"),
	playerNames: document.querySelectorAll("#players span"),
	playerButtons: document.querySelectorAll("#players div button"),
	overlay: document.getElementById("overlay"),
	beginOverlay: document.getElementById("begin"),
	endOverlay: document.getElementById("end"),
	endMessage: document.querySelector("#end p"),
	endButton: document.querySelector("#end button"),
	infoOverlay: document.getElementById("whiteoverlay"),
	infoTitle: document.querySelector("#whiteoverlay h3"),
	info: document.querySelector("#whiteoverlay p")
};
var gameModel = {
	dice: [],
	pawns: [],
	tiles: [],
	players: [],
	geese: [],
	tempPos: new Observable(),
	subPos: new Observable(),
	activePlayer: new Observable(),
	currentThrow: new Observable(),
	pawnMoveOver: new Observable()
};
var gameController = {
	rollDices: function () {
		var activePlayerId = gameModel.activePlayer.publish();
		var totalThrow = 0;
		for (let i = 0, ilen = gameModel.dice.length; i < ilen; ++i) {
			var randomNumber = Math.floor((Math.random() * 6) + 1);
			gameModel.dice[i].publish(randomNumber);
			totalThrow += randomNumber;
		}
		// toon die container
		gameView.dieContainer.removeAttribute("class");
		// disable after button press
		gameView.playerButtons[activePlayerId].setAttribute('disabled', '');
		var currentPlace = gameModel.pawns[activePlayerId].publish();
		gameModel.pawns[activePlayerId].publish(currentPlace + totalThrow);
		// save temp data
		gameModel.tempPos.publish(currentPlace);
		gameModel.activePlayer.publish(activePlayerId);
		gameModel.currentThrow.publish(totalThrow);
	},
	movePawn: function (place) {
		var startCounter = gameModel.subPos.publish();
		var playerId = gameModel.activePlayer.publish();
		var maxCounter = 63;
		var minCounter = 0;
		var otherPlayerAlready = false;
		// controleert of de 'place' al bezet is
		for (let i = 0, ilen = gameModel.pawns.length; i < ilen; ++i) {
			if (playerId != i && gameModel.pawns[i].publish() === place) {
				otherPlayerAlready = true;
			}
		}
		var move = setInterval(function () {
			if (place > startCounter) { // telt op
				if (startCounter != maxCounter) {
					gameView.pawns[playerId].className = "place-" + ++startCounter;
				} else {
					clearInterval(move);
					gameModel.subPos.publish(maxCounter);
					gameModel.pawns[playerId].publish(maxCounter - (place - maxCounter));
				}
			} else if (place < startCounter) {// telt af
				if (startCounter > minCounter) {
					gameView.pawns[playerId].className = "place-" + --startCounter;
				} else {
					clearInterval(move);
					gameView.pawns[playerId].className = "place-" + minCounter;
				}
			} else if (place === startCounter) {// staat op 'place'
				if (otherPlayerAlready && place!==minCounter && place !== 31 && place !== 52) {
					clearInterval(move);
					gameView.pawns[playerId].classList.add("temp");
					gameModel.subPos.publish(gameModel.pawns[playerId].publish());
					gameModel.pawns[playerId].publish(gameModel.tempPos.publish());
				} else {
					clearInterval(move);
					gameModel.subPos.publish(place);
					gameModel.pawnMoveOver.publish(true);
				}
			}
		}, 0);
	},
	startRules: function () {
		var currentPawn = gameModel.pawns[gameModel.activePlayer.publish()];
		var secondDiceValue = gameModel.dice[1].publish();
		switch (gameModel.dice[0].publish()) {
			case 3:
				if (secondDiceValue === 6) {
					currentPawn.publish(26);
				}
				break;
			case 4:
				if (secondDiceValue === 5) {
					currentPawn.publish(53);
				}
				break;
			case 5:
				if (secondDiceValue === 4) {
					currentPawn.publish(53);
				}
				break;
			case 6:
				if (secondDiceValue === 3) {
					currentPawn.publish(26);
				}
				break;
			default:
				setTimeout(function () {
					if (gameModel.tempPos.publish()<data){
						currentPawn.publish(data + gameModel.currentThrow.publish());
					}else{
						currentPawn.publish(data - gameModel.currentThrow.publish());
					}
				}, 500);
				break;
		}
	},
	rules: function (data) {
		var testRules = true;
		var playerId = gameModel.activePlayer.publish();
		// check de ganzen
		for (let i = 0, ilen = gameModel.geese.length; i < ilen; ++i) {
			if (gameModel.geese[i] === data) {
				setTimeout(function () {
					if (gameModel.tempPos.publish()<data){
						gameModel.pawns[playerId].publish(data + gameModel.currentThrow.publish());
					}else{
						gameModel.pawns[playerId].publish(data - gameModel.currentThrow.publish());
					}
				}, 500);
				testRules = false;
				break;
			}
		}
		if (testRules) { // pas de regels toe
			switch (data) {
				case 6:
					gameModel.pawns[playerId].publish(12);
					break;
				case 7:
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
					gameController.win();
					break;
				default:
					gameController.nextPlayer();
					break;
			}
		}
	},
	skipTurn: function (activePlayerId) { // Een beurt overslaan
		gameView.pawns[activePlayerId].classList.add("skip-turn");
		gameController.nextPlayer();
	},
	stickyPlace: function () { // Wie hier komt moet er blijven tot een andere speler er komt. Degene die er het eerst was speelt dan verder.
		gameController.skipTurn()
	},
	nextPlayer: function () {
		gameModel.pawnMoveOver.publish(false);
		var activeID = gameModel.activePlayer.publish();
		var nextPlayerId = activeID + 1;
		// volgende speler activeren
		if (nextPlayerId < gameModel.players.length) {
			if(gameView.pawns[nextPlayerId].classList.contains("skip-turn")) {
				gameModel.activePlayer.publish(nextPlayerId+1);
				gameView.playerButtons[nextPlayerId+1].removeAttribute('disabled');
				gameView.pawns[nextPlayerId].classList.remove("skip-turn")
			}
			else {
				gameModel.activePlayer.publish(nextPlayerId);
				gameView.playerButtons[nextPlayerId].removeAttribute('disabled');
				gameModel.subPos.publish(gameModel.pawns[nextPlayerId].publish());
			}
		} else {
			if(gameView.pawns[0].classList.contains("skip-turn")) {
				gameModel.activePlayer.publish(1);
				gameView.playerButtons[1].removeAttribute('disabled');
				gameView.pawns[0].classList.remove("skip-turn")
			}
			else {
				gameModel.activePlayer.publish(0);
				gameView.playerButtons[0].removeAttribute('disabled');
				gameModel.subPos.publish(gameModel.pawns[0].publish());
			}
			
		}
	},
	win: function () {
		gameView.endMessage.innerHTML = gameView.playerNames[gameModel.activePlayer.publish()].innerHTML;
		gameView.overlay.removeAttribute("class");
		gameView.endOverlay.removeAttribute("class");
		gameView.endButton.addEventListener("click", function () {
			location.reload();
		});
	}
};
var gameConnector = {
	dice: function (DOMElement) {
		var die = new Observable();
		die.subscribe(function (data) {
			DOMElement.className = "rolled-" + data;
		});
		return die;
	},
	pawns: function () {
		var pawn = new Observable();
		pawn.publish(0);
		pawn.subscribe(function (data) {
			gameController.movePawn(data);
		});
		return pawn;
	}
};
var gameSetup = {
	singleObservables: function () {
		gameModel.activePlayer.publish(0);
		gameModel.tempPos.publish(0);
		gameModel.subPos.publish(0);
		gameModel.pawnMoveOver.publish(false);
		gameModel.pawnMoveOver.subscribe(function (data) {
			if (data) {
				if (gameModel.pawns[gameModel.activePlayer.publish()].publish() !== 9) {
					setTimeout(function () {
						gameController.rules(gameModel.pawns[gameModel.activePlayer.publish()].publish());
					},500);
				} else {
					setTimeout(function () {
						gameController.startRules(gameModel.pawns[gameModel.activePlayer.publish()].publish());
					},500);
				}
			}
		});
	},
	players: function (players, names = ["Speler 1", "Speler 2", "Speler 3", "Speler 4"]) {
		// loopt het aantal meespelende spelers
		for (let i = 0; i < players; ++i) {
			// player = het DOM element met id player-1,2,3,4,...
			var player = gameView.players[i];
			// haalt de classe hidden weg
			player.removeAttribute("class");
			//zet de naam in de array bij de Models
			gameModel.players.push(names[i]);
			// zet de names in de view
			gameView.playerNames[i].innerHTML = names[i];
			// button functionaliteit
			var playerButton = gameView.playerButtons[i];
			playerButton.addEventListener("click", function () {
				gameController.rollDices();
			});
			// maakt eerste button klikbaar
			if (i === 0) {
				playerButton.removeAttribute("disabled");
			}
		}
	},
	dice: function (dice) {
		for (let i = 0; i < dice; ++i) {
			var die = gameView.dice[i];
			// Observable
			var newDice = gameConnector.dice(die);
			gameModel.dice.push(newDice);
		}
	},
	pawns: function (players) {
		for (let i = 0; i < players; ++i) {
			var pawn = gameView.pawns[i];
			if(pawn.classList.contains("hidden")){
				pawn.classList.toggle("hidden");
			}
			// Observable
			var newPawn = gameConnector.pawns();
			gameModel.pawns.push(newPawn);
		}
	},
	goose: function () {
		for (let goosespace = 9; goosespace <= 63; goosespace += 9) {
			if (goosespace != 63) {
				var goosespaceOne = goosespace - 4;
				var goosespaceTwo = goosespace;
				gameView.tiles[goosespaceOne].classList.add("goose");
				gameView.tiles[goosespaceTwo].classList.add("goose");
				gameModel.geese.push(goosespaceOne);
				gameModel.geese.push(goosespaceTwo);
			} else {
				var goosespaceThree = goosespace - 4;
				gameView.tiles[goosespaceThree].classList.add("goose");
				gameModel.geese.push(goosespaceThree);
			}
		}
	}
};
// eerst aangeroepen functie
var init = function() {
	gameSetup.goose();
	gameSetup.dice(2);
	gameSetup.singleObservables();

	gameView.startButton.addEventListener("click", function () {
		var playerAmount = gameView.playerAmount.value;
		gameSetup.players(playerAmount);
		gameSetup.pawns(playerAmount);
		gameView.overlay.setAttribute("class", "hidden");
		gameView.beginOverlay.setAttribute("class", "hidden");
	});
}();