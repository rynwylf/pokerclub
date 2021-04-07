import React from "react";

import VPIPTag from '../Tags/VPIPTag/VPIPTag';
import PFRTag from '../Tags/PFRTag/PFRTag';

import './CustomTooltip.scss';

const CustomTooltip = props => {
  const { active, payload } = props;
  if (active) {
    const currData = payload && payload.length ? payload[0].payload : null;
	return (
      <div className="tip">
	  	<p className="nameTitle">{currData.name}</p>
		<table>
			<tbody>
				<tr>
					<td className="label">VPIP</td>
					<td className="value">{currData.vpip}%</td>
					<td className="value"><VPIPTag vpip={currData.vpip} /></td>
				</tr>
				<tr>
					<td className="label">PFR</td>
					<td className="value">{currData.pfr}%</td>
					<td className="value"><PFRTag pfr={currData.pfr} /></td>
				</tr>
			</tbody>
		</table>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
