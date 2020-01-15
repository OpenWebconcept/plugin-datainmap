import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import MapComponentLink from './containers/maplink';
import SearchComponentLink from './containers/searchlink';
import FeatureComponentLink from './containers/featurelink';
import {configureMapView, fetchWMTSLayer, addMapLayer, setSearchProjection, centerMapView} from './actions';
import {mapReducer} from './reducers/map';
import {searchReducer} from './reducers/search';
import Feature from 'ol/Feature';
import {Circle as CircleStyle, Circle, Fill, Stroke, Style, Text, Icon} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer, VectorImage as VectorImageLayer} from 'ol/layer';
import {Point, Polygon, LineString} from 'ol/geom';
import {get as getProjection} from 'ol/proj';
import {Cluster, OSM, Vector as VectorSource } from 'ol/source';
import {KML, GeoJSON} from 'ol/format';
import { featureReducer } from './reducers/feature';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import _ from 'lodash';

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

const styleDefaultText = '📌';
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
            let text = size.toString();
            switch(size) {
                case 1:
                    fill_color = settings.style_circle_fill_color;
                    stroke_color = settings.style_circle_stroke_color;
                    text_color = settings.style_text_color;
                    text = styleDefaultText;
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
                    text: text,
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
            text: styleDefaultText,
            font: settings.style_circle_text_font,
            scale: settings.style_circle_text_scale,
            textBaseline: settings.style_circle_text_baseline,
            fill: new Fill({
                color: settings.style_text_color
            })
        }),
    }),
    geojson: new Style({
        fill: new Fill({
            color: settings.style_circle_fill_color
        }),
        stroke: new Stroke({
            color: settings.style_circle_stroke_color,
            width: 2
        }),
        text: new Text({
            font: settings.style_circle_text_font,
            scale: settings.style_circle_text_scale,
            textBaseline: settings.style_circle_text_baseline,
            fill: new Fill({
                color: settings.style_text_color
            })
        }),
    })
};

styles.polygon = styles.geojson;

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
    center: [settings.center_x, settings.center_y].map(parseFloat),
    zoom: settings.zoom,
    maxZoom: settings.maxZoom,
    minZoom: settings.minZoom,
    constrainResolution: true,
    projection: getProjection(settings.projection)
}));

store.dispatch(setSearchProjection(settings.search_coord_system));

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
            case 'KML': {
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
            }
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
            case 'GeoJSON': {
                const style = styles.geojson;
                const layer = new VectorImageLayer({
                    opacity: layerData.opacity,
                    zIndex: ++zIndex,
                    source: new VectorSource({
                        url: layerData.url,
                        format: new GeoJSON(),
                    }),
                    style: (feature) => {
                        return style;
                    }
                });
                store.dispatch(addMapLayer(layer));
                break;
            }
        }
    });
}

// Function for adding features from a location_layer to a VectorSource
const addFeatures = (source, layerData) => {
    layerData.features.forEach(featureData => {
        let geometry;
        switch(featureData.location_type) {
            default:
            case 'point':
                geometry = new Point(featureData.location);
                break;
            case 'linestring':
                geometry = new LineString(featureData.location);
                break;
            case 'polygon':
                geometry = new Polygon(featureData.location);
                break;
        }
        delete featureData.location_type;
        delete featureData.location;
        source.addFeature(new Feature({
            ...featureData,
            geometry: geometry
        }));
    });
};

// Combine everything in a single cluster
if(GHDataInMap.settings.single_cluster) {
    const source = new VectorSource();
    GHDataInMap.location_layers.forEach( layerData => {
        addFeatures(source, layerData);
    });
    // Determine cluster distance
    const clusterDistance = () => {
        if(GHDataInMap.settings.single_cluster_distance !== undefined) {
            return GHDataInMap.settings.single_cluster_distance;
        }
        // Find first cluster layerData to determine cluster distance
        const clusterLayerData = _.find(GHDataInMap.location_layers, (layerData) => {
            return parseInt(layerData.cluster, 10) == 1;
        });
        if(clusterLayerData !== undefined) {
            return clusterLayerData.cluster_distance;
        }
        return 75;
    };
    const clusterSource = new Cluster({
        distance: clusterDistance(),
        source: source,
    });
    const layer = new VectorLayer({
        zIndex: ++zIndex,
        source: clusterSource,
        style: styles.cluster
    });
    store.dispatch( addMapLayer(layer) );
}
// Add separate (cluster)layers
else {
    GHDataInMap.location_layers.forEach( layerData => {
        const source = new VectorSource();
        addFeatures(source, layerData);
        let layer;
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
            const layerStyle = (feature) => {
                console.log(feature.getGeometry(), feature);
                const geometry = feature.getGeometry();
                if(geometry instanceof Polygon) {
                    return styles.polygon;
                }
                else if(geometry instanceof LineString) {
                    return styles.polygon;
                }
                return styles[layerData.slug] || styles.default;
            };
            layer = new VectorLayer({
                zIndex: ++zIndex,
                source: source,
                style: layerStyle
            });
        }
        store.dispatch( addMapLayer(layer) );
    });
}

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