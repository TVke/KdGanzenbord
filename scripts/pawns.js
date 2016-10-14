


/*


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
*/


































