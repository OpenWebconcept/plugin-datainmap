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
import _ from 'lodash';
import 'whatwg-fetch';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import {Tile as TileLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import { FEATURE_TYPE_WMSFEATURE, FEATURE_TYPE_DIMFEATURE } from './constants';

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

export const SET_SEARCH_TOWNSHIP = 'SET_SEARCH_TOWNSHIP';
export function setSearchTownship(township) {
    return {
        type: SET_SEARCH_TOWNSHIP,
        township
    }
}

export const SEARCH_SUGGEST = 'SEARCH_SUGGEST';
export function searchSuggest(q) {
    let thunk = (dispatch, getState) => {
        const state = getState();
        let url = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?wt=json';
        const township = getState().search.township;
        if(township.length > 0) {
            q += ' AND gemeentecode:' + township;
        }
        url += '&q=' + q + '&fq=type:(gemeente OR woonplaats OR weg OR postcode OR adres)';
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
    let thunk = (dispatch, getState) => {
        let url = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?wt=json';
        url += '&id=' + id;
        return fetch(url).
            then( response => {
                return response.json();
            })
            .then( json => {
                if(json.response.numFound >= 1) {
                    let projection = getState().search.projection;
                    // Coordinates are returned as a string so we need to convert them.
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
    };
    thunk.meta = {
        debounce: {
            time: 150,
            key: FETCH_LOCATION
        }
    };
    return thunk;
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
                    return dispatch(setFeature({
                        type: FEATURE_TYPE_DIMFEATURE,
                        data: json.data
                    }));
                }
            })
            .catch( ex => {
                console.log('Failed to fetch location', ex);
            });
    }
}

export const SELECT_FEATURE_GEOSERVER = 'SELECT_FEATURE_GEOSERVER';
export function selectFeatureGeoserver(cb) {
    return (dispatch) => {
        dispatch(fetchingFeature(true));
        const url = cb({INFO_FORMAT: 'text/html'});
        return fetch(url).
            then( response => {
                dispatch(fetchingFeature(false));
                return response.text();
            })
            .then( html => {
                return dispatch(setFeature({
                    type: FEATURE_TYPE_WMSFEATURE,
                    data: html.trim()
                }));
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

export const SET_AVAILABLE_FILTERS = 'SET_AVAILABLE_FILTERS';
export function setAvailableFilters(location_properties) {
    return { type: SET_AVAILABLE_FILTERS, filters: location_properties};
}

export const SET_FILTER_DESCRIPTION = 'SET_FILTER_DESCRIPTION';
export function setFilterDescription(description) {
    return { type: SET_FILTER_DESCRIPTION, description: description };
}

export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export function toggleFilter(id, checked) {
    return { type: TOGGLE_FILTER, filter: id, checked: checked };
}

export const RESET_SELECTED_FILTERS = 'RESET_SELECTED_FILTERS';
export function resetSelectedFilters() {
    return { type: RESET_SELECTED_FILTERS };
}

export const STORE_FEATURES = 'STORE_FEATURES';
export function storeFeatures(features, sourceId) {
    return { type: STORE_FEATURES, features: features, sourceId: sourceId};
}
