import { SET_FEATURE } from "../actions";

const initialState = {
    feature: null
};

export function featureReducer(state = initialState, action) {
    switch(action.type) {
        case SET_FEATURE:
            return { ...state, feature: action.feature };
    }
    return state;
};