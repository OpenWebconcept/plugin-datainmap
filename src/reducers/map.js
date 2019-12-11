import { CONFIGURE_MAP_VIEW, ADD_MAP_LAYER, FETCHING, CENTER_MAP_VIEW } from '../actions';

const initialState = {
    isFetching: false,
    centerLocation: null,
    view: {
        zoom: 10,
        constrainResolution: true,
        minZoom: 8
    },
    layers: []
};

export const mapReducer = (state = initialState, action) => {
    // console.log(action.type, action);
    switch(action.type) {
        case CONFIGURE_MAP_VIEW:
            return { ...state, view: action.settings };
        case ADD_MAP_LAYER:
            const layers =  [...state.layers, action.layer ];
            return { ...state, layers: layers };
        case FETCHING:
            return { ...state, isFetching: action.status };
        case CENTER_MAP_VIEW:
            return { ...state, centerLocation: action.location};
    }
    return state;
};