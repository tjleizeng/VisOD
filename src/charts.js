import React from 'react';
import { charts } from './style';

import {
  VerticalRectSeries,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

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
  const ymax = getMaxOfArray(dispData.pickUp);
  const ymin = -getMaxOfArray(dispData.dropOff);
  const axmax =  Math.max(-ymin,ymax);

  const pickupCounts = dispData.hour.map((k, i) => ({hour: Number(k), x: Number(k) + 0.8, x0: Number(k) + 0.2, y: dispData.pickUp[i]-ymin, y0: -ymin}));
  const dropoffCounts = dispData.hour.map((k, i) => ({hour: Number(k), x: Number(k) + 0.8, x0: Number(k) + 0.2, y: -ymin, y0: -dispData.dropOff[i]-ymin}));
  //console.log(pickupCounts, dropoffCounts);
  const positiveBar = pickupCounts.map(d => {
    let color = '#20639B';
    if (d.hour === selectedHour) {
      color = '#3CAEA3';
    }
    // if (d.hour === highlightedHour) {
    //   color = '#17B8BE';
    // }
    return { ...d, color };
  });

  const negativeBar = dropoffCounts.map(d => {
    let color = '#ED553B';
    if (d.hour === selectedHour) {
      color = '#F6D55C';
    }
    // if (d.hour === highlightedHour) {
    //   color = '#17B8BE';
    // }
    return { ...d, color };
  });

  return (<div style={charts}>
    <h2>Trips by hour</h2>
    <p>Pick an hour. Positives are pick ups, negatives are drop offs</p>
    <XYPlot
      margin={{ left: 80, right: 25, top: 10, bottom: 25 }}
      height={150}
      width={400}
      yDomain={[-axmax-ymin, axmax-ymin]}
      //onMouseLeave={() => highlight(null)}
    >
      <YAxis
        tickFormat={d => (d+ymin).toFixed(0)}
        tickValues={[-axmax-ymin, -ymin, axmax-ymin]}
      />
      <VerticalRectSeries
        colorType="literal"
        data={positiveBar}
        //onValueMouseOver={d => highlight(d.hour)}
        onValueClick={d => select(d.hour)}
        style={{ cursor: 'pointer' }}
      />
      <VerticalRectSeries
          colorType="literal"
          data={negativeBar}
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