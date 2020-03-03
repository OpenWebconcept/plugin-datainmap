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
import { CONFIGURE_MAP_VIEW, ADD_MAP_LAYER, FETCHING, CENTER_MAP_VIEW, ADD_MAP_INTERACTION, REMOVE_MAP_INTERACTION } from '../actions';
import ld from 'lodash';
const _ = ld.noConflict();

const initialState = {
    isFetching: false,
    centerLocation: null,
    enableTooltip: false,
    view: {
        zoom: 10,
        constrainResolution: true,
        minZoom: 8
    },
    layers: [],
    interactions: [],
};

export const mapReducer = (state = initialState, action) => {
    let interactions, layers;
    // console.log(action.type, action);
    switch(action.type) {
        case CONFIGURE_MAP_VIEW:
            return { ...state, view: action.settings };
        case ADD_MAP_LAYER:
            layers =  [...state.layers, action.layer ];
            return { ...state, layers: layers };
        case FETCHING:
            return { ...state, isFetching: action.status };
        case CENTER_MAP_VIEW:
            return { ...state, centerLocation: action.location};
        case ADD_MAP_INTERACTION:
            interactions = [ ...state.interactions, action.interaction ];
            return { ...state, interactions: interactions};
        case REMOVE_MAP_INTERACTION:
            interactions = _.without(state.interactions, action.interaction);
            return { ...state, interactions: interactions};
    }
    return state;
};