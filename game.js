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
	playerInput: document.querySelectorAll("#begin input[type=text]"),
	diceContainer: document.getElementById("dice"),
	dice: document.querySelectorAll("#dice div"),
	pawns: document.querySelectorAll("div[id^='pawn-']"),
	tiles: document.querySelectorAll("#board a"),
	players: document.querySelectorAll("#players div"),
	playerNames: document.querySelectorAll("#players span"),
	playerButtons: document.querySelectorAll("#players div button"),
	overlay: document.getElementById("overlay"),
	beginOverlay: document.getElementById("begin"),
	endOverlay: document.getElementById("end"),
	endTitel: document.querySelector("#end h3"),
	endMessage: document.querySelector("#end p"),
	endButton: document.querySelector("#end button"),
	infoOverlay: document.getElementById("whiteoverlay"),
	infoTitle: document.querySelector("#whiteoverlay h3"),
	info: document.querySelector("#whiteoverlay p"),
	game: document.getElementById("game")
};
var gameModel = {
	dice: [],
	pawns: [],
	tiles: [],
	players: [],
	geese: [],
	startTile: new Observable(),
	endTile: new Observable(),
	tempPos: new Observable(),
	subPos: new Observable(),
	activePlayer: new Observable(),
	currentThrow: new Observable(),
	pawnMoveOver: new Observable(),
	skipTurn: new Observable(),
	stayInPlace31: new Observable(),
	stayInPlace52: new Observable(),
	pawnMoveSpeed: new Observable(),
	ruesCheckspeed: new Observable(),
	showInfoTime: new Observable()
};
var gameController = {
	rollDice: function () {
		var activePlayerId = gameModel.activePlayer.publish();
		var totalThrow = 0;
		var lastDie = gameView.dice[gameModel.dice.length-1];
		for (let i = 0, ilen = gameModel.dice.length; i < ilen; ++i) {
			var randomNumber = Math.floor((Math.random() * 6) + 1);
			gameModel.dice[i].publish(randomNumber);
			if(i===0){
				gameView.dice[i].setAttribute("aria-label","Je dobbelde "+randomNumber);
			}else{
				gameView.dice[i].setAttribute("aria-label","en "+randomNumber);
			}
			totalThrow += randomNumber;
		}
		lastDie.setAttribute("aria-label",lastDie.getAttribute("aria-label")+". "+totalThrow+" verder");
		// disable after button press
		gameView.playerButtons[activePlayerId].setAttribute('disabled', '');
		var currentPlace = gameModel.pawns[activePlayerId].publish();
		gameModel.pawns[activePlayerId].publish(currentPlace + totalThrow);
		// save temp data
		gameModel.tempPos.publish(currentPlace);
		gameModel.activePlayer.publish(activePlayerId);
		gameModel.currentThrow.publish(totalThrow);
		gameView.diceContainer.classList.remove("hidden");
	},
	movePawn: function (place) {
		var startCounter = gameModel.subPos.publish();
		var playerId = gameModel.activePlayer.publish();
		var maxCounter = gameModel.endTile.publish();
		var minCounter = gameModel.startTile.publish();
		var otherPlayerAlready = false;
		// controleert of de 'place' al bezet is
		for (let i = 0, ilen = gameModel.pawns.length; i < ilen; ++i) {
			if (playerId != i && gameModel.pawns[i].publish() === place) {
				otherPlayerAlready = true;
			}
		}
		for (let i = 0, ilen = gameView.tiles.length; i < ilen; ++i) {
			if (gameView.tiles[i].classList.contains("glow")) {
				gameView.tiles[i].classList.remove("glow");
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
					gameController.displayInfo("Te ver", "Je moet " + parseInt(place - maxCounter) + " plaatsen terug!");
				}
			} else if (place < startCounter) {// telt af
				if (startCounter > minCounter) {
					gameView.pawns[playerId].className = "place-" + --startCounter;
				} else {
					clearInterval(move);
					gameView.pawns[playerId].className = "place-" + minCounter;
				}
			} else if (place === startCounter) {// staat op 'place'
				if (otherPlayerAlready && place !== minCounter && place !== 31 && place !== 52) {
					clearInterval(move);
					if (otherPlayerAlready) {
						gameView.pawns[playerId].classList.add("temp");
					}
					gameModel.subPos.publish(gameModel.pawns[playerId].publish());
					gameModel.pawns[playerId].publish(gameModel.tempPos.publish());
					gameController.displayInfo("Andere speler", "Je gaat terug naar je vorige positie!");
				} else {
					clearInterval(move);
					gameModel.subPos.publish(place);
					gameModel.pawnMoveOver.publish(true);
				}
			}
		}, gameModel.pawnMoveSpeed.publish());
	},
	startRules: function (data) {
		var currentPawn = gameModel.pawns[gameModel.activePlayer.publish()];
		var secondDiceValue = gameModel.dice[1].publish();
		switch (gameModel.dice[0].publish()) {
			case 3:
				if (secondDiceValue === 6) {
					currentPawn.publish(26);
					gameController.displayInfo("3 & 6", "Je gaat verder naar vakje 26!");
				} else {
					setTimeout(function () {
						if (gameModel.tempPos.publish() < data) {
							currentPawn.publish(data + gameModel.currentThrow.publish());
						} else {
							currentPawn.publish(data - gameModel.currentThrow.publish());
						}
					}, gameModel.ruesCheckspeed.publish());
				}
				break;
			case 4:
				if (secondDiceValue === 5) {
					currentPawn.publish(53);
					gameController.displayInfo("4 & 5", "Je gaat verder naar vakje 53!");
				} else {
					setTimeout(function () {
						if (gameModel.tempPos.publish() < data) {
							currentPawn.publish(data + gameModel.currentThrow.publish());
						} else {
							currentPawn.publish(data - gameModel.currentThrow.publish());
						}
					}, gameModel.ruesCheckspeed.publish());
				}
				break;
			case 5:
				if (secondDiceValue === 4) {
					currentPawn.publish(53);
					gameController.displayInfo("5 & 4", "Je gaat verder naar vakje 53!");
				} else {
					setTimeout(function () {
						if (gameModel.tempPos.publish() < data) {
							currentPawn.publish(data + gameModel.currentThrow.publish());
						} else {
							currentPawn.publish(data - gameModel.currentThrow.publish());
						}
					}, gameModel.ruesCheckspeed.publish());
				}
				break;
			case 6:
				if (secondDiceValue === 3) {
					currentPawn.publish(26);
					gameController.displayInfo("6 & 3", "Je gaat verder naar vakje 26!");
				} else {
					setTimeout(function () {
						if (gameModel.tempPos.publish() < data) {
							currentPawn.publish(data + gameModel.currentThrow.publish());
						} else {
							currentPawn.publish(data - gameModel.currentThrow.publish());
						}
					}, gameModel.ruesCheckspeed.publish());
				}
				break;
			default:
				setTimeout(function () {
					if (gameModel.tempPos.publish() < data) {
						currentPawn.publish(data + gameModel.currentThrow.publish());
					} else {
						currentPawn.publish(data - gameModel.currentThrow.publish());
					}
				}, gameModel.ruesCheckspeed.publish());
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
					if (gameModel.tempPos.publish() < data || gameModel.subPos.publish() > data) {
						gameModel.pawns[playerId].publish(data + gameModel.currentThrow.publish());
						gameController.displayInfo("Gans", "Je gaat " + gameModel.currentThrow.publish() + " vakjes verder!");
					} else {
						gameModel.pawns[playerId].publish(data - gameModel.currentThrow.publish());
						gameController.displayInfo("Gans", "Je gaat " + gameModel.currentThrow.publish() + " vakjes terug!");
					}
				}, gameModel.ruesCheckspeed.publish());
				testRules = false;
				break;
			}
		}
		if (testRules) { // pas de regels toe
			switch (data) {
				case 6:
					gameModel.pawns[playerId].publish(12);
					gameController.displayInfo("Brug", "Je gaat verder naar vakje 12!");
					break;
				case 19:
					gameController.skipTurn();
					gameController.displayInfo("Herbeg", "Je moet een beurt overslaan!");
					break;
				case 31:
					gameController.stickyPlace(31);
					gameController.displayInfo("Put", "Je moet wachten tot een andere speler je bevrijdt!");
					break;
				case 42:
					gameModel.pawns[playerId].publish(39);
					gameController.displayInfo("Doolhof", "Je moet terug naar vakje 39!");
					break;
				case 52:
					gameController.stickyPlace(52);
					gameController.displayInfo("Gevangenis", "Je moet wachten tot een andere speler je bevrijdt!");
					break;
				case 58:
					gameModel.pawns[playerId].publish(0);
					gameController.displayInfo("Dood", "Je moet terug naar het begin x_x");
					break;
				case gameModel.endTile.publish():
					gameController.end("win");
					break;
				default:
					gameController.nextPlayer();
					gameView.infoOverlay.classList.add("hidden");
					break;
			}
		}
	},
	skipTurn: function () { // Een beurt overslaan
		gameModel.skipTurn.publish(gameModel.activePlayer.publish());
		gameController.nextPlayer();
	},
	stickyPlace: function (place) { // Wie hier komt moet er blijven tot een andere speler er komt. Degene die er het eerst was speelt dan verder.
		if (gameModel.players.length >= 2 && (typeof gameModel.stayInPlace31.publish() === "undefined" || typeof gameModel.stayInPlace52.publish() === "undefined")) {
			if (place === 31) {
				gameModel.stayInPlace31.publish(gameModel.activePlayer.publish());
			} else if (place === 52) {
				gameModel.stayInPlace52.publish(gameModel.activePlayer.publish());
			}
		}
		else if (gameModel.players.length === 2 && typeof gameModel.stayInPlace31.publish() !== "undefined" && typeof gameModel.stayInPlace52.publish() !== "undefined") {
			gameController.end("gelijk");
		}
		else if (gameModel.players.length === 1) {
			gameController.end("verloren");
		} else {
			if (place === 31) {
				gameModel.stayInPlace31.publish(gameModel.activePlayer.publish());
			} else if (place === 52) {
				gameModel.stayInPlace52.publish(gameModel.activePlayer.publish());
			}
		}
		gameController.nextPlayer();
	},
	nextPlayer: function () {
		gameModel.pawnMoveOver.publish(false);
		var nextPlayerId = 0;
		if ((gameModel.activePlayer.publish() + 1) < gameModel.players.length) {
			nextPlayerId = gameModel.activePlayer.publish() + 1;
		}
		if (gameModel.skipTurn.publish() !== nextPlayerId && gameModel.stayInPlace31.publish() !== nextPlayerId && gameModel.stayInPlace52.publish() !== nextPlayerId) {
			gameModel.activePlayer.publish(nextPlayerId);
			gameModel.subPos.publish(gameModel.pawns[nextPlayerId].publish());
			gameView.playerButtons[nextPlayerId].removeAttribute('disabled');
			gameView.playerButtons[nextPlayerId].focus();
		}
		else {
			while (gameModel.skipTurn.publish() === nextPlayerId || gameModel.stayInPlace31.publish() === nextPlayerId || gameModel.stayInPlace52.publish() === nextPlayerId) {
				if (gameModel.skipTurn.publish() === nextPlayerId) {
					gameModel.skipTurn.publish(false);
				}
				if ((nextPlayerId + 1) < gameModel.players.length) {
					nextPlayerId += 1;
				}
				else {
					nextPlayerId = 0;
				}
			}
			gameModel.activePlayer.publish(nextPlayerId);
			gameModel.subPos.publish(gameModel.pawns[nextPlayerId].publish());
			gameView.playerButtons[nextPlayerId].removeAttribute('disabled');
			gameView.playerButtons[nextPlayerId].focus();
		}
		gameView.diceContainer.classList.add("hidden");
	},
	end: function (status) {
		if (status === "win") {
			gameView.endTitel.innerHTML = "Gewonnen!";
			gameView.endMessage.innerHTML = gameView.playerNames[gameModel.activePlayer.publish()].innerHTML;
		}
		if (status === "gelijk") {
			gameView.endTitel.innerHTML = "Gelijk gespeeld!";
			gameView.endMessage.innerHTML = "probeer nog eens.";
		}
		if (status === "verloren") {
			gameView.endTitel.innerHTML = "Verloren!";
			gameView.endMessage.innerHTML = gameView.playerNames[gameModel.activePlayer.publish()].innerHTML;
		}
		gameView.overlay.removeAttribute("class");
		gameView.endOverlay.removeAttribute("class");
		gameView.endButton.addEventListener("click", function () {
			location.reload();
		});
	},
	displayInfo: function (infoTitle, info) {
		gameView.infoOverlay.classList.add("hidden");
		gameView.infoTitle.innerHTML = infoTitle;
		gameView.info.innerHTML = info;
		gameView.infoOverlay.classList.remove("hidden");
		setTimeout(function () {
			gameView.infoOverlay.classList.add("hidden");
		}, gameModel.showInfoTime.publish())
	}
};
var gameSetup = {
	singleObservables: function () {
		gameModel.activePlayer.publish(0);
		gameModel.tempPos.publish(0);
		gameModel.subPos.publish(0);
		gameModel.startTile.publish(0);
		gameModel.endTile.publish(gameView.tiles.length - 1);
		// speed settings
		gameModel.pawnMoveSpeed.publish(250);
		gameModel.ruesCheckspeed.publish(gameModel.pawnMoveSpeed.publish() * 2);
		gameModel.showInfoTime.publish(5000);
		//after every moved pawn
		gameModel.pawnMoveOver.publish(false);
		gameModel.pawnMoveOver.subscribe(function (data) {
			if (data) {
				var checkPlace = gameModel.pawns[gameModel.activePlayer.publish()].publish();
				for (let i = 0, ilen = gameModel.geese.length; i < ilen; ++i) {
					if (checkPlace === gameModel.geese[i]) {
						gameView.tiles[gameModel.geese[i]].classList.add("glow");
					}
				}
				if (checkPlace === 6 || checkPlace === 19 || checkPlace === 31 || checkPlace === 42 || checkPlace === 52 || checkPlace === 58 || checkPlace === 63) {
					gameView.tiles[checkPlace].classList.add("glow");
				}
				if (checkPlace !== 9) {
					setTimeout(function () {
						gameController.rules(checkPlace);
					}, gameModel.ruesCheckspeed.publish());
				} else {
					setTimeout(function () {
						gameController.startRules(checkPlace);
					}, gameModel.ruesCheckspeed.publish());
				}
			}
		});
		//tooltips

		for (let i = 0, ilen = gameModel.geese.length; i < ilen; ++i) {
			gameView.tiles[gameModel.geese[i]].setAttribute("data-title", "gedobbeld aantal verder");
		}
		gameView.tiles[6].setAttribute("data-title", "verder naar vakje 12");
		gameView.tiles[19].setAttribute("data-title", "een beurt overslaan");
		gameView.tiles[31].setAttribute("data-title", "wachten tot je bevrijd wordt");
		gameView.tiles[42].setAttribute("data-title", "terug naar vakje 39");
		gameView.tiles[52].setAttribute("data-title", "wachten tot je bevrijd wordt");
		gameView.tiles[58].setAttribute("data-title", "terug naar het begin x_x");
		gameView.tiles[gameModel.endTile.publish()].setAttribute("data-title", "gewonnen!");
	},
	players: function (players, names) {
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
				gameController.rollDice();
			});
			// maakt eerste button klikbaar
			if (i === 0) {
				playerButton.removeAttribute("disabled");
				playerButton.focus();
			}
		}
	},
	dice: function (dice) {
		for (let i = 0; i < dice; ++i) {
			// Observable
			var dieObservable = new Observable();
			dieObservable.subscribe(function (data) {
				gameView.dice[i].className = "rolled-" + data;
			});
			gameModel.dice.push(dieObservable);
		}
	},
	pawns: function (players) {
		for (let i = 0; i < players; ++i) {
			var pawn = gameView.pawns[i];
			if (pawn.classList.contains("hidden")) {
				pawn.classList.remove("hidden");
			}
			// Observable
			var pawnObservable = new Observable();
			pawnObservable.publish(0);
			pawnObservable.subscribe(function (data) {
				gameController.movePawn(data);
			});
			gameModel.pawns.push(pawnObservable);
		}
	},
	goose: function () {
		for (let goosespace = 9,end=gameView.tiles.length-1; goosespace <= end; goosespace += 9) {
			if (goosespace != end) {
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

	gameView.playerAmount.addEventListener("change", function () {
		// inputs hidden zetten als iets veranderd aan select
		for (let i = 0, ilen = gameView.playerInput.length; i < ilen; ++i) {
			gameView.playerInput[i].setAttribute("class", "hidden");
		}
		var playerAmount = gameView.playerAmount.value;
		for (let i = 0; i < playerAmount; ++i) {
			gameView.playerInput[i].removeAttribute("class");
		}
	});

	gameView.startButton.addEventListener("click", function () {
		var playerAmount = gameView.playerAmount.value;
		var playerNames = [];
		for (let i = 0; i < playerAmount; ++i) {
			if (gameView.playerInput[i].value !== "") {
				playerNames.push(gameView.playerInput[i].value);
				gameView.playerButtons[i].setAttribute("aria-label",gameView.playerInput[i].value + " Dobbel");
			} else {
				playerNames.push("Speler " + (i + 1));
				gameView.playerButtons[i].setAttribute("aria-label","Speler " + (i + 1) + " Dobbel");
			}
		}
		gameSetup.players(playerAmount, playerNames);
		gameSetup.pawns(playerAmount);
		gameView.overlay.setAttribute("class", "hidden");
		gameView.beginOverlay.setAttribute("class", "hidden");
	});
}();