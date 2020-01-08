import {SET_SEARCH_RESULTS, SET_SEARCH_PROJECTION} from '../actions';

const initialState = {
    projection: 'll',
    results: {
        highlighting: [],
        response: [],
        spellcheck: []
    }
};

export const searchReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_SEARCH_PROJECTION:
            return { ...state, projection: action.projection };
        case SET_SEARCH_RESULTS:
            return { ...state, results: action.results };
    }
    return state;
};