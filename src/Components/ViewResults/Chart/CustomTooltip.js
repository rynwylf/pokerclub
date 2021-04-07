import React from "react";
import Moment from 'react-moment';

import './CustomTooltip.scss';

const CustomTooltip = props => {
  const { active, payload, players } = props;
  if (active) {
    const currData = payload && payload.length ? payload[0].payload : null;
	const sortedPlayers = players.sort ( ( player1, player2 ) => ( currData[player2.code] ? currData[player2.code] : 0 ) - ( currData[player1.code] ? currData[player1.code] : 0 ) );
    return (
      <div className="area-chart-tooltip tip">
        <p key="time" className="timeTitle">
			<Moment format="HH:mm">{currData.dateTime}</Moment>
        </p>
		<table>
			<tbody>
         		{sortedPlayers.map ( player => ( ( !currData[player.code] && currData[player.code] !== 0 ) ? null : <tr key={player.code}><td className="name">{player.name}</td><td className="value">{currData[player.code]}</td></tr> ))}
			</tbody>
		</table>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
