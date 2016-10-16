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
    
    //console.log(classDice1);
    //console.log(classDice2);
    //console.log(randomNumber1);
    //console.log(randomNumber2);
    
    return totalNumber;
}


var button = document.querySelectorAll('button');

for(var i=0; i<4; i++)
{
    button[i].addEventListener('click', function() {
        rolldice();
        document.getElementById('dices').className = "";
    });
}


var allbuttons = document.querySelectorAll('#players button');
var button1 = document.querySelector('#player-1 button');
var button2 = document.querySelector('#player-2 button');
var button3 = document.querySelector('#player-3 button');
var button4 = document.querySelector('#player-4 button');

function nextPlayer() {
    
    if(button1.disabled == false)
    {
        button1.setAttribute('disabled', true);
        button2.removeAttribute('disabled');
        
        console.log("button1");
    }
    else if(button2.disabled == false)
    {
        button2.setAttribute('disabled', true);
        button3.removeAttribute('disabled');
        
        console.log("button2");
    }
    else if(button3.disabled == false)
    {
        button3.setAttribute('disabled', true);
        button4.removeAttribute('disabled');
        
        console.log("button3");
    }
    else if(button4.disabled == false)
    {
        button4.setAttribute('disabled', true);
        button1.removeAttribute('disabled');
        
        console.log("button4");
    }
}











var pawns = document.querySelectorAll('#game div');
var pawnclass = "";

function restartGame() {
    var counter = 0;
    
    for(var i=0; i<4; i++)
    {
        counter++;
        
        pawnclass = "pawn-" + counter + " place-1" + " quatro-" + counter;
        
        pawns[i].className = pawnclass;
        
        console.log(pawnclass);
    }
    
    button1.removeAttribute('disabled');
    button2.setAttribute('disabled', true);
    button3.setAttribute('disabled', true);
    button4.setAttribute('disabled', true);
    
    document.getElementById('dices').className = "hidden";
}





dices.dice.subscribe(rolldice);

dices.dice.publish();



