import { CONFIGURE_MAP_VIEW, ADD_MAP_LAYER, FETCHING, CENTER_MAP_VIEW, ADD_MAP_INTERACTION, REMOVE_MAP_INTERACTION } from '../actions';
import ld from 'lodash';
const _ = ld.noConflict();

const initialState = {
    isFetching: false,
    centerLocation: null,
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