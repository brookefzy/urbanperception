import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
const MALE_COLOR = [0, 128, 255];
const FEMALE_COLOR = [255, 0, 128];

export const COLOR_SCALE = scaleThreshold()
  .domain([3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5])
  .range([
    [205, 243, 210],
    [218, 247, 166],
    [255, 195, 0],
    [255, 87, 51],
    [199, 0, 57],
    [144, 12, 63],
    [88, 24, 69]
  ]);

// Source data CSV
const DATA_URL =
  'https://raw.githubusercontent.com/brookefzy/urbanperception/master/data/perceppt.json'; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  longitude: -71.0589,
  latitude: 42.3601,
  zoom: 11,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

export default class App extends Component {
  _renderLayers() {
    const {
      data = DATA_URL,
      radius = 30,
      // maleColor = MALE_COLOR,
      // femaleColor = FEMALE_COLOR
    } = this.props;

    return [
      new ScatterplotLayer({
        id: 'scatter-plot',
        data,
        radiusScale: radius,
        radiusMinPixels: 0.25,
        getPosition: d => [d[0], d[1], 0],
        getFillColor: d => COLOR_SCALE(d[3]),
        // getFillColor: d => (d[2] === 1 ? maleColor : femaleColor),
        getRadius: 1,
        updateTriggers: {
          getFillColor: d => COLOR_SCALE(d[3])
        }
      })
    ];
  }

  render() {
    const {mapStyle = 'mapbox://styles/mapbox/light-v9'} = this.props;

    return (
      <DeckGL layers={this._renderLayers()} initialViewState={INITIAL_VIEW_STATE} controller={true}>
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
