// Modified based on the vis-academy example building-a-geospatial-app
// Author: Zengxiang Lei

/* global window */
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import { LayerControls, MapStylePicker, OD_CONTROLS } from './controls';
import DeckGL from 'deck.gl';
import { renderLayers } from './deckgl-layers';
import Charts from './charts';
import Panel from './panel';
import {scaleQuantile} from 'd3-scale';
import taxiData from '../data/fhv.js';
import taxiZone from '../data/taxi_zones.json';

const outFlowColors = [
  [52, 152, 219],
  [93, 173, 226],
  [133, 193, 233],
  [241, 148, 138],
  [236, 112, 99],
  [231, 76, 60]
];

const inFlowColors = [
  [231, 76, 60],
  [236, 112, 99],
  [241, 148, 138],
  [133, 193, 233],
  [93, 173, 226],
  [52, 152, 219]
];

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.65,
  zoom: 10.5,
  minZoom: 5,
  maxZoom: 16,
  pitch: 40,
  bearing: 0
};

// Helper function
Array.prototype.SumArray = function (arr) {
  var sum = [];
  if (arr != null && this.length == arr.length) {
    for (var i = 0; i < arr.length; i++) {
      sum.push(this[i] + arr[i]);
    }
  }

  return sum;
}

function Reshape(input, dim) {
  const arr = input.slice();
  var od = [];
  while(arr.length) od.push(arr.splice(0,dim));
  return od;
}

function findIndicesOfMax(input, count) {
  var output = [];
  for (var i = 0; i < input.length; i++) {
    output.push(i); // add index to output array
    if (output.length > count) {
      output.sort(function(a, b) { return input[b] - input[a]; }); // descending sort the output array
      output.pop(); // remove the last index (index of smallest element in output array)
    }
  }
  return output;
}

