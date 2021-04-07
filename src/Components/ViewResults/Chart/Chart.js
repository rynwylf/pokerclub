// https://codesandbox.io/s/recharts-area-chart-with-date-axis-6o55k?file=/src/DateArea.js:0-3387

import React from "react";
import { useState, useEffect } from 'react';
import { add, format, differenceInSeconds } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import CustomTooltip from "./CustomTooltip";

import './Chart.scss';



function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}



const dateFormatter = date => {
  return format(new Date(date), "HH:mm");
};

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

/**
 * get the dates between `startDate` and `endSate` with equal granularity
 */
const getTicks = (startDate, endDate) => {
  const diffSeconds = differenceInSeconds(endDate, startDate);

  let current = startDate;
  let velocity = 60;// Math.round(diffSeconds / (num - 1));

  const ticks = [startDate.getTime()];

  for (let i = 1; i < diffSeconds - 1; i+=60) {
    ticks.push(add(current, { seconds: i * velocity }).getTime());
  }

  ticks.push(endDate.getTime());
  return ticks;
};

/**
 * Add data of the date in ticks,
 * if there is no data in that date in `data`.
 *
 * @param Array<number> _ticks
 * @param {*} data
 */
const fillTicksData = (_ticks, data) => {
  const ticks = [..._ticks];
  const filled = [];
  let currentTick = ticks.shift();
  let lastData = null;
  for (const it of data) {
    if (ticks.length && it.date > currentTick && lastData) {
      filled.push({ ...lastData, ...{ date: currentTick } });
      currentTick = ticks.shift();
    } else if (ticks.length && it.date === currentTick) {
      currentTick = ticks.shift();
    }

    filled.push(it);
    lastData = it;
  }

  return filled;
};

const ResultsChart = ( props ) => {
	const { height, width } = useWindowDimensions();
  const startDate = props.game.start;
  const endDate = props.game.end;
  const data = props.game.stacks;

  /*[
    { date: startDate.getTime(), val: 2000, val2: 5000 },
    { date: new Date("2021-03-18T19:15:35.084Z").getTime(), val1: 5000, val2: 5000 },
    { date: new Date("2021-03-18T19:30:35.084Z").getTime(), val1: 7000, val2: 1100 },
    { date: new Date("2021-03-18T21:00:35.084Z").getTime(), val1: 6000, val2: 200 },
    { date: new Date("2021-03-18T22:00:35.084Z").getTime(), val1: 9000, val2: 10000 }
];*/

  const domain = [dataMin => dataMin, () => endDate.getTime()];
  const ticks = getTicks(startDate, endDate);
  const filledData = fillTicksData(ticks, data);

  return (
    <div className="chart">
      <h3>{props.title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={900}
          height={250}
          data={filledData}
          margin={{
            top: 10,
            right: width <= 768 ? 60 : 60,
            bottom: width <= 768 ? 200 : 100,
            left: width <= 768 ? 0 : 60
          }}
        >
			<Legend verticalAlign="bottom" height={36}/>
          <XAxis
            dataKey="dateTime"
            hasTick
            scale="time"
            tickFormatter={dateFormatter}
            type="number"
            domain={domain}
            ticks={ticks}
          />
          <YAxis tickCount={7} hasTick />
          <Tooltip content={<CustomTooltip players={props.game.players}/>} />
		  { props.game.players.map ( ( player, index ) => <Line key={player.code} name={player.name} type="monotone" dot={false} dataKey={player.code} stroke={colours[index]} strokeWidth={3} legendType="square" /> ) }
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;
