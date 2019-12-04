import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import MapComponentLink from './containers/maplink';
import SearchComponentLink from './containers/searchlink';
import FeatureComponentLink from './containers/featurelink';
import {configureMapView, fetchWMTSLayer, addMapLayer} from './actions';
import {mapReducer} from './reducers/map';
import {searchReducer} from './reducers/search';
import Feature from 'ol/Feature';
import {Circle as CircleStyle, Circle, Fill, Stroke, Style, Text, Icon} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Point} from 'ol/geom';
import {transform} from 'ol/proj';
import {Cluster, OSM, Vector as VectorSource } from 'ol/source';
import KML from 'ol/format/KML';
import { featureReducer } from './reducers/feature';
import './style.scss';

const rootReducer = combineReducers({
    map: mapReducer,
    search: searchReducer,
    feature: featureReducer
});

const middleware = applyMiddleware(thunk);
const store = createStore( rootReducer, middleware);

if(GHDataInMap == undefined) {
    throw "GHDataInMap object missing";
}

const settings = GHDataInMap.settings;

let clusterStyleCache = {};
let styles = {
    cluster: (feature) => {
        const size = feature.get('features').length;
        let style = clusterStyleCache[size];
        
        const term = feature.get('features')[0].get('term');
        if(size == 1 && term && styles[term]) {
            return styles[term];
        }

        if(!style) {
            let color = settings.style_circle_fill_color_cluster;
            switch(size) {
                case 1:
                    color = settings.style_circle_fill_color;
                    break;
            }
            style = new Style({
                image: new CircleStyle({
                    radius: 14,
                    stroke: new Stroke({
                        color: settings.style_circle_stroke_color
                    }),
                    fill: new Fill({
                        color: color
                    })
                }),
                text: new Text({
                    text: size.toString(),
                    fill: new Fill({
                        color: settings.style_text_color
                    })
                })
            });
            clusterStyleCache[size] = style;
        }
        return style;
    },
    default: new Style({
        fill: new Fill({
            color: 'rgba(20, 100, 240, 0.3)'
        }),
        stroke: new Stroke({
            width: 3,
            color: 'rgba(0, 100, 240, 0.8)'
        }),
        image: new Circle({
            fill: new Fill({
                color: 'rgba(55, 200, 150, 0.5)'
            }),
            stroke: new Stroke({
                width: 10,
                color: 'rgba(55, 200, 150, 0.8)'
            }),
            radius: 7
        }),
        text: new Text(),
    })
};

// Add layer styles
GHDataInMap.location_layers.forEach(layer => {
    styles[layer.slug] = new Style({
        image: new Icon({
            src: layer.icon
        })
    })
});

store.dispatch(configureMapView({
    center: [settings.center_x, settings.center_y],
    zoom: settings.zoom,
    maxZoom: settings.maxZoom,
    minZoom: settings.minZoom,
    constrainResolution: true,
}));

let zIndex = 0;

// Fall back to OpenStreetMaps if no layer is present
if(GHDataInMap.map_layers.length == 0) {
    store.dispatch(addMapLayer(
        new TileLayer({
            source: new OSM(),
            opacity: 1,
            zIndex: ++zIndex,
        })
    ));
}
else {
    GHDataInMap.map_layers.forEach( (layer_data) => {
        console.log(layer_data);
        switch(layer_data.type) {
            case 'OSM':
                store.dispatch(addMapLayer(
                    new TileLayer({
                        source: new OSM(),
                        opacity: 1,
                        zIndex: ++zIndex,
                    })
                ));
                break;
            case 'KML':
                const layer = new VectorLayer({
                    zIndex: ++zIndex,
                    source: new VectorSource({
                        url: layer_data.url,
                        format: new KML({
                            extractStyles: !layer_data.kml_ignore_style
                        }),
                    })
                });
                store.dispatch(addMapLayer(layer));
                break;
            case 'WMTS-auto':
                store.dispatch(fetchWMTSLayer(
                    layer_data.url,
                    {
                        layer: layer_data.name,
                        matrixSet: layer_data.matrixset
                    },
                    {
                        opacity: 1,
                        zIndex: ++zIndex,
                    }
                ));
                break;
        }
    });
}

GHDataInMap.location_layers.forEach( layerData => {
    const source = new VectorSource();
    layerData.features.forEach(featureData => {
        const [x, y] = [featureData.x, featureData.y];
        delete featureData.x;
        delete featureData.y;
        source.addFeature(new Feature({
            ...featureData,
            // Todo: dit moet niet hier gebeuren, maar bij importeren
            geometry: new Point(transform([x, y], 'EPSG:4326', settings.layer_matrixset))
        }));
    });
    let layer;
    const layerStyle = (feature) => {
        return styles[layerData.slug] || styles.default;
    };
    if(parseInt(layerData.cluster, 10) == 1) {
        const clusterSource = new Cluster({
            distance: layerData.cluster_distance,
            source: source,
        });
        layer = new VectorLayer({
            zIndex: ++zIndex,
            source: clusterSource,
            style: styles.cluster
        });
    }
    else {
        layer = new VectorLayer({
            zIndex: ++zIndex,
            source: source,
            style: layerStyle
        });
    }
    store.dispatch( addMapLayer(layer) );
});

const App = () => {
    return (
        <Provider store={store}>
            <SearchComponentLink />
            <MapComponentLink />
            <FeatureComponentLink />
        </Provider>
    )
};

ReactDOM.render( App(), document.getElementById( settings.element ) );