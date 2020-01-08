import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import MapComponentLink from './containers/maplink';
import SearchComponentLink from './containers/searchlink';
import {configureMapView, fetchWMTSLayer, setSearchProjection} from './actions';
import {mapReducer} from './reducers/map';
import {searchReducer} from './reducers/search';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Cluster, OSM, Vector as VectorSource } from 'ol/source';
import {Circle, Fill, Stroke, Style, Text} from 'ol/style';
import {get as getProjection} from 'ol/proj';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import ld from 'lodash';
const _ = ld.noConflict();

const rootReducer = combineReducers({
    map: mapReducer,
    search: searchReducer
});

const middleware = applyMiddleware(thunk);
const store = createStore( rootReducer, middleware);

if(GHDataInMap == undefined) {
    throw "GHDataInMap object missing";
}

const settings = GHDataInMap.settings;

// Add extra projections
GHDataInMap.pro4j.forEach( (projection) => {
    try {
        proj4.defs(projection[0], projection[1]);
    }
    catch(ex) {
        console.log('Failed to define projection', ex);
    }
});
register(proj4);

const style = new Style({
    image: new Circle({
        radius: settings.style_circle_radius,
        stroke: new Stroke({
            color: settings.style_circle_stroke_color
        }),
        fill: new Fill({
            color: settings.style_circle_fill_color
        })
    }),
    text: new Text({
        text: '📌',
        font: settings.style_circle_text_font,
        scale: settings.style_circle_text_scale,
        textBaseline: settings.style_circle_text_baseline,
        fill: new Fill({
            color: settings.style_text_color
        })
    }),
});

let zoom = settings.zoom;
let center = [settings.center_x, settings.center_y].map(parseFloat);
// Neem huidige positie over indien aanwezig
const current_location_type = document.getElementById('gh_dim_location_type');
const current_location = document.getElementById('gh_dim_location');
if(current_location_type !== null && current_location !== null && current_location_type.value == 'point' && current_location.value.length > 0) {
    center = current_location.value.split(',', 2).map(parseFloat);
    zoom = settings.maxZoom - 1;
}

const pickLocation = (coord) => {
    if(current_location !== null) {
        current_location.value = coord.join(',');
        console.log(coord);
    }
};

store.dispatch(configureMapView({
    center: center,
    zoom: zoom,
    maxZoom: settings.maxZoom,
    minZoom: settings.minZoom,
    constrainResolution: true,
    projection: getProjection(settings.projection)
}));

store.dispatch(setSearchProjection(settings.search_coord_system));

store.dispatch(fetchWMTSLayer(
    'https://geodata.nationaalgeoregister.nl/tiles/service/wmts?request=GetCapabilities&service=WMTS',
    {
        layer: 'brtachtergrondkaart',
        // matrixSet: 'EPSG:28992'
        matrixSet: 'EPSG:3857'
    }, { opacity: 1, zIndex: 1}
));

const App = () => {
    return (
        <Provider store={store}>
            <MapComponentLink onPickLocation={pickLocation}>
                <SearchComponentLink />
            </MapComponentLink>
        </Provider>
    )
};

ReactDOM.render( App(), document.getElementById( settings.element ) );