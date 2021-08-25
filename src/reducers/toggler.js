import { SET_TOGGLER, SET_TOGGLER_DESCRIPTION, TOGGLE_LAYER } from '../actions';
import _ from 'lodash';

const initialState = {
    toggledLayersState: [],
    togglers: [],
};

export const togglerReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_TOGGLER:
            return { ...state, togglers: action.togglers };
        case TOGGLE_LAYER:
            let toggledLayersState = state.toggledLayersState;
            // Delete previous entry of layer
            toggledLayersState = _.reject(toggledLayersState, {
                layerId: action.layer.layerId,
                layerType: action.layer.layerType
            });
            toggledLayersState.push(action.layer);
            return { ...state, toggledLayersState };
        case SET_TOGGLER_DESCRIPTION:
            return { ...state, description: action.description };
    }
    return state;
};