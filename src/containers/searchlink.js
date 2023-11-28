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
import SearchComponent from '../components/search';
import { searchSuggest, fetchLocation, setSearchResults } from '../actions';

const mapStateToProps  = (state) => {
    return {
        results: state.search.results
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        doSearch: (q) => {
            dispatch(searchSuggest(q));
        },
        doSelectResult: (doc) => {
            dispatch(fetchLocation(doc.id));
        },
        resetSearchResults: () => {
            dispatch(setSearchResults({}));
        }
    }
}

const SearchComponentLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchComponent)

export default SearchComponentLink