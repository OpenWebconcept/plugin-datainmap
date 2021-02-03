/*
* Copyright 2020 Gemeente Heerenveen
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
import FeatureComponentLink from './containers/featurelink';
import FilterComponentLink from './containers/filterlink';
import {configureMapView, fetchWMTSLayer, addMapLayer, setSearchProjection, setSearchTownship, setAvailableFilters, storeFeatures, setFilterDescription} from './actions';
import {mapReducer} from './reducers/map';
import {searchReducer} from './reducers/search';
import {filterReducer} from './reducers/filter';
import Feature from 'ol/Feature';
import {Circle as CircleStyle, Fill, Stroke, Style, Text, Icon} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer, VectorImage as VectorImageLayer} from 'ol/layer';
import {Point, Polygon, LineString, Circle} from 'ol/geom';
import {get as getProjection} from 'ol/proj';
import {Cluster, OSM, Vector as VectorSource, TileWMS } from 'ol/source';
import {KML, GeoJSON} from 'ol/format';
import { featureReducer } from './reducers/feature';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import { getUid } from 'ol/util';
import 'whatwg-fetch';
import _ from 'lodash';

const rootReducer = combineReducers({
    map: mapReducer,
    search: searchReducer,
    feature: featureReducer,
    filter: filterReducer
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

const styleDefaultText = '📌';
let clusterStyleCache = {};
let styles = {
    cluster: (feature) => {
        const features = feature.get('features');
        const size = features.length;
        if(size == 0) {
            return null;
        }

        const term = feature.get('features')[0].get('term');
        if(size == 1 && term && styles[term]) {
            return styles[term];
        }

        let style = clusterStyleCache[size];
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
        image: new CircleStyle({
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
styles.linestring = styles.geojson;
styles.circle = styles.geojson;

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
store.dispatch(setSearchTownship(settings.search_filter_township));

store.dispatch(setFilterDescription(settings.filter_description));
store.dispatch(setAvailableFilters(GHDataInMap.location_properties));

let zIndex = 0;

const addOpenStreetMapsLayer = (opacity = 1) => {
    store.dispatch(addMapLayer(
        new TileLayer({
            source: new OSM(),
            opacity: opacity,
            zIndex: ++zIndex,
        })
    ));
};

// Fall back to OpenStreetMaps if no layer is present
if(GHDataInMap.map_layers.length == 0) {
    addOpenStreetMapsLayer();
}
else {
    GHDataInMap.map_layers.forEach( (layerData) => {
        // console.log(layerData);
        switch(layerData.type) {
            case 'OSM':
                addOpenStreetMapsLayer(layerData.opacity);
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
            case 'TileWMS': {
                const source = new TileWMS({
                    url: layerData.url,
                    params: {
                        'LAYERS': layerData.name,
                        'TILED': true
                    },
                    serverType: layerData.server_type,
                    crossOrigin: layerData.cross_origin
                });
                // Override getFeatureInfoUrl() if features for this layer are to be ignored
                if(layerData.ignore_features) {
                    source.getFeatureInfoUrl = () => { return undefined };
                }
                const layer = new TileLayer({
                    zIndex: ++zIndex,
                    opacity: layerData.opacity,
                    source: source
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
const addFeatures = async (source, layerData) => {
    let features = [];
    // If features are dynamically loaded then layerData.features will be empty
    // and we need to fetch them first before continuing
    if(settings.dynamic_loading) {
        try {
            let response = await fetch(GHDataInMap.fetchLayerFeaturesUrl + layerData.term_id);
            let features = await response.json();
            layerData.features = features.data;
        }
        catch(ex) {
            console.warn('Failed to fetch features for %s (%d): %s', layerData.name, layerData.term_id, ex);
        }
    }
    layerData.features.forEach(featureData => {
        let geometry, style;
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
            case 'circle':
                geometry = new Circle(...featureData.location);
                break;
        }

        // Apply per-feature styling for locations other than point
        if(featureData.style && featureData.location_type != 'point') {
            style = new Style({
                fill: new Fill({
                    color: featureData.style.fill_color
                }),
                stroke: new Stroke({
                    color: featureData.style.line_color,
                    width: featureData.style.line_width
                }),
            });
        }

        delete featureData.location_type;
        delete featureData.location;
        const feature = new Feature({
            ...featureData,
            geometry: geometry
        });

        if(style !== undefined) {
            feature.setStyle(style);
        }

        features.push(feature);
    });
    source.addFeatures( features );

    if(settings.enable_filter) {
        store.dispatch( storeFeatures(source.getFeatures(), getUid(source)) );
    }
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
                const geometry = feature.getGeometry();
                if(geometry instanceof Polygon) {
                    return styles.polygon;
                }
                else if(geometry instanceof LineString) {
                    return styles.linestring;
                }
                else if(geometry instanceof Circle) {
                    return styles.circle;
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
            <MapComponentLink enableTooltip={settings.enable_tooltip} enableFeaturesListbox={settings.enable_features_listbox}>
                { settings.enable_search && <SearchComponentLink /> }
                { settings.enable_filter && <FilterComponentLink /> }
            </MapComponentLink>
            { settings.enable_feature_dialog && <FeatureComponentLink cb={GHDataInMap.featureCallback} /> }
        </Provider>
    )
};

ReactDOM.render( App(), document.getElementById( settings.element ) );