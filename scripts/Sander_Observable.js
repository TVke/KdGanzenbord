function Observable() {
	var _self = this;
	_self.data;
	_self.subscribers = [];

	_self.methods = {
		subscribe : function(callback) {
			if(_self.subscribers.indexOf(callback) === -1) {
				_self.subscribers.push(callback);
			}
		},

		unsubscribe : function(callback) {
			if(_self.subscribers.indexOf(callback) > -1) {
				for(let subscribersIndex = 0; subscribersIndex < _self.subscribers.length; subscribersIndex++) {
		            if(_self.subscribers[subscribersIndex] === callback) {
		                _self.subscribers.splice(subscribersIndex, 1);
		                return;
	            	}
				}
			}
		},

		publish : function(data) {
			if(typeof data !== "undefined") {
				_self.data = data;
				for(let subscribersIndex = 0; subscribersIndex < _self.subscribers.length; subscribersIndex++) {
		            _self.subscribers[subscribersIndex](data);
		        }
			}
			else {
				return _self.data;
			}
		}
	}
	return _self.methods;
}