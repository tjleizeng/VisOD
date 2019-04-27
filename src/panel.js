import React from 'react';
import { panel } from './style';

export default function Panel({ranks}) {
  const rows = [];
  if(ranks){
    for (var i = 0; i < ranks.destination.length; i++) {
      let rowID = `row${i}`;
      let cell = [];
      let cellID = `cell${i}-${0}`;
      cell.push(<td key={cellID} id={cellID}>{ranks.destinationName[i]}</td>);
      cellID = `cell${i}-${1}`;
      cell.push(<td key={cellID} id={cellID}>{ranks.destinationTrips[i]} ({(ranks.destinationPer[i]* 100).toFixed(1) + '%'})</td>);
      cellID = `cell${i}-${2}`;
      cell.push(<td key={cellID} id={cellID}>{ranks.originName[i]}</td>);
      cellID = `cell${i}-${3}`;
      cell.push(<td key={cellID} id={cellID}>{ranks.originTrips[i]} ({(ranks.originPer[i]* 100).toFixed(1) + '%'})</td>);
      rows.push(<tr key={i} id={rowID}>{cell}</tr>);
    }
  }

  return(<div style={panel}>
  <h2> Top 6 destinations and origins </h2>
    {ranks? (
  <table id="simple-board" border="1" width = "360"  height="300">
    <tbody>
    <tr>
      <th colSpan = "2">Outer trips</th>
      <th colSpan="2">Enter trips</th>
    </tr>
    <tr>
      <th>Name</th>
      <th>Trips</th>
      <th>Name</th>
      <th>Trips</th>
    </tr>
    {rows}
    </tbody>
  </table>): <p>Click one zone and see what would happen :)</p>}
  </div>
  );
}