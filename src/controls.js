import React, { Component } from 'react';
import { mapStylePicker, layerControl } from './style';

export const OD_CONTROLS = {
  showEdge: {
    displayName: 'Show Edges',
    type: 'boolean',
    value: true
  },
  dataSet: {
    displayName: 'Change data',
    type: 'dorpdownlist',
    value: 'fhv',
    options:[
      { label: 'FHV', value: 'fhv' },
      { label: 'Yellow Taxi', value: 'yellow' }]
  },
  dispType: {
    displayName: 'Display type',
    type: 'dorpdownlist',
    value: 'outflow',
    options:[
      { label: 'Drop off', value: 'inflow' },
      { label: 'Pick up', value: 'outflow' }]
  }
};

const MAPBOX_DEFAULT_MAPSTYLES = [
  { label: 'Streets V10', value: 'mapbox://styles/mapbox/streets-v10' },
  { label: 'Outdoors V10', value: 'mapbox://styles/mapbox/outdoors-v10' },
  { label: 'Light V9', value: 'mapbox://styles/mapbox/light-v9' },
  { label: 'Dark V9', value: 'mapbox://styles/mapbox/dark-v9' },
  { label: 'Satellite V9', value: 'mapbox://styles/mapbox/satellite-v9' },
  {
    label: 'Satellite Streets V10',
    value: 'mapbox://styles/mapbox/satellite-streets-v10'
  },
  {
    label: 'Navigation Preview Day V4',
    value: 'mapbox://styles/mapbox/navigation-preview-day-v4'
  },
  {
    label: 'Navitation Preview Night V4',
    value: 'mapbox://styles/mapbox/navigation-preview-night-v4'
  },
  {
    label: 'Navigation Guidance Day V4',
    value: 'mapbox://styles/mapbox/navigation-guidance-day-v4'
  },
  {
    label: 'Navigation Guidance Night V4',
    value: 'mapbox://styles/mapbox/navigation-guidance-night-v4'
  }
];

export function MapStylePicker({ currentStyle, onStyleChange }) {
  return (
    <select
      className="map-style-picker"
      style={mapStylePicker}
      value={currentStyle}
      onChange={e => onStyleChange(e.target.value)}
    >
      {MAPBOX_DEFAULT_MAPSTYLES.map(style => (
        <option key={style.value} value={style.value}>
          {style.label}
        </option>
      ))}
    </select>
  );
}

export class LayerControls extends Component {
  _onValueChange(settingName, newValue) {
    const { settings } = this.props;
    // Only update if we have a confirmed change
    if (settings[settingName] !== newValue) {
      // Create a new object so that shallow-equal detects a change
      const newSettings = {
        ...this.props.settings,
        [settingName]: newValue
      };

      this.props.onChange(newSettings);
    }
  }

  render() {
    const { title, settings, propTypes = {} } = this.props;

    return (
      <div className="layer-controls" style={layerControl}>
        {title && <h4>{title}</h4>}
        {Object.keys(settings).map(key => (
          <div key={key}>
            <label>{propTypes[key].displayName}</label>
            <div style={{ display: 'inline-block', float: 'right' }}>
              {settings[key]}
            </div>
            <Setting
              settingName={key}
              value={settings[key]}
              propType={propTypes[key]}
              onChange={this._onValueChange.bind(this)}
            />
          </div>
        ))}
      </div>
    );
  }
}

const Setting = props => {
  const { propType } = props;
  if (propType && propType.type) {
    switch (propType.type) {
      case 'range':
        return <Slider {...props} />;

      case 'boolean':
        return <Checkbox {...props} />;
      case 'dorpdownlist':
        return <Dropdownlist {...props} />;
      default:
        return <input {...props} />;
    }
  }
};

const Checkbox = ({ settingName, value, onChange }) => {
  return (
    <div key={settingName}>
      <div className="input-group">
        <input
          type="checkbox"
          id={settingName}
          checked={value}
          onChange={e => onChange(settingName, e.target.checked)}
        />
      </div>
    </div>
  );
};

const Slider = ({ settingName, value, propType, onChange }) => {
  const { max = 100 } = propType;

  return (
    <div key={settingName}>
      <div className="input-group">
        <div>
          <input
            type="range"
            id={settingName}
            min={0}
            max={max}
            step={max / 100}
            value={value}
            onChange={e => onChange(settingName, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

const Dropdownlist = ({ settingName, value, propType, onChange }) => {
  const {options} = propType;
  return(
      <div key={settingName}>
        <div className="input-group">
          <div>
            <select
                value = {value}
                onChange={e => onChange(settingName, e.target.value)}
            >
              {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
              ))}
            </select>
          </div>
        </div>
      </div>
  );
};