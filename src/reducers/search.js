import {SET_SEARCH_RESULTS, SET_SEARCH_PROJECTION, SET_SEARCH_TOWNSHIP} from '../actions';

const initialState = {
    projection: 'll',
    township: '',
    results: {
        highlighting: {},
        response: {},
        spellcheck: {}
    }
};

export const searchReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_SEARCH_PROJECTION:
            return { ...state, projection: action.projection };
            case SET_SEARCH_TOWNSHIP:
                return { ...state, township: action.township };
        case SET_SEARCH_RESULTS:
            return { ...state, results: action.results };
    }
    return state;
};