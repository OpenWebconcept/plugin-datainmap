import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import classNames from 'classnames';
import _ from 'lodash';

class SearchResultsComponent extends Component {

    constructor(props) {
        super(props);
    }

    hasResults() {
        return this.props.results.response && this.props.results.response.numFound > 0;
    }

    render() {
        return (
            <CSSTransition
                in={this.hasResults()}
                timeout={400}
                unmountOnExit
                classNames="transition">
                <ul className="gh-dim-search-results">
                    {this.hasResults() && this.props.results.response.docs.map((doc) => {
                        return <li key={doc.id} onClick={(e) => this.props.handleClick(doc)}>{doc.weergavenaam}</li>
                    })}
                </ul>
            </CSSTransition>
        )
    }
}

SearchResultsComponent.defaultProps = {
    handleClick: _.noop
};

export class SearchComponent extends Component {
    constructor(props) {
        super(props);
        this.timeout = null;
        this.state = {
            displaySearch: false
        };
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
            else {
                this.props.resetSearchResults(null);
            }
        };
        this.timeout = setTimeout(cb, 250);
    }

    handleSelectedResult(doc) {
        this.props.doSelectResult(doc);
        this.props.resetSearchResults(null);
    }

    escFunction(e) {
        if(e.keyCode === 27) {
            this.props.resetSearchResults(null);
        }
    }

    render() {
        return (
            <div className='gh-dim-search'>
                <div className="gh-dim-search-form">
                    <form role="search" aria-label="" onSubmit={(e) => e.preventDefault() }>
                        <input type="search" placeholder="Zoek op plaats of postcode" aria-label="Zoeken" onChange={(e) => this.handleSearch(e)} onKeyDown={(e) => this.escFunction(e)} />
                        <SearchResultsComponent results={this.props.results} handleClick={(e) => this.handleSelectedResult(e)} />
                    </form>
                </div>
            </div>
        )
    }
}

SearchComponent.defaultProps = {
    isFetching: 0,
    doSearch: _.noop,
    doSelectResult: _.noop,
    resetSearchResults: _.noop,
    results: {}
};

export default SearchComponent;