import _ from 'lodash';
import 'whatwg-fetch';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import {Tile as TileLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';

export const CONFIGURE_MAP_VIEW = 'CONFIGURE_MAP_VIEW';
export function configureMapView(settings) {
    return { settings, type: CONFIGURE_MAP_VIEW };
};

export const CENTER_MAP_VIEW = 'CENTER_MAP_VIEW';
export function centerMapView(location) {
    return {
        type: CENTER_MAP_VIEW,
        location: location
    }
};

export const ADD_MAP_LAYER = 'ADD_MAP_LAYER';
export function addMapLayer(layer) {
    return { layer, type: ADD_MAP_LAYER };
};

// DEPRECATED: gewoon zIndex voor layer instellen
export const ADD_MAP_LAYERS_SUBSEQUENTLY = 'ADD_MAP_LAYERS_SUBSEQUENTLY';
export function addMapLayersSubsequently(layer1, layer2) {
    return (dispatch, getState) => {
        dispatch(layer1).then( () => dispatch(layer2));
    };
};

export const FETCHING = 'FETCHING';
export function fetching(isFetching) {
    return { type: FETCHING, status: isFetching };
};

export const FETCH_WMTS_LAYER = 'FETCH_WMTS_LAYER';
export function fetchWMTSLayer(url, WMTSSettings, layerSettings = {}) {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(fetching(1));
        return fetch(url)
            .then(response => {
                return response.text();
            })
            .then(xml => {
                const parser = new WMTSCapabilities();
                const result = parser.read(xml);
                const options = optionsFromCapabilities(result, WMTSSettings);
                const layer = new TileLayer({
                    source: new WMTS(options),
                    ...layerSettings
                });
                dispatch(addMapLayer(layer));
                // dispatch(mapLayerAdded);
            })
            .catch(ex => {
                console.log('Error fetching WMTS Layer', ex)
            })
            .finally( () => {
                dispatch(fetching(0));
            });
    }
};

export const ADD_CLUSTER_LAYER = 'ADD_CLUSTER_LAYER';

export const SEARCH_SUGGEST = 'SEARCH_SUGGEST';
export function searchSuggest(q) {
    return (dispatch, getState) => {
        const state = getState();
        let url = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?wt=json';
        url += '&q=' + q + '&fq=type:(gemeente OR woonplaats OR weg or postcode)';
        return fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                dispatch(setSearchResults(json));
            });
    }
};

export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
export function setSearchResults(results) {
    return {
        type: SET_SEARCH_RESULTS,
        results
    }
};

export const FETCH_LOCATION = 'FETCH_LOCATION';
export function fetchLocation(id) {
    return (dispatch, getState) => {
        let url = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?wt=json';
        url += '&id=' + id;
        return fetch(url).
            then( response => {
                return response.json();
            })
            .then( json => {
                if(json.response.numFound >= 1) {
                    // Coordinaten staan in een string. Deze omzetten.
                    // "POINT(5.93825642 52.93182382)"
                    let [long, lat] = json.response.docs[0].centroide_ll.toString().split(' ');
                    long = parseFloat(long.slice("POINT(".length));
                    lat = parseFloat(lat.slice(0, -1));
                    dispatch(centerMapView(fromLonLat([long, lat])));
                }
            })
            .catch(ex => {
                console.log('Failed to fetch location', ex);
            });
    }
}

export const SET_FEATURE = 'SET_FEATURE';
export function setFeature(feature) {
    return {
        type: SET_FEATURE,
        feature: feature
    }
}

export const FETCHING_FEATURE = 'FETCHING_FEATURE';
export function fetchingFeature(isFetching) {
    return { type: FETCHING_FEATURE, status: isFetching };
}

export const SELECT_FEATURE = 'SELECT_FEATURE';
export function selectFeature(id) {
    return (dispatch, getState) => {
        dispatch(fetchingFeature(true));
        const url = GHDataInMap.fetchFeatureUrl + id;
        return fetch(url).
            then( response => {
                dispatch(fetchingFeature(false));
                return response.json();
            })
            .then( json => {
                if(json.success) {
                    return dispatch(setFeature(json.data));
                }
            })
            .catch( ex => {
                console.log('Failed to fetch location', ex);
            });
    }
}
