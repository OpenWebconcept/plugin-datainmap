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
                dispatch(fetching(0));
            })
            .catch(ex => {
                dispatch(fetching(0));
                console.log('Error fetching WMTS Layer', ex)
            });
    }
};

export const SET_SEARCH_PROJECTION = 'SET_SEARCH_PROJECTION';
export function setSearchProjection(projection) {
    return {
        type: SET_SEARCH_PROJECTION,
        projection
    }
}

export const SEARCH_SUGGEST = 'SEARCH_SUGGEST';
export function searchSuggest(q) {
    let thunk = (dispatch, getState) => {
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
    };
    thunk.meta = {
        debounce: {
            time: 250,
            key: SEARCH_SUGGEST
        }
    };
    return thunk;
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
                    let projection = getState().search.projection;
                    // Coordinaten staan in een string. Deze omzetten.
                    // "POINT(5.93825642 52.93182382)"
                    let [x, y] = json.response.docs[0]['centroide_' + projection].toString().split(' ');
                    x = x.slice("POINT(".length);
                    y = y.slice(0, -1);
                    let coords = [0, 0];
                    switch(projection) {
                        case 'll':
                            coords = fromLonLat([x, y]);
                            break;
                        case 'rd':
                            coords = [x, y];
                            break;
                    }
                    dispatch(centerMapView(coords));
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

export const ADD_MAP_INTERACTION = 'ADD_MAP_INTERACTION';
export function addMapInteraction(interaction) {
    return { type: ADD_MAP_INTERACTION, interaction: interaction };
}

export const REMOVE_MAP_INTERACTION = 'REMOVE_MAP_INTERACTION';
export function removeMapInteraction(interaction) {
    return { type: REMOVE_MAP_INTERACTION, interaction: interaction };
}