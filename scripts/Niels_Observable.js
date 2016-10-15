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


var dices = {
    'dice' : new Observable()
}


function rolldice() {
    
    var randomNumber1 = Math.floor((Math.random() * 6 ) + 1 );
    var randomNumber2 = Math.floor((Math.random() * 6 ) + 1 );
    
    var totalNumber = randomNumber1 + randomNumber2;
    
    var classDice1 = "rolled-" + randomNumber1;
    var classDice2 = "rolled-" + randomNumber2;
    
    document.getElementById('dice-1').className = classDice1;
    document.getElementById('dice-2').className = classDice2;
    
    //document.getElementById('dices').className = "";
    
    //console.log(classDice1);
    //console.log(classDice2);
    //console.log(randomNumber1);
    //console.log(randomNumber2);
    
    return totalNumber;
};


var button = document.querySelectorAll('button');

for(var i=0; i<4; i++)
{
    button[i].addEventListener('click', function() {
        rolldice();
        document.getElementById('dices').className = "";
    });
}



dices.dice.subscribe(rolldice);

dices.dice.publish();



