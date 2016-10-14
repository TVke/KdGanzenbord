var Observable = function() {
    
    var _self = this;
    
    _self.data;
    
    _self.subscribers = [];
    
    
    _self.publish = function() {
        
        if(newData === 'undefined')
        {
            return _self.data;
        }
        else
        {
            _self.data = newData;
            
            for(subsriber in _self.subscribers)
            {
                _self.subscribers.push(newData);
            }
        }
    }
    
    
    _self.subscribe = function() {
        
        
    }
    
    
    _self.unsubscribe = function() {
        
        
    }
};