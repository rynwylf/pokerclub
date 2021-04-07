// https://codesandbox.io/s/recharts-area-chart-with-date-axis-6o55k?file=/src/DateArea.js:0-3387

import React from "react";

import {
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Scatter,
  Label,
  Tooltip,
  LabelList,
  ResponsiveContainer
} from "recharts";
import CustomTooltip from "./CustomTooltip";

import './StyleChart.scss';

const colours = [
		"#96B6C5",
		"#7AC1A3",
		"#C7A488",
		"#E98547",
		"#8E4942",
		"#06A3B6",
		"#204572",
		"#D5797C",
		"#DEC978",
		"#BCBDB8"
	];

const StyleChart = ( props ) => {

	const maxPFR = props.game.players.reduce ( ( max, player ) => Math.max ( Math.ceil ( 100 * player.pfr ) + 2, max ), 50 );

  return (
    <div className="chart">
      <h3>{props.title}</h3>
      <ResponsiveContainer width="100%" height="100%">
	  <ScatterChart
			  width={400}
			  height={400}
			  margin={{
				  top: 10,
	              right: 60,
	              bottom: 160,
	              left: 60
			  }}
			>
	  		<CartesianGrid />
			<XAxis type="number" dataKey="pfr" name="Aggression (PFR)" unit="%" domain={[0,maxPFR]}>
				<Label value="Aggression (PFR)" position="bottom" offset={20} />
			</XAxis>
			<YAxis type="number" dataKey="vpip" name="Participation (VPIP)" unit="%" domain={[0,100]} >
				<Label value="Participation (VPIP)" angle={-90} position="left" offset={30} />
			</YAxis>
			<Tooltip content={<CustomTooltip  />}/>
			{ props.game.players.map ( ( player, index ) => <Scatter key={player.code} name={player.name} data={[{name: player.name, vpip: (100 * player.vpip).toFixed(1), pfr: (100 * player.pfr).toFixed(1)}]} fill={colours[index]}>
						<LabelList dataKey="player" />
					</Scatter> 			) }

		</ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StyleChart;
