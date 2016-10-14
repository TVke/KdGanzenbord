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
	        _self.subscribers.push(callback); //callback = functie, data, ....
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
	    publish: function( data ) { //zelfde principe als callback

	    	if (typeof data !== 'undefined') {

		    	_self.data = data;
		        // Iterate over the subscribers array and call each of
		        // the callback functions.
		        for (var subscriberKey = 0; subscriberKey < _self.subscribers.length; ++subscriberKey) {
		            _self.subscribers[ subscriberKey ](data); //data wordt meegegeven aan de callback
		        }
	    	} else {
	    		return _self.data
	    	}
	    }
	}

	return _self.methods
};



// Create an object that will contain all the data for the yahtzee project
var diceModel = {
	'dices'	: 	new Observable()
}

document.getElementById('dice-1').each(function(){
    var newDice = createNewDice($(this));
    
    
})



















/*
diceModel.dices.subscribe(function() {
    var rolled = "rolled-";
    
    var dice1Value = dice.publish();
    var dice1Value = dice.publish();
    
    $('#dice-1').className(rolled + rdnDice1);
    $('#dice-2').className(rolled + rdnDice2);
})

$('button').on('click', function() {
    var rdnDice1 = Math.floor((Math.random() * 6) + 1);
    var rdnDice2 = Math.floor((Math.random() * 6) + 1);
    
    dice.publish(rdnDice1);
    dice.publish(rdnDice2);
    
    $('#dice-1').html(rdnDice1);
    $('#dice-2').html(rdnDice2);
})
*/