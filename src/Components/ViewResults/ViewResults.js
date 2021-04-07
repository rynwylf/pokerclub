import React from 'react';

import Moment from 'react-moment';
import Chart from './Chart/Chart';
import StyleChart from './StyleChart/StyleChart';
import Place from './Place/Place';
import KnockOuts from './KnockOuts/KnockOuts';
import HighHand from './HighHand/HighHand';


import './ViewResults.scss';
/*
const RenderCommand = ( command ) =>
{
	if ( command.error === true )
	{
		return <span>Error Parsing: &quot;{command.text}&quot;<br/>{JSON.stringify(command.errorValue)}NOTHING?</span>
	}
	else
	{
		return <span><strong>{command.outcome.event}</strong> {JSON.stringify(command.outcome)}</span>
	}
}
*/
const ViewResults = ( props ) =>
{
	var games = props.data.games.map ( ( game, index ) => <div className="game" key={index}>
						<Chart key={"chart" + ( index + 1 )} title={"Game " + ( index + 1 )} game={props.data.games[index]} />
					{ props.showStyles === true ? <StyleChart key={"styleschart" + ( index + 1 )} title={"Game " + ( index + 1 ) + " Play Styles"} game={props.data.games[index]} /> : null }
						<div className="blocks" key={"data-" + ( index + 1 )}>
							<Place players={props.data.games[index].players} title={"Game " + ( index + 1 ) + " Results"}/>
							<KnockOuts knockOuts={props.data.games[index].knockOuts} title={"Game " + ( index + 1 ) + " Knockouts"} />
						</div>
					{/**	<ul>
							{ props.data.games[index].events.map ( ( event, eindex ) => <li key={"g" + index + "-" + eindex} id={"row-"+eindex}><Moment format="HH:mm:ss">{event.dateTime.toString ()}</Moment><br/>{RenderCommand ( event ) }</li>) }
						</ul>*/}
					</div> );

	return <div className="game-results">
				<h2><Moment format="D-MMMM-YYYY">{props.data.start}</Moment></h2>
					<h4>High Hand of the Night</h4>
					<div>{props.data.highHands.map((highHand, index) => <HighHand key={index} highHand={highHand} /> )}</div>
					{games}
			    </div>
}


export default ViewResults;
