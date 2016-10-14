/*
// https://www.joezimjs.com/javascript/javascript-design-patterns-observer/

function Observable() {
	
	// Create reference to this by renaming this, so you can still use this inside functions
	var _self = this;

	// members that will collect necessary data
	_self.data;
    _self.subscribers = []

    // Public methods
	_self.methods = {

		// Triggered when data is set (using publish method)
	    subscribe: function(callback) {
	        // In most situations, you would check to see if the
	        // callback already exists within the subscribers array,
	        // but for the sake of keeping us on track and because
	        // this isn't necessarily included, we'll leave it out.
	        // Just add the callback to the subscribers list
	        _self.subscribers.push(callback);
	    },

	    unsubscribe: function(callback) {
	        var i = 0,
	            len = _self.subscribers.length;
	        // Iterate through the array and if the callback is
	        // found, remove it.
	        for (; i < len; i++) {
	            if (_self.subscribers[i] === callback) {
	                _self.subscribers.splice(i, 1);
	                // Once we've found it, we don't need to
	                // continue, so just return.
	                return;
	            }
	        }
	    },

	    // Used to set and retrieve current value
	    publish: function( data ) {

	    	if (typeof data !== 'undefined') {

		    	_self.data = data;
		        // Iterate over the subscribers array and call each of
		        // the callback functions.
		        for (var subscriberKey = 0; subscriberKey < _self.subscribers.length; ++subscriberKey) {
		            _self.subscribers[ subscriberKey ](data);
		        }
	    	} else {
	    		return _self.data
	    	}
	    }
	}

	return _self.methods
};




// Create an object that will contain all the data for the yahtzee project
var yahtzeeModel = {
	'score'	: 	new Observable(),
	'dices'	:	[]
}

/*


// Score functionality
// Score subscriptions, get executed when score changes
yahtzeeModel.score.subscribe(function updateScore() {

	// Add newly published score to HTML
    $('.score-value').html( yahtzeeModel.score.publish() ); 

})

// Function that calculates entire score
// Executed when dice value changes
function evaluateScore( ) {

	// Set total score to 0
	var score = 0;

	// Loop over all dices in the yahtzeeModel
	yahtzeeModel.dices.forEach( function( value ) {

		// When a new dice is created, it hasn't got a value yet
		// Check if the dice has a value, if so add value to the score
		if ( typeof value.publish() !== 'undefined' ) {
			score += value.publish();
		}
	})

	// Publish the score
	yahtzeeModel.score.publish( score );
}


// Dice functionality
// Loop over all dices found in HTML
$('.dice').each( function(){

	// Create new Dice observable
	var newDice = createNewDice( $( this ) );

	// Add dice to model
	yahtzeeModel.dices.push( newDice );

	// Get key of lastly added dice
	var lastlyAddedDiceKey = yahtzeeModel.dices.length - 1
	
	// Retrieve lastly added key from model
	var currentDice = yahtzeeModel.dices[ lastlyAddedDiceKey ];

	// Add event listener to button in dice
	$( this ).find('button').on('click', function() {

		// Generate number between 1-6
		var randomNumber = Math.floor( Math.random() * 6  ) + 1

		// Update dice value
		currentDice.publish( randomNumber );
		
	});
})

// Functionality used to make creation of die easier
// @container jQuery object
function createNewDice( container ) {

	// Create new observable
	var dice = new Observable();

	// Add subscription to observable
	dice.subscribe(function( data ){
		// Recalculate score when dice is cast
		dice.subscribe( evaluateScore );
		// Update dice HTM value
		container.find( '.dice-value' ).html( data )
	});

	// Return observable
	return dice;
}


*/







var Observable = function(){
	
	var _self=this;
	
	_self.data;
	_self.subscribers = new Array();
	
	_self.publish = function(newData){
		if(typeof newData=== 'undefined'){
			return _self.data;
		}
		else{
			data=newData;
			for (var subscriberKey in _self.subscribers){
				_self.subscribers[subscriberKey](data);
			}
		}
	}
	
	_self.subscribe = function(callback){
		
		_self.subscribers.push(callback);
		
	}
	
	_self.unsubscribe = function(callback){
		
		for (var subscriberKey in _self.subscribers){
				var callbackFromSub = _self.subscribers[subscriberKey];
				if(callbackFromSub === callback){
					delete _self.subscribers[subscriberKey];
				}
			}
		
	}
	
}











var pion = new Observable();


pion.publish(5);


function updateScore(value){
	var scoreElement
	console.log("score is "+value);
	
}

function printConsole(){
	console.log("log");
}

pion.subscribe(updateScore);
pion.subscribe(printConsole);


pion.publish(2);


































