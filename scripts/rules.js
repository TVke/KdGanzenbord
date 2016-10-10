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

	    // Used to set and retrieve current value
	    publish: function(data) {
	    	if (typeof data !== 'undefined') {

		    	_self.data = data;
		        // Iterate over the subscribers array and call each of
		        // the callback functions.
		        var subscribersLength = _self.subscribers.length;
		        for (var subscriberKey = 0; subscriberKey < subscribersLength; subscriberKey++) {
		            _self.subscribers[subscriberKey](data);
		        }
	    	} else {
	    		return _self.data
	    	}
	    }
	}

	return _self.methods
};