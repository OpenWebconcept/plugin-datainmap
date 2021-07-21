import { SET_TOGGLER, TOGGLE_LAYER } from '../actions';
import _ from 'lodash';

const initialState = {
    layers: []
};

export const togglerReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_TOGGLER:
            return { ...state, togglers: action.togglers };
        case TOGGLE_LAYER:
            let layers = state.layers;
            // Delete previous entry of layer
            layers = _.reject(layers, {
                layerId: action.layer.layerId,
                layerType: action.layer.layerType
            });
            layers.push(action.layer);
            return { ...state, layers };
    }
    return state;
};