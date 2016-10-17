var Observable = function() {
		var _self = this;
		_self.data;
		_self.subs = [];
		_self.methods = {
			publish: function(newData) {
				if (typeof newData !== 'undefined') {
					_self.data = newData;
					for (var i = 0, ilen = _self.subs.length; i < ilen; ++i) {
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
				for (var i = 0, ilen = _self.subs.length; i < ilen; ++i) {
					if (_self.subs[i] === callback) {
						_self.subs.splice(i, 1);
					}
				}
			}
		};
		return _self.methods;
	};
var gameView = {
	dices: document.querySelectorAll("#dices div"),
	pawns: document.querySelectorAll("div[id^='pawn-']"),
	tiles: document.querySelectorAll("#board div"),
	players: document.querySelectorAll("#players div")
};
var gameModel = {
	dices: [],
	pawns: [1, 5, 1, 5],
	tiles: [],
	players: []
};
var gameControllers = {
	addMultiplePosition: function() {
		
/* niet meer nodig  
		var sorted = gameModel.pawns.slice().sort(function(a, b) {
			return a - b
		});
		
		var uniqueValues = [];
		var countUniques = [];
		var lastChecked;
		
		for (var i = 0, ilen = sorted.length; i < ilen; ++i) {
			if (sorted[i] !== lastChecked) {
				uniqueValues.push(sorted[i]);
				countUniques.push(1);
			} else {
				++countUniques[countUniques.length - 1];
			}
			lastChecked = sorted[i];
		}
		
		for (var i = 0, ilen = countUniques.length; i < ilen; ++i) {
			switch(countUniques[i]){
				case 2:
					var extraClass="duo-";
					var counter=1;
					for(var j = 0, jlen = gameModel.pawns.length; j < jlen; ++j){
						if(gameModel.pawns[j]==uniqueValues[i]){
							gameModel.multiplePawns[j]=extraClass+counter;
							++counter;
						}
					}
				break;
				case 3:
					var extraClass="trio-";
					var counter=1;
					for(var j = 0, jlen = gameModel.pawns.length; j < jlen; ++j){
						if(gameModel.pawns[j]==uniqueValues[i]){
							gameModel.multiplePawns[j]=extraClass+counter;
							++counter;
						}
					}
				break;
				case 4:
					var extraClass="quatro-";
					var counter=1;
					for(var j = 0, jlen = gameModel.pawns.length; j < jlen; ++j){
						if(gameModel.pawns[j]==uniqueValues[i]){
							gameModel.multiplePawns[j]=extraClass+counter;
							++counter;
						}
					}
				break;
			}
		}
*/
	},
	movePawn: function(pawn,place) {
/*
		var lastPlace=; 
		for(var i = 0, ilen = gameModel.pawns.length; i < ilen; ++i){
			if(place==gameModel.pawns[i]){
				pawn.publish(place);
				setTimeout(function() {
					pawn.className = "place-" + (63 - (parseInt(place) - 63));
			}, 1000);
			}
		}
		
		
		if (place <= 63 && place >= 1) {
			this.className = "place-" + place;
		} else if (place < 63) {
			this.className = "place-63";
			setTimeout(function() {
				this.className = "place-" + (63 - (parseInt(place) - 63));
			}, 1000);
		} else if (place < 1) {
			this.className = "place-1";
		}
		gameControllers.addMultiplePosition();
*/
	},
	rollDices:function(){
		var randomNumber1 = Math.floor((Math.random() * 6 ) + 1 );
		var randomNumber2 = Math.floor((Math.random() * 6 ) + 1 );
		
		var totalNumber = randomNumber1 + randomNumber2;
		
		var classDice1 = "rolled-" + randomNumber1;
		var classDice2 = "rolled-" + randomNumber2;
		
		document.getElementById('dice-1').className = classDice1;
		document.getElementById('dice-2').className = classDice2;
		
		document.getElementById("dices").removeAttribute("class");
/*
		return randomNumber1;
		return randomNumber2;
		return totalNumber;
*/
// 		gameModel.players[0].publish(0);
	},
	nextPlayer:function(index){
		// checkt dat het niet de laatste player is
		if(index<gameModel.players.length){
			gameView.players[index].querySelector("button").setAttribute('disabled', 'disabled');
			gameView.players[++index].querySelector("button").removeAttribute('disabled');
		}else{
			gameView.players[index].querySelector("button").setAttribute('disabled', 'disabled');
			gameView.players[0].querySelector("button").removeAttribute('disabled');
		}
/* niels code
		if(button1.disabled == false){
	        button1.setAttribute('disabled', 'disabled');
	        button2.removeAttribute('disabled');
	    }
	    else if(button2.disabled == false)
	    {
	        button2.setAttribute('disabled', 'disabled');
	        button3.removeAttribute('disabled');
	    }
	    else if(button3.disabled == false)
	    {
	        button3.setAttribute('disabled', 'disabled');
	        button4.removeAttribute('disabled');
	    }
	    else if(button4.disabled == false)
	    {
	        button4.setAttribute('disabled', 'disabled');
	        button1.removeAttribute('disabled');
	    }
*/
	}
};
var gameConnectors = {
	players:function(){
		var player = new Observable();
		
		// bij een publish met een index nummer wordt deze functie uitgevoerd
		player.subscribe(gameControllers.nextPlayer);
		return player;
	},
	pawns:function(){
		//console.log("pawn");
	}
};

var startGame=function(players){
	// loopt het aantal meespelende spelers
	for(var i=0;i<players;++i){
		
		// player = het DOM element met id player-1,2,3,4,...
		var player = gameView.players[i];
		
		// haalt de classe hidden weg
		player.removeAttribute("class");
		
		// maakt Observable object
		var newPlayer = gameConnectors.players();
		
		//zet de Observable in de array bij de Models
		gameModel.players.push(newPlayer);
		
		// button functionaliteit
		playerButton=player.querySelector("button");
		playerButton.addEventListener("click", gameControllers.rollDices);
		
		// maakt eerste button klikbaar
		if(i==0){
			playerButton.removeAttribute("disabled");
		}
	}
	
	//  dices observables  //
	
	//  pawns observables  //
	
	//  goose observables  //
	
};

// eerst aangeroepen functie  ------->  instellingen nog te regelen
var init=function(){
	var givenPlayerAmount = 4;
	startGame(givenPlayerAmount);
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