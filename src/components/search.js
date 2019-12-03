import React, {Component} from 'react';
import _ from 'lodash';

class SearchResultsComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if( this.props.results.response && this.props.results.response.numFound > 0 ) {
            return (
                <ul>
                    {this.props.results.response.docs.map((doc) => {
                        return <li key={doc.id} onClick={(e) => this.props.handleClick(doc)}>{doc.weergavenaam}</li>
                    })}
                </ul>
            )
        }
        return null;
    }
}

SearchResultsComponent.defaultProps = {
    handleClick: _.noop
};

export class SearchComponent extends Component {
    constructor(props) {
        super(props);
        this.timeout = null;
    }

    handleSearch(e) {
        if( this.timeout ) {
            clearTimeout(this.timeout);
        }
        const q = e.target.value;
        const cb = () => {
            if(q.length >= 3) {
                this.props.doSearch(q);
            }
        };
        this.timeout = setTimeout(cb, 500);
    }

    handleSelectedResult(doc) {
        this.props.doSelectResult(doc);
    }

    render() {
        return (
            <div>
                <form role="search" aria-label="">
                    <input type="search" placeholder="Zoek op plaats of postcode" aria-label="Zoeken" onKeyUp={(e) => this.handleSearch(e)} />
                    <SearchResultsComponent results={this.props.results} handleClick={(e) => this.handleSelectedResult(e)} />
                </form>
            </div>
        )
    }
}

SearchComponent.defaultProps = {
    isFetching: 0,
    doSearch: _.noop,
    doSelectResult: _.noop,
    results: {}
};

export default SearchComponent;