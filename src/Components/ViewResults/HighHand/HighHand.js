import React from 'react';

import './HighHand.scss';

const toText = hand =>
{
	if ( hand === "ROYAL_FLUSH" ) { return "Royal Flush"; }
	else if ( hand === "STRAIGHT_FLUSH" ) { return "Straight Flush"; }
	else if ( hand === "FOUR_OF_A_KIND" ) { return "Quads"; }
	else if ( hand === "FLUSH" ) { return "Flush"; }
	else if ( hand === "STRAIGHT" ) { return "Straight"; }
	else if ( hand === "FULL_HOUSE" ) { return "Full House"; }
	else if ( hand === "THREE_OF_A_KIND" ) { return "Trips"; }
	else if ( hand === "TWO_PAIR" ) { return "Two Pair"; }
	else if ( hand === "ONE_PAIR" ) { return "One Pair"; }
	else if ( hand === "HIGH_CARD" ) { return "High Card"; }
	else { return hand }
}

const HighHand = props => {
	return <p className="highHand">
			{toText(props.highHand.hand.type)}&nbsp;
				{props.highHand.hand.cards[0].ordinal}{props.highHand.hand.cards[0].suit},&nbsp;
				{props.highHand.hand.cards[1].ordinal}{props.highHand.hand.cards[1].suit},&nbsp;
			 	{props.highHand.hand.cards[2].ordinal}{props.highHand.hand.cards[2].suit},&nbsp;
			  	{props.highHand.hand.cards[3].ordinal}{props.highHand.hand.cards[3].suit},&nbsp;
			   	{props.highHand.hand.cards[4].ordinal}{props.highHand.hand.cards[4].suit}
			<br/>
			<span className="sub">by <span className="name">{props.highHand.player.name}</span></span>
		</p>
}

export default HighHand;
