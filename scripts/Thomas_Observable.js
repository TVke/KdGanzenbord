var Observable = function(){
	
	var _self=this;
	
	_self.data;
	_self.subscribers = [];
	
	_self.methods= {
		
		subscribe: function(callback){
			_self.subscribers.push(callback);
		},
		unsubscribe: function(callback){
			for (var subscribersKey in _self.subscribers){
				if(_self.subscribers[subscribersKey] === callback){
					delete _self.subscribers[subscribersKey];
				}
			}
		},
		publish: function(newData){
			if(typeof newData === 'undifined'){
				return _self.data;
			}
			else{
				_self.data=newData;
				for(var subscribersKey in _self.subscribers){
					_self.subscribers[subscribersKey](_self.data);
				}
			}
		}
	}
	return _self.methods;
};

/*
var model = {
	dices : new Observable()
	tegelmodel:
}

models.dices.subscribe(function(){console.log("test dices")});
models.dices.publish(4);



var tegelcontroller={
	
}
*/