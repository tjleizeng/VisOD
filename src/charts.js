import React from 'react';
import { charts } from './style';

import {
  VerticalBarSeries,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';

export default function Charts({
  //highlight,
  //highlightedHour,
  settings,
  dispData,
  select,
  selectedHour
}) {
  if (!dispData) {
    return (<div style={charts} />);
  }

  //console.log(settings)
  var counts = []
  if(settings.dispType == "outflow") {
    const sums = dispData.pickUp.reduce((a, b) => a + b);
    counts = dispData.hour.map((k, i) => ({hour: Number(k), x: Number(k) + 0.5, y: dispData.pickUp[i] / sums}));
  }
  else{
    const sums = dispData.dropOff.reduce((a, b) => a + b);
    counts = dispData.hour.map((k, i) => ({hour: Number(k), x: Number(k) + 0.5, y: dispData.dropOff[i] / sums}));
  }
  //console.log(counts);
  const data = counts.map(d => {
    let color = '#125C77';
    if (d.hour === selectedHour) {
      color = '#19CDD7';
    }
    // if (d.hour === highlightedHour) {
    //   color = '#17B8BE';
    // }
    return { ...d, color };
  });

  return (<div style={charts}>
    <h2>Trips by hour</h2>
    <p>As percentage of all trips</p>
    <XYPlot
      margin={{ left: 40, right: 25, top: 10, bottom: 25 }}
      height={140}
      width={480}
      yDomain={[0, 0.1]}
      //onMouseLeave={() => highlight(null)}
    >
      <YAxis
        tickFormat={d => (d * 100).toFixed(0) + '%'}
      />
      <VerticalBarSeries
        colorType="literal"
        data={data}
        //onValueMouseOver={d => highlight(d.hour)}
        onValueClick={d => select(d.hour)}
        style={{ cursor: 'pointer' }}
      />
      <XAxis
        tickFormat={h => (h % 24) >= 12 ?
          (h % 12 || 12) + 'PM' :
          (h % 12 || 12) + 'AM'
        }
        tickSizeInner={0}
        tickValues={[0, 6, 12, 18, 24]}
      />
    </XYPlot>
  </div>);
}