var Observable = function() {
    
    var _self = this;
    
    _self.data;
    
    _self.subscribers = [];
    
    
    _self.subscribe = function( newData ) {
        
        var data = _self.newData;
        
        if(newData === 'undefined')
        {
            return _self.data;
        }
        else
        {
            
            
            for(subscirber in _self.subscribers)
            {
                
            }
        }
    }
    
    
    _self.unsubscribe = function() {
        
    }
    
    
    _self.publish = function() {
        
    }
}