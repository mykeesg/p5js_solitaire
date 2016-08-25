window.addEventListener("contextmenu", function(e) { e.preventDefault(); })


var board;
var deck;

var finalPiles;

var stockPile;
var playedPile;

var movedPile;
var sourcePile;
var destPile;

var gameover;
var valid;
var clicked;

function setup()
{
	createCanvas(1000,600);
	board = [];
	finalPiles = [];
	deck = new Deck();
	deck.shuffle();
	
	for(var i=0;i<4;++i)
	{
		finalPiles.push(new Pile());
	}
		
	for(var i=0;i<7;++i)
	{
		board.push(new Pile());
		for(var j=0;j<=i;++j)
		{
			board[i].placeOnTop(deck.getNextCard());
		}
		board[i].showTop();
	}
	stockPile = new Pile();
	playedPile = new Pile();
	while(deck.areCardsLeft())
	{
		stockPile.placeOnTop(deck.getNextCard());
	}
	movedPile = undefined;
    destPile = undefined;
	sourcePile = undefined;
	
	gameover = false;
	valid = false;
	clicked = false;	
}

function draw()
{
	if(!gameover)
		clear();
	for(var i=0;i<board.length;++i)
	{
		board[i].show(70*i+30,130,20);
	}
	
	for(var i=0;i<finalPiles.length;++i)
	{
		finalPiles[i].show(70*i+240,20,0);
	}
	stockPile.show(30,20,0);
	playedPile.show(100,20,0);
	
	
	if(mouseIsPressed)
	{
		if(!clicked)
		{
			valid = true;
			var x = mouseX;
			var y = mouseY;
			
			sourcePile = getPileByCoords(x,y);
			if(!sourcePile)
			{
				clicked = true;
				return;
			}
			
			
			if(mouseButton == RIGHT)
			{
				clicked = true;
				var currentCard = sourcePile.getTop();
				if(currentCard && !currentCard.hidden)
				{
					for(var i=0;i<finalPiles.length;++i)
					{
						if(finalPiles[i].empty() && currentCard.value=='A')
						{
							sourcePile.removeTop();
							finalPiles[i].placeOnTop(currentCard);
							break;
						}
						else if(!finalPiles[i].empty() && finalPiles[i].getTop().color == currentCard.color && finalPiles[i].getTop().lessThan(currentCard))
						{
							sourcePile.removeTop();
							finalPiles[i].placeOnTop(currentCard);
							break;
						}
					}
				}
			}
			if(mouseButton == CENTER)
			{
				clicked = true;				
				var changed = false;
				do
				{
					changed = false;
						for(var i=0;i<board.length;++i)
						{
							var currentCard = board[i].getTop();
							if(currentCard && !currentCard.hidden)
							{
								for(var j=0;j<finalPiles.length;++j)
								{
									if((finalPiles[j].empty() && currentCard.value=='A') || 
										(!finalPiles[j].empty() && finalPiles[j].getTop().color == currentCard.color && finalPiles[j].getTop().lessThan(currentCard)))
									{
										board[i].removeTop();
										finalPiles[j].placeOnTop(currentCard);
										changed = true;
										break;
									}
								}
							}
						}
						
						
						var currentCard = playedPile.getTop();
						if(currentCard)
						{
							for(var j=0;j<finalPiles.length;++j)
							{
								if((finalPiles[j].empty() && currentCard.value=='A') || 
										(!finalPiles[j].empty() && finalPiles[j].getTop().color == currentCard.color && finalPiles[j].getTop().lessThan(currentCard)))
								{
									playedPile.removeTop();
									finalPiles[j].placeOnTop(currentCard);
									changed = true;
									break;
								}
							}
						}
				}
				while(changed==true);				
			}
			if(mouseButton == LEFT)
			{
				if(sourcePile==stockPile)
				{
					if(!stockPile.empty())
					{
						playedPile.placeOnTop(stockPile.getTop());
						playedPile.showTop();
						stockPile.removeTop();
					}
					else
					{
						stockPile.cards = playedPile.cards.reverse();
						stockPile.setAllHidden();
						playedPile.clear();
					}
				}
				
				else if(sourcePile==playedPile && !playedPile.empty())
				{
					movedPile = new Pile();
					movedPile.placeOnTop(playedPile.getTop());
					playedPile.removeTop();
				}
				//pile from board, don't let them fuck up the final piles
				else if(y>100)
				{
					if(sourcePile.empty())
					{
						clicked = true;
						return;
					}
					//revealing of the top card
					if(sourcePile.getTop().hidden)
					{
						sourcePile.showTop();
					}
					else
					{
						//(y-130)/20
						var cardNum = max(sourcePile.cards.length - floor(y/20-6.5),1);
						cardNum = min(sourcePile.cards.length,cardNum);
						movedPile = new Pile(sourcePile.getSubPile(cardNum));
					}
				}
				clicked = true;
			}
		}
		//mouse held down
		else
		{
			if(movedPile && !movedPile.empty())
			movedPile.show(mouseX-25, mouseY-10,20);
		}
	}
}


function getPileByCoords(x,y)
{
	//boardpiles
	if(y>100)
	{
		if(x<90)
		{
			return board[0];
		}
		if(x<160)
		{
			return board[1];
		}
		if(x<230)
		{
			return board[2];
		}
		if(x<300)
		{
			return board[3];
		}
		if(x<370)
		{
			return board[4];
		}
		if(x<440)
		{
			return board[5];
		}
		if(x<520)
		{
			return board[6];
		}
	}
	
	//upper piles
	else
	{
		if(x<90)
		{
			return stockPile;
		}
		if(x<160)
		{
			return playedPile;
		}

		if(x>240 && x<300)
		{
			return finalPiles[0];
		}
		if(x>300 && x<370)
		{
			return finalPiles[1];
		}
		if(x>370 && x<440)
		{
			return finalPiles[2];
		}
		if(x>440 && x<520)
		{
			return finalPiles[3];
		}
	}
	
	return undefined;
}

function mouseClicked()
{
	
}

function mouseReleased()
{
	if(valid)
	{		
		var success = false;
		var x = mouseX;
		var y = mouseY;
		destPile = getPileByCoords(x,y);
		if(destPile && movedPile)
		{
			//we cant place cards up there
			if(destPile == stockPile || destPile == playedPile)
			{
				success = false;
			}
			
			else if(y<100)
			{
				if(movedPile.cards.length==1)
				{
					if(destPile.empty() && movedPile.getTop().value=='A')
					{
						success = true;
						destPile.placePile(movedPile.cards);
					}
					else if(!destPile.empty() && destPile.getTop().color == movedPile.getTop().color && destPile.getTop().lessThan(movedPile.getTop()))
					{
						success = true;
						destPile.placePile(movedPile.cards);
					}
				}
				else
				{
					success = false;
				}
			}
			else if(destPile.canPlacePile(movedPile))
			{
				success = true;
				destPile.placePile(movedPile.cards);
			}
			else
			{
				success = false;
			}
		}
		
		
		if(movedPile && !success)
		{
			sourcePile.placePile(movedPile.cards);
		}
		
		sourcePile = undefined;
		movedPile = undefined;
		clicked = false;
		valid = false;
	}
	var s = 0;
	for(var i=0;i<finalPiles.length;++i)
	{
		s += finalPiles[i].cards.length;
	}
	if(s==52)
	{
		alert('Game won!');
		gameover = true;
		setup();
	}
}