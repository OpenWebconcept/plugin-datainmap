/*
* Copyright 2020-2024 Gemeente Heerenveen
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
import { SET_AVAILABLE_FILTERS, TOGGLE_FILTER, SET_FILTER_DESCRIPTION, RESET_SELECTED_FILTERS } from "../actions";
import _ from 'lodash';

const initialState = {
    selected: [],
    filters: []
};

export function filterReducer(state = initialState, action) {
    switch(action.type) {
        case SET_AVAILABLE_FILTERS:
            return { ...state, filters: action.filters };
        case TOGGLE_FILTER:
            let selected = state.selected;
            if(action.checked) {
                selected.push(action.filter);
                selected = _.uniq(selected);
            }
            else {
                selected = _.without(selected, action.filter);
            }
            // console.log('active filters', selected);
            return { ...state, selected: selected };
        case RESET_SELECTED_FILTERS:
            return { ...state, selected: [] };
        case SET_FILTER_DESCRIPTION:
            return { ...state, description: action.description };
    }
    return state;
};