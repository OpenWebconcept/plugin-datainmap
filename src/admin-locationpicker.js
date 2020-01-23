import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import MapComponentLink from './containers/maplink';
import SearchComponentLink from './containers/searchlink';
import {configureMapView, fetchWMTSLayer, setSearchProjection, addMapLayer, addMapInteraction, removeMapInteraction} from './actions';
import {mapReducer} from './reducers/map';
import {searchReducer} from './reducers/search';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource } from 'ol/source';
import {get as getProjection} from 'ol/proj';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import { Feature } from 'ol';
import { Point, LineString, Polygon, Circle } from 'ol/geom';
import Draw from 'ol/interaction/Draw';
import ld from 'lodash';
const _ = ld.noConflict();

const rootReducer = combineReducers({
    map: mapReducer,
    search: searchReducer
});

const middleware = applyMiddleware(thunk);
const store = createStore( rootReducer, middleware);

if(typeof GHDataInMap == 'undefined') {
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

let geometry; // The geometry of the current location
let doDrawFeature = false;
let zoom = settings.zoom;
let center = [settings.center_x, settings.center_y].map(parseFloat);
// Move and zoom to object location if defined
const current_location_type = document.getElementById('gh_dim_location_type');
const current_location = document.getElementById('gh_dim_location');
if(current_location_type !== null && current_location !== null && current_location.value.length > 0) {
    try {
        const coordinates = JSON.parse(current_location.value);
        switch(current_location_type.value) {
            case 'point':
                geometry = new Point(coordinates);
                center = coordinates;
                zoom = settings.maxZoom - 1;
                break;
            case 'linestring':
                geometry = new LineString(coordinates);
                break;
            case 'polygon':
                geometry = new Polygon(coordinates);
                break;
            case 'circle':
                geometry = new Circle(...coordinates);
                break;
        }
        doDrawFeature = true;
    }
    catch(ex) {
        console.log(ex);
        alert('Unable to parse coordinates');
    }
}

// Source and layer for drawing the Pin on the map to see what's selected
const source = new VectorSource();
const layer = new VectorLayer({
    zIndex: 2,
    source: source,
    wrapX: false
});
store.dispatch( addMapLayer(layer) );

// Draw current feature if a shape is available
if(doDrawFeature) {
    source.clear();
    source.addFeature(new Feature({
        geometry: geometry
    }));
}

// Store new coordinates if drawing has ended
const drawingComplete = (feature) => {
    const geometry = feature.getGeometry()
    let coordinates;
    if(geometry instanceof Circle) {
        coordinates = [geometry.flatCoordinates, geometry.getRadius()];
    }
    else {
        coordinates = geometry.getCoordinates();
    }
    current_location.value = JSON.stringify(coordinates);
}

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
        matrixSet: 'EPSG:3857'
    }, { opacity: 1, zIndex: 1}
));

// Draw interactions
if(current_location_type !== null) {
    let drawInteraction;
    // Create a new draw interaction based on the locationtype
    const addDrawInteraction = () => {
        let drawType;
        switch(current_location_type.value) {
            default:
                drawType = 'None';
                break;
            case 'point':
                drawType = 'Point';
                break;
            case 'linestring':
                drawType = 'LineString';
                break;
            case 'polygon':
                drawType = 'Polygon';
                break;
            case 'circle':
                drawType = 'Circle';
                break;
        }
        if(drawType == 'None') {
            return;
        }
        drawInteraction = new Draw({
            source: source,
            type: drawType
        });
        // Clear current feature(s) when starting to draw
        drawInteraction.on('drawstart', (a,b,c) => {
            source.clear();
        });
        drawInteraction.on('drawend', (e) => {
            drawingComplete(e.feature);
        });
        store.dispatch(addMapInteraction(drawInteraction));
    };
    // Change location type
    current_location_type.onchange = () => {
        if(drawInteraction !== null) {
            store.dispatch(removeMapInteraction(drawInteraction));
        }
        addDrawInteraction();
    };
    addDrawInteraction();
}

const App = () => {
    return (
        <Provider store={store}>
            <MapComponentLink enableDrawing={true}>
                <SearchComponentLink />
            </MapComponentLink>
        </Provider>
    )
};

ReactDOM.render( App(), document.getElementById( settings.element ) );