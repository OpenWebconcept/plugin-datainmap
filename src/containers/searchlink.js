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