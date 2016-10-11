var btn1 = document.getElementById("btn-1");
var btn2 = document.getElementById("btn-2");
var btn3 = document.getElementById("btn-3");
var btn4 = document.getElementById("btn-4");

var player1 = document.getElementById("player-1");
var player2 = document.getElementById("player-2");
var player3 = document.getElementById("player-3");
var player4 = document.getElementById("player-4");

var formplayer1 = document.getElementById("name-player-1");
var formplayer2 = document.getElementById("name-player-2");
var formplayer3 = document.getElementById("name-player-3");
var formplayer4 = document.getElementById("name-player-4");

var name1 = document.getElementsByName("name-1").value;
var name2 = document.getElementsByName("name-2").value;
var name3 = document.getElementsByName("name-3").value;
var name4 = document.getElementsByName("name-4").value;

var span1 = document.getElementById("span-1").innerHTML;
var span2 = document.getElementById("span-2").innerHTML;
var span3 = document.getElementById("span-3").innerHTML;
var span4 = document.getElementById("span-4").innerHTML;

dice1=document.getElementById("dice-1");
dice2=document.getElementById("dice-2");

function rollDices()
{
	
    classStart="rolled-";
    
	var diceNumber1 = Math.floor(Math.random() * 6) + 1;
	var diceNumber2 = Math.floor(Math.random() * 6) + 1;
    
    dice1.className = classStart + diceNumber1;
    dice2.className = classStart + diceNumber2;
 
    
    
}
btn1.addEventListener("click", rollDices);
btn2.addEventListener("click", rollDices);
    btn3.addEventListener("click", rollDices);
    btn4.addEventListener("click", rollDices);

function start()
{
    var playerAmount = document.getElementById("playerAmount").value;
    
    switch(playerAmount)
    {
        case "1":
            formplayer1.className = "visible";
            formplayer2.className = "invisible";
            formplayer3.className = "invisible";
            formplayer4.className = "invisible";
            
            player1.className = "visible";
            player2.className = "invisible";
            player3.className = "invisible";
            player4.className = "invisible";
            
            btn1.disabled = false;
            btn2.disabled = true;
            btn3.disabled = true;
            btn4.disabled = true;
            
            span1 = name1;
            
            break;
            
        case "2":
            formplayer1.className = "visible";
            formplayer2.className = "visible";
            formplayer3.className = "invisible";
            formplayer4.className = "invisible";
            
            player1.className = "visible";
            player2.className = "visible";
            player3.className = "invisible";
            player4.className = "invisible";
            
            btn1.disabled = false;
            btn2.disabled = false;
            btn3.disabled = true;
            btn4.disabled = true;
            
            span1 = name1;
            span2 = name2;
            
            break;
            
        case "3":
            formplayer1.className = "visible";
            formplayer2.className = "visible";
            formplayer3.className = "visible";
            formplayer4.className = "invisible";
            
            player1.className = "visible";
            player2.className = "visible";
            player3.className = "visible";
            player4.className = "invisible";
            
            btn1.disabled = false;
            btn2.disabled = false;
            btn3.disabled = false;
            btn4.disabled = true;
            
            span1 = name1;
            span2 = name2;
            span3 = name3;
            
            break;
            
        case "4":
            formplayer1.className = "visible";
            formplayer2.className = "visible";
            formplayer3.className = "visible";
            formplayer4.className = "visible";
            
            player1.className = "visible";
            player2.className = "visible";
            player3.className = "visible";
            player4.className = "visible";
            
            btn1.disabled = false;
            btn2.disabled = false;
            btn3.disabled = false;
            btn4.disabled = false;
            
            span1 = name1;
            span2 = name2;
            span3 = name3;
            span4 = name4;
            
            break;
            
        default:
            formplayer1.className = "invisible";
            formplayer2.className = "invisible";
            formplayer3.className = "invisible";
            formplayer4.className = "invisible";
            
            player1.className = "invisible";
            player2.className = "invisible";
            player3.className = "invisible";
            player4.className = "invisible";
            
            btn1.disabled = true;
            btn2.disabled = true;
            btn3.disabled = true;
            btn4.disabled = true;
    }
}