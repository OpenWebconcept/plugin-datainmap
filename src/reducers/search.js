import {SET_SEARCH_RESULTS} from '../actions';

const initialState = {
    results: {
        highlighting: [],
        response: [],
        spellcheck: []
    }
};

export const searchReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_SEARCH_RESULTS:
            return { ...state, results: action.results };
    }
    return state;
};