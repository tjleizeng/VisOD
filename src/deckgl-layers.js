import { GeoJsonLayer, ArcLayer } from 'deck.gl';
import {scaleThreshold} from 'd3-scale';


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

const COLOR_SCALE = scaleThreshold()
  .domain([0,200,500,1000,5000,10000])
  .range([
    [247, 249, 249],
    [171, 235, 198],
    [249, 231, 159],
    [250, 215, 160],
    [230, 126, 34],
    [211, 84, 0],
    [203, 67, 53]
  ]);



const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

export function renderLayers(props) {
  const { data, arcs, zones, onHover, onSelect, settings} = props;
  return [
    (settings.showEdge && arcs) &&
    new ArcLayer({
      id: 'arc',
      data: arcs,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getSourceColor: d => (d.gain > 0 ? inFlowColors : outFlowColors)[d.quantile],
      getTargetColor: d => (d.gain > 0 ? outFlowColors : inFlowColors)[d.quantile],
      getStrokeWidth: d => Math.min(d.value/5, 10),
      updateTriggers: {
        // triggered
        data: arcs
      }
    }),

    new GeoJsonLayer({
      id: 'geojson',
      data: zones,
      opacity: 0.2,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      fp64: true,
      getFillColor: f => COLOR_SCALE(
          data.outFlow[f.properties.OBJECTID-1]+data.inFlow[f.properties.OBJECTID-1]
      ),
      getElevation: 0,
      lightSettings: LIGHT_SETTINGS,
      pickable: true,
      onHover: onHover,
      onClick: onSelect,
      updateTriggers: {
        // triggered
        getFillColor: data
      }
    })
  ];
}
