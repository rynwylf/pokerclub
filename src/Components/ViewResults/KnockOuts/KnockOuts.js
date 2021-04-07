import React from 'react';
import Moment from 'react-moment';

import Block from '../../Block/Block';

import './KnockOuts.scss';

const Place = props => {
  	const { knockOuts } = props;

	return <Block title={props.title}>
		<table>
			<tbody>
				<tr>
					<th className="out">Player</th>
					<th className="time">Place</th>
					<th className="koby">By</th>
				</tr>
					{knockOuts.map ( ( ko, index ) => <tr key={index}>
							<td className="out">{ko.knockedOut.name}</td>
							<td className="time"><Moment format="HH:mm">{ko.dateTime}</Moment></td>
							<td className="koby">{ ko.by.map((player, index) => <span key={index}>{player.name}</span>) }</td>
						</tr> )}
			</tbody>
		</table>
    </Block>
}

export default Place;
