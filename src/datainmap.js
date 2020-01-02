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
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';

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

// Voeg aanvullende projections toe
GHDataInMap.pro4j.forEach( (projection) => {
    try {
        proj4.defs(projection[0], projection[1]);
    }
    catch(ex) {
        console.log('Failed to define projection', ex);
    }
});
register(proj4);

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
            let fill_color = settings.style_circle_fill_color_cluster;
            let stroke_color = settings.style_circle_stroke_color_cluster;
            let text_color = settings.style_text_color_cluster;
            switch(size) {
                case 1:
                    fill_color = settings.style_circle_fill_color;
                    stroke_color = settings.style_circle_stroke_color;
                    text_color = settings.style_text_color;
                    break;
            }
            style = new Style({
                image: new CircleStyle({
                    radius: settings.style_circle_radius,
                    stroke: new Stroke({
                        color: stroke_color
                    }),
                    fill: new Fill({
                        color: fill_color
                    })
                }),
                text: new Text({
                    text: size.toString(),
                    font: settings.style_circle_text_font,
                    scale: settings.style_circle_text_scale,
                    textBaseline: settings.style_circle_text_baseline,
                    fill: new Fill({
                        color: text_color
                    })
                })
            });
            clusterStyleCache[size] = style;
        }
        return style;
    },
    default: new Style({
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
    })
};

// Add layer styles
GHDataInMap.location_layers.forEach(layer => {
    if(layer.icon) {
        styles[layer.slug] = new Style({
            image: new Icon({
                src: layer.icon
            })
        });
    }
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
    GHDataInMap.map_layers.forEach( (layerData) => {
        // console.log(layerData);
        switch(layerData.type) {
            case 'OSM':
                store.dispatch(addMapLayer(
                    new TileLayer({
                        source: new OSM(),
                        opacity: layerData.opacity,
                        zIndex: ++zIndex,
                    })
                ));
                break;
            case 'KML':
                const layerStyle = (feature) => {
                    return styles.default;
                };
                const layer = new VectorLayer({
                    zIndex: ++zIndex,
                    style: layerStyle,
                    opacity: layerData.opacity,
                    source: new VectorSource({
                        url: layerData.url,
                        format: new KML({
                            extractStyles: !layerData.kml_ignore_style
                        }),
                    })
                });
                store.dispatch(addMapLayer(layer));
                break;
            case 'WMTS-auto':
                store.dispatch(fetchWMTSLayer(
                    layerData.url,
                    {
                        layer: layerData.name,
                        matrixSet: layerData.matrixset
                    },
                    {
                        opacity: layerData.opacity,
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
            // Input is WGS84/EPSG:4326
            geometry: new Point(transform([x,y], 'EPSG:4326', 'EPSG:3857'))
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
            <MapComponentLink>
                <SearchComponentLink />
            </MapComponentLink>
            <FeatureComponentLink />
        </Provider>
    )
};

ReactDOM.render( App(), document.getElementById( settings.element ) );