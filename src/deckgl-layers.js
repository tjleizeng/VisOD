import { ScatterplotLayer, GeoJsonLayer, ArcLayer } from 'deck.gl';
import {scaleThreshold} from 'd3-scale';


const pickupColor = [210,1,23];
const dropoffColor = [0, 128, 255];

const inFlowColors = [
  [52, 152, 219],
  [93, 173, 226],
  [133, 193, 233],
  [241, 148, 138],
  [236, 112, 99],
  [231, 76, 60]
];

const outFlowColors = [
  [231, 76, 60],
  [236, 112, 99],
  [241, 148, 138],
  [133, 193, 233],
  [93, 173, 226],
  [52, 152, 219]
];

const COLOR_SCALE = scaleThreshold()
  .domain([0,100,200,500,1000,5000])
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
      getSourceColor: d => outFlowColors[d.quantile],
      getTargetColor: d => inFlowColors[d.quantile],
      getStrokeWidth: d => d.value>1? Math.min(d.value,5) : 0,
      updateTriggers: {
        // triggered
        data: arcs
      }
    }),
    new ScatterplotLayer({
      id: 'scatterplot',
      getPosition: d => (
          settings.dispType == 'outflow' ? d.target : d.source
      ),
      getFillColor: d => (settings.dispType == 'outflow' ? pickupColor : dropoffColor),
      getRadius: d => Math.min(d.value * 60, 300),
      opacity: 1,
      pickable: false,
      radiusMinPixels: 0,
      radiusMaxPixels: 350,
      data: arcs,
      updateTriggers: {
        // triggered
        data: arcs
      }
    }),
    new GeoJsonLayer({
      id: 'geojson',
      data: zones,
      opacity: 0.3,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      fp64: true,
      getFillColor: f => (
        settings.dispType == 'outflow' ? COLOR_SCALE(data.outFlow[f.properties.OBJECTID - 1]) : COLOR_SCALE(
            data.inFlow[f.properties.OBJECTID - 1])
      ),
      getElevation: 0,
      lightSettings: LIGHT_SETTINGS,
      pickable: true,
      onHover: onHover,
      onClick: onSelect,
      updateTriggers: {
        // triggered
        getFillColor: {data,settings}
      }
    })
  ];
}