export default class App extends Component {
  state = {
    hoveredObject: null,
    selectedObject: null,
    arcs: null,
    zones: taxiZone.features,
    settings: Object.keys(OD_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: OD_CONTROLS[key].value
      }),
      {}
    ),
    selectedHour: null,
    style: 'mapbox://styles/mapbox/outdoors-v10'
  };

  componentDidMount() {
    this._processData();
  }

  _processData = () => {

    const rawData = {
      OD: [],
      pickUp: [],
      dropOff: []
    }

    rawData.OD = taxiData;
    rawData.pickUp = taxiData.slice().map(a => Reshape(a, 266).map(b => b.reduce((c, d) => c + d, 0)));
    rawData.dropOff = taxiData.slice().map(a => Reshape(a, 266).reduce((b,c) => b.SumArray(c)));


    //Calculate for this times display
    const dispData = {
      OD: [],
      pickUp: [],
      dropOff: [],
      inFlow:[],
      outFlow: [],
      hour:[]
    }
    dispData.OD = Reshape(rawData.OD.reduce((b,c) => b.SumArray(c)),266);
    dispData.pickUp = rawData.pickUp.map(a => a.reduce((b, c) => b + c, 0));
    dispData.dropOff = rawData.dropOff.map(a => a.reduce((b, c) => b + c, 0));
    dispData.inFlow = dispData.OD.map(a => a.reduce((b, c) => b + c, 0));
    dispData.outFlow = dispData.OD.reduce((b,c) => b.SumArray(c));
    dispData.hour = Array(24).fill(0).map((a,b)=>b+1);


    this.setState({rawData, dispData})
  };

  _recalculateData = () => {
    const dispData = {
      OD: [],
      pickUp: [],
      dropOff: [],
      inFlow:[],
      outFlow: [],
      hour:[]
    }
    if(this.state.selectedHour && this.state.selectedObject){
      dispData.OD = Reshape(this.state.rawData.OD[this.state.selectedHour-1],266);
      dispData.pickUp = this.state.rawData.pickUp.map(a => a[this.state.selectedObject.properties.OBJECTID-1]);
      dispData.dropOff = this.state.rawData.dropOff.map(a => a[this.state.selectedObject.properties.OBJECTID-1]);
      dispData.inFlow = dispData.OD.map(a => a.reduce((b, c) => b + c, 0));
      dispData.outFlow = dispData.OD.reduce((b,c) => b.SumArray(c));
      dispData.hour = Array(24).fill(0).map((a,b)=>b+1);
    }
    else if(this.state.selectedHour){
      dispData.OD = Reshape(this.state.rawData.OD[this.state.selectedHour-1],266);
      dispData.pickUp = this.state.rawData.pickUp.map(a => a.reduce((b, c) => b + c, 0));
      dispData.dropOff = this.state.rawData.dropOff.map(a => a.reduce((b, c) => b + c, 0));
      dispData.inFlow = dispData.OD.map(a => a.reduce((b, c) => b + c, 0));
      dispData.outFlow = dispData.OD.reduce((b,c) => b.SumArray(c));
      dispData.hour = Array(24).fill(0).map((a,b)=>b+1);
    }
    else if(this.state.selectedObject){
      dispData.OD = Reshape(this.state.rawData.OD.reduce((b,c) => b.SumArray(c)),266);
      dispData.pickUp = this.state.rawData.pickUp.map(a => a[this.state.selectedObject.properties.OBJECTID-1]);
      dispData.dropOff = this.state.rawData.dropOff.map(a => a[this.state.selectedObject.properties.OBJECTID-1]);
      dispData.inFlow = dispData.OD.map(a => a.reduce((b, c) => b + c, 0));
      dispData.outFlow = dispData.OD.reduce((b,c) => b.SumArray(c));
      dispData.hour = Array(24).fill(0).map((a,b)=>b+1);
    }
    else{
      dispData.OD = Reshape(this.state.rawData.OD.reduce((b,c) => b.SumArray(c)),266);
      dispData.pickUp = this.state.rawData.pickUp.map(a => a.reduce((b, c) => b + c, 0));
      dispData.dropOff = this.state.rawData.dropOff.map(a => a.reduce((b, c) => b + c, 0));
      dispData.inFlow = dispData.OD.map(a => a.reduce((b, c) => b + c, 0));
      dispData.outFlow = dispData.OD.reduce((b,c) => b.SumArray(c));
      dispData.hour = Array(24).fill(0).map((a,b)=>b+1);
    }
    this.setState({dispData},()=>{this._recalculateArcs()});
  }

  _recalculateArcs() {
    var arcs = null;
    var ranks = null;
    if (this.state.selectedObject) {
      ranks = {
        destination: [],
        destinationName: [],
        destinationTrips: [],
        origin: [],
        originName: [],
        originTrips: []
      }
      //console.log(this.state.selectedObject)
      const X = this.state.selectedObject.properties.X;
      const Y = this.state.selectedObject.properties.Y;
      const selectedID = this.state.selectedObject.properties.OBJECTID;
      const toIDs = Array(262).fill(0).map((a, b) => b + 1);
      const outFlow = this.state.dispData.OD[selectedID - 1].slice(0,262);
      const inFlow = this.state.dispData.OD.map(a => a[selectedID-1]).slice(0,262);
      ranks.destination = findIndicesOfMax(outFlow, 10);
      ranks.origin = findIndicesOfMax(inFlow, 10);
      ranks.destinationName = ranks.destination.map(a =>{
        const f = this.state.zones.find(h => (h.properties.OBJECTID - 1) === a);
        return f.properties.zone;});
      ranks.originName =ranks.origin.map(a =>{
        const f = this.state.zones.find(h => (h.properties.OBJECTID - 1) === a);
        return f.properties.zone;});
      ranks.destinationTrips = ranks.destination.map(a => outFlow[a]);
      ranks.originTrips = ranks.origin.map(a => inFlow[a]);

      if (this.state.settings.dispType == 'outflow') {
        arcs = toIDs.map(toID => {
          const f = this.state.zones.find(h => (h.properties.OBJECTID - 1) === toID);
          return {
            source: [X, Y],
            target: [f.properties.X, f.properties.Y],
            value: outFlow[toID]
          };
        });
        const scale = scaleQuantile()
            .domain(arcs.map(a => Math.abs(a.value)))
            .range(outFlowColors.map((c, i) => i));

        arcs.forEach(a => {
          a.gain = Math.sign(a.value);
          a.quantile = scale(Math.abs(a.value));
        });
      } else {
        arcs = toIDs.map(toID => {
          const f = this.state.zones.find(h => (h.properties.OBJECTID - 1) === toID);
          return {
            source: [f.properties.X, f.properties.Y],
            target: [X, Y],
            value: inFlow[toID]
          };
        });
        const scale = scaleQuantile()
            .domain(arcs.map(a => Math.abs(a.value)))
            .range(inFlowColors.map((c, i) => i));

        arcs.forEach(a => {
          a.gain = Math.sign(a.value);
          a.quantile = scale(Math.abs(a.value));
        });
      }
    }
    this.setState({arcs, ranks});
  }

  _onHover({x, y, object}) {
    this.setState({x, y, hoveredObject: object});
  }

  _onHover = this._onHover.bind(this);

  _onSelectZone({object}){
    //console.log(object)
    this.setState({selectedObject: object === this.state.selectedObject ? null : object
    });
    this._recalculateData();
  }

  _onSelectZone = this._onSelectZone.bind(this);

  _onSelectHour(selectedHour){
    this.setState({
      selectedHour:
        selectedHour === this.state.selectedHour ?
          null :
          selectedHour
    }, ()=>{this._recalculateData();});
  }

  onStyleChange = style => {
    this.setState({ style });
  };

  _onWebGLInitialize = gl => {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  };

  _updateLayerSettings(settings) {
    this.setState({ settings }, () => {
      this._recalculateArcs();
    });
  }

  _renderTooltip() {
    const {x, y, hoveredObject,dispData} = this.state;
    return (
        // if hoveredObject is null, then the rest part won't be execute
        hoveredObject && (
            <div className="tooltip" style={{top: y, left: x}}>
              <div> Location id: {hoveredObject.properties.OBJECTID} </div>
              <div> Zone: {hoveredObject.properties.zone} </div>
              <div> In flow: {dispData.inFlow[hoveredObject.properties.OBJECTID-1]} </div>
              <div> Out flow: {dispData.outFlow[hoveredObject.properties.OBJECTID-1]} </div>
            </div>
        )
    );
  }
  _renderTooltip = this._renderTooltip.bind(this);

  render() {
    const { viewState, controller = true } = this.props;
    const data = this.state.dispData;
    const zones = this.state.zones;
    const arcs = this.state.arcs;
    return (
      <div>
        <MapStylePicker
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        <LayerControls
          settings={this.state.settings}
          propTypes={OD_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}
        />
        <DeckGL
          {...this.state.settings}
          onWebGLInitialized={this._onWebGLInitialize}
          layers={renderLayers({
            data: data,
            arcs: arcs,
            zones: zones,
            onHover: this._onHover,
            onSelect: this._onSelectZone,
            settings: this.state.settings
          })}
          initialViewState={INITIAL_VIEW_STATE}
          viewState={viewState}
          controller={controller}
        >
          <StaticMap mapStyle={this.state.style} />
          {this._renderTooltip}
        </DeckGL>
        <Charts {...this.state}
          select={hour => this._onSelectHour(hour)}
        />
        <Panel {...this.state} />
      </div>
    );
  }
}
