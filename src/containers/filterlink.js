/*
* Copyright 2020-2023 Gemeente Heerenveen
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
import { connect } from 'react-redux';
import FilterComponent from '../components/filter';
import { toggleFilter, resetSelectedFilters } from '../actions';

const mapStateToProps = (state) => {
    return {
        selected: state.filter.selected,
        filters: state.filter.filters,
        description: state.filter.description
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSetFilter: (term_id, checked) => {
            dispatch(toggleFilter(term_id, checked));
        },
        doResetFilter: () => {
            dispatch(resetSelectedFilters());
        }
    }
};

const FilterComponentLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterComponent);

export default FilterComponentLink;