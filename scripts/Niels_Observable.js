var Observable = function() {
    
    var _self = this;
    
    _self.data;
    
    _self.subscribers = [];
    
    
    _self.publish = function( newData ) {
        
        if(newData === 'undefined')
        {
            return _self.data;
        }
        else
        {
            _self.data = newData;
            
            for(var subscriberKey in _self.subscribers)
            {
                _self.subscribers[subscriberKey](newData);
            }
        }
    }
    
    
    _self.subscribe = function( callback ) {
        
        _self.subscribers.push(callback);
    }
    
    
    _self.unsubscribe = function( callback ) {
        
        for(var unsubscriberKey in _self.subscribers)
        {
            if(_self.subscribers[unsubscriberKey] === callback)
            {
                delete _self.subscribers[unsubscriberKey];
            }
        }
    }
};


/*
var test = {
    'dobbel' : new Observable()
}

function rolldice() {
    
    for(var i=0; i<2; i++) // geen for lus
    {
        var randomNumber = Math.floor((Math.random() * 6 ) + 1 );
        
        console.log(randomNumber);
    }
}

test.dobbel.subscribe(rolldice);

test.dobbel.publish();
*/