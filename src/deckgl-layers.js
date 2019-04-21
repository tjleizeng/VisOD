import { ScatterplotLayer, HexagonLayer, GeoJsonLayer, ArcLayer } from 'deck.gl';
import {scaleQuantile, scaleLinear, scaleThreshold} from 'd3-scale';

const PICKUP_COLOR = [114, 19, 108];
const DROPOFF_COLOR = [243, 185, 72];

const HEATMAP_COLORS = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [44, 127, 184],
  [37, 52, 148]
];

const COLOR_SCALE = scaleThreshold()
  .domain([0,10,20,30,40,50])
  .range([
    [247, 249, 249],
    [171, 235, 198],
    [249, 231, 159],
    [250, 215, 160],
    [230, 126, 34],
    [211, 84, 0],
    [203, 67, 53]
  ]);

const OUT_FLOW_COLOR = [
  [52, 152, 219],
  [93, 173, 226],
  [133, 193, 233],
  [241, 148, 138],
  [236, 112, 99],
  [231, 76, 60]
];

const IN_FLOW_COLOR = [
  [231, 76, 60],
  [236, 112, 99],
  [241, 148, 138],
  [133, 193, 233],
  [93, 173, 226],
  [52, 152, 219]
];



const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const elevationRange = [0, 1000];

export function renderLayers(props) {
  const { data, hour, onHover, settings } = props;
  const filteredData = hour === null ? data : data.filter(d => d.hour === hour);

  return [
    settings.showScatterplot &&
      new ScatterplotLayer({
        id: 'scatterplot',
        getPosition: d => d.position,
        getColor: d => (d.pickup ? PICKUP_COLOR : DROPOFF_COLOR),
        getRadius: d => 5,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        data: filteredData,
        onHover,
        ...settings
      }),
    settings.showHexagon &&
      new HexagonLayer({
        id: 'heatmap',
        colorRange: HEATMAP_COLORS,
        elevationRange,
        elevationScale: 5,
        extruded: true,
        getPosition: d => d.position,
        lightSettings: LIGHT_SETTINGS,
        opacity: 0.8,
        pickable: true,
        data: filteredData,
        onHover,
        ...settings
      })
  ];
}
