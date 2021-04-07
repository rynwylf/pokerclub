import React from 'react';

import Block from '../../Block/Block';
import PFRTag from '../Tags/PFRTag/PFRTag';
import VPIPTag from '../Tags/VPIPTag/VPIPTag';

import './Place.scss';

const Place = props => {
  	const { players } = props;
	const sortedPlayers = players.sort ( ( p1, p2 ) => p1.place - p2.place );

	return <Block title={props.title}>
		<table>
			<tbody>
				<tr>
					<th className="name">Player</th>
					<th className="place">Place</th>
					<th className="rebuys">Rebuys</th>
					<th className="knockOuts">Knock Outs</th>
					<th className="points">Points</th>
				{/**	<th className="vpip">VPIP</th>
					<th className="style"></th>
					<th className="pfr">PFR</th>
					<th className="style"></th>*/}
				</tr>
				{sortedPlayers.map ( player => <tr key={player.code}>
							<td className="name">{player.name}</td>
							<td className="place">{player.place}</td>
							<td className="rebuys">{player.rebuys}</td>
							<td className="knockOuts">{player.knockOuts}</td>
							<td className="points">{player.points}</td>
							{/**<td className="vpip">{(100 * player.vpip).toFixed(1)}%</td>
							<td className="style"><VPIPTag vpip={(100 * player.vpip).toFixed(1)} /></td>
							<td className="pfr">{(100 * player.pfr).toFixed(1)}%</td>
							<td className="style"><PFRTag pfr={(100 * player.pfr).toFixed(1)} /></td>*/}
						</tr> )}
			</tbody>
		</table>
    </Block>
}

export default Place;
