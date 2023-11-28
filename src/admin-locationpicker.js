/*
* Copyright 2020-2022 Gemeente Heerenveen
*
* Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
* You may not use this work except in compliance with the Licence.
* You may obtain a copy of the Licence at:
*
* https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
*
* Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the Licence for the specific language governing permissions and limitations under the Licence.
*/
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createDebounce from 'redux-debounced';
import thunk from 'redux-thunk';
import MapComponentLink from './containers/maplink';
import SearchComponentLink from './containers/searchlink';
import {configureMapView, fetchWMTSLayer, setSearchProjection, setSearchTownship, addMapLayer, addMapInteraction, removeMapInteraction} from './actions';
import {mapReducer} from './reducers/map';
import {searchReducer} from './reducers/search';
import { filterReducer } from './reducers/filter';
import { togglerReducer } from './reducers/toggler';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource } from 'ol/source';
import {Fill, Stroke, Style} from 'ol/style';
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
    search: searchReducer,
    filter: filterReducer,
    toggler: togglerReducer
});

const middleware = applyMiddleware(createDebounce(), thunk);
const store = createStore( rootReducer, middleware);

if(typeof GHDataInMap == 'undefined') {
    throw "GHDataInMap object missing";
}

const settings = GHDataInMap.settings;

// Add extra projections
GHDataInMap.proj4.forEach( (projection) => {
    try {
        proj4.defs(projection[0], projection[1]);
    }
    catch(ex) {
        console.log('Failed to define projection', ex);
    }
});
register(proj4);

const el_fill_color = document.getElementById('gh_dim_location_style_fill_color');
const el_stroke_width = document.getElementById('gh_dim_location_style_line_width');
const el_stroke_color = document.getElementById('gh_dim_location_style_line_color');
const styleFunction = (feature) => {
    const style = new Style({
        fill: new Fill({
            color: el_fill_color && el_fill_color.value.length > 0 ? el_fill_color.value : 'rgba(255,255,255,0.7)'
        }),
        stroke: new Stroke({
            color: el_stroke_color && el_stroke_color.value.length > 0 ? el_stroke_color.value : 'rgba(0,0,255,0.8)',
            width: parseInt(el_stroke_width ? el_stroke_width.value : 1, 10)
        })
    });
    return style;
};

let geometry; // The geometry of the current location
let doDrawFeature = false;
let zoom = settings.zoom;
let center = [settings.center_x, settings.center_y].map(parseFloat);
// If no center location has been set, default to one and ignore zoom
if(isNaN(center[0]) || isNaN(center[1]) || (center[0] == 0 && center[1] == 0)) {
    center = [151437.3200827152, 509530.13429433457];
    zoom = 8;
}
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

// Update style of feature after changing colors and line width
[el_fill_color, el_stroke_color, el_stroke_width].forEach((el) => {
    if(!el) {
        return;
    }
    el.onchange = (e) => {
        if(current_location_type.value == 'point') {
            return;
        }
        source.getFeatures().forEach((feature) => {
            feature.setStyle(styleFunction);
        });
    };
});

// Draw current feature if a shape is available
if(doDrawFeature) {
    source.clear();
    const feature = new Feature({
        geometry: geometry
    });
    if(current_location_type.value != 'point') {
        feature.setStyle(styleFunction);
    }
    source.addFeature(feature);
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
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    current_location.dispatchEvent(evt);
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
store.dispatch(setSearchTownship(settings.search_filter_township));

store.dispatch(fetchWMTSLayer(
    'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?request=getcapabilities&service=wmts',
    {
        layer: 'standaard',
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
            type: drawType,
            style: styleFunction
        });
        // Clear current feature(s) when starting to draw
        drawInteraction.on('drawstart', (a,b,c) => {
            source.clear();
        });
        drawInteraction.on('drawend', (e) => {
            if(current_location_type.value != 'point') {
                e.feature.setStyle(styleFunction);
            }
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
            <MapComponentLink enableDrawing={true} enableFeaturesListbox={false}>
                <SearchComponentLink />
            </MapComponentLink>
        </Provider>
    )
};
// Delay rendering to prevent a hidden map with Gutenberg
wp.domReady(() => ReactDOM.render( App(), document.getElementById( settings.element ) ));