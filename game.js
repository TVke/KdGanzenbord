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
	infoOverlay: document.getElementById("whiteoverlay"),
	infoTitle: document.querySelector("#whiteoverlay h3"),
	info: document.querySelector("#whiteoverlay p"),
};
var gameModel = {
	dice: [],
	pawns: [],
	tiles: [],
	players: [],
	geese: [],
	tempPos: new Observable(),
	activePlayer: new Observable(),
	currentThrow: new Observable(),
	pawnMoveOver: new Observable()
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
	movePawn: function(place) {
		 //test code
		var startPlace = gameModel.tempPos.publish();
		var startCounter = gameModel.tempPos.publish();
		var playerId = gameModel.activePlayer.publish();
		var maxCounter = 63;
		var minCounter = 0;
		var otherPlayerAlready = false;
		for(let i=0,ilen = gameModel.pawns.length;i<ilen;++i){
			if(playerId!=i && gameModel.pawns[i].publish()==place){
				otherPlayerAlready=true;
			}
		}
		// controlles
		console.log("startPlace: "+startPlace);
		console.log("startCounter: "+startCounter);
		console.log("playerId: "+playerId);
		console.log("otherPlayerAlready: "+otherPlayerAlready);
		console.log("place: "+place);


		var move = setInterval(function () {
			if(place > startCounter){
				if(startCounter!=maxCounter) {
					gameView.pawns[playerId].className = "place-" + ++startCounter;
				}else{
					clearInterval(move);
					gameModel.pawns[playerId].publish(maxCounter-(place-maxCounter));
				}
			}else if(place < startCounter){
				if(startCounter>minCounter){
					gameView.pawns[playerId].className = "place-"+ --startCounter;
				}else {
					clearInterval(move);
					gameView.pawns[playerId].className = "place-"+ minCounter;
					gameView.pawns[playerId].classList.add("start");
				}
			}else if(place == startCounter){
				if(otherPlayerAlready){
					clearInterval(move);
					gameView.pawns[playerId].classList.add("temp");
					gameModel.pawns[playerId].publish(startPlace);
				}
			}
		},250);

		/*var pawnId = gameModel.activePlayer.publish();
		for (let i = 0, pawnsLength = gameModel.pawns.length; i < pawnsLength; ++i) {
			// alles behalven de te verplaatsen pion
			if (i != pawnId) {
				if (gameModel.pawns[i].publish() == place) {
					gameView.pawns[i].classList.add("temp");
/!*
					setTimeout(function(){
						if(typeof gameModel.tempPos.publish() === "undefined"){
							gameView.pawns[pawnId].publish(1);
						}else{
							gameView.pawns[pawnId].publish(gameModel.tempPos.publish());
						}
						gameView.pawns[i].classList.toggle("temp");
					}, 700);
*!/
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
			gameView.pawns[pawnId].className
			gameView.pawns[pawnId].className = "place-" + place;
		} else if (place > 63) {
			gameView.pawns[pawnId].className = "place-63";
			setTimeout(function() {
				gameView.pawns[pawnId].className = "place-" + (63 - (parseInt(place) - 63));
			}, 700);
		} else if (place < 1) {
			gameView.pawns[pawnId].className = "place-1";
		}*/
	},
	startRules: function() {
		var currentPawn = gameModel.pawns[gameModel.activePlayer.publish()];
		var secondDiceValue = gameModel.dice[1].publish();
		switch (gameModel.dice[0].publish()) {
		case 3:
			if (secondDiceValue == 6) {
				currentPawn.publish(26);
			}
			break;
		case 4:
			if (secondDiceValue == 5) {
				currentPawn.publish(53);
			}
			break;
		case 5:
			if (secondDiceValue == 4) {
				currentPawn.publish(53);
			}
			break;
		case 6:
			if (secondDiceValue == 3) {
				currentPawn.publish(26);
			}
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
		var nextPlayerId = ++activeID;
		//volgende speler activeren
		if (activeID < gameModel.players.length) {
			gameModel.activePlayer.publish(nextPlayerId);
			gameView.playerButtons[nextPlayerId].removeAttribute('disabled');
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
	dice: function(DOMElement) {
		var die = new Observable();
		die.subscribe(function(data) {
			DOMElement.className = "rolled-" + data;
		});
		return die;
	},
	pawns: function() {
		var pawn = new Observable();
		pawn.publish(0);
		pawn.subscribe(function(data) {
			if (data != 9) {
				gameController.movePawn(data);
				/*setTimeout(function() {
					gameController.rules(data);
				}, 700);*/
			} else {
				gameController.movePawn(data);
				/*setTimeout(function() {
					gameController.startRules();
				}, 700);*/
			}
		});
		return pawn;
	}
};
var gameSetup = {

	players: function(players, names = ["Speler 1", "Speler 2", "Speler 3", "Speler 4"]) {
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
			playerButton.addEventListener("click", function() {
				gameController.rollDices();
			});
			// maakt eerste button klikbaar
			if (i == 0) {
				playerButton.removeAttribute("disabled");
				gameModel.activePlayer.publish(0);
				gameModel.tempPos.publish(0);
				gameModel.pawnMoveOver.publish(false);
			}
		}
	},
	dice: function(dice) {
		for (let i = 0; i < dice; ++i) {
			var die = gameView.dice[i];
			// Observable
			var newDice = gameConnector.dice(die);
			gameModel.dice.push(newDice);
		}
	},
	pawns: function(players) {
		for (let i = 0; i < players; ++i) {
			var pawn = gameView.pawns[i];
			pawn.classList.toggle("hidden");
			// Observable
			var newPawn = gameConnector.pawns();
			gameModel.pawns.push(newPawn);
		}
	},
	goose: function() {
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
/*
		gameView.startButton.addEventListener("click",function(){
			var playerAmount = gameView.playerAmount.value;
			gameSetup.players(playerAmount);
			gameSetup.pawns(playerAmount);
		});
*/
		var playerAmount = gameView.playerAmount.value;
		gameSetup.players(playerAmount);
		gameSetup.pawns(playerAmount);
}();