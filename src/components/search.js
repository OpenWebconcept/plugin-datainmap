/*
* Copyright 2020 Gemeente Heerenveen
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
        let results = [];
        let activeDescendant;
        if(this.hasResults()) {
            let i = 0;
            results = this.props.results.response.docs.map((doc) => {
                const selected = i++ === this.props.currentResult;
                const classes = classNames({ focused: selected });
                const id = _.uniqueId('gh-dim-search-results-item-');
                if(selected) {
                    activeDescendant = id;
                }
                return <li key={doc.id}
                    id={id}
                    aria-selected={selected ? 'true' : 'false'}
                    onClick={(e) => this.props.handleClick(doc)}
                    role="option"
                    className={classes}>{doc.weergavenaam}</li>
            });
        }
        let i = 0;
        return (
            <CSSTransition
                in={this.hasResults()}
                timeout={400}
                unmountOnExit
                classNames="transition">
                <ul className="gh-dim-search-results" aria-live="polite" role="listbox" aria-label="Zoekresultaten" aria-activedescendant={activeDescendant}>
                    {results.map((result) => { return result })}
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
        this.state = {
            displaySearch: false,
            currentResult: null
        };
    }

    handleSearch(e) {
        const q = e.target.value;
        if(q.length >= 3) {
            this.props.doSearch(q);
        }
        else {
            this.props.resetSearchResults(null);
        }
    }

    handleSelectedResult(doc) {
        this.props.doSelectResult(doc);
        this.resetSearchResults(null);
    }

    resetSearchResults(args) {
        this.props.resetSearchResults(args);
        this.setState({currentResult: null});
    }

    keyboardNavigation(e) {
        if(e.key === 'Escape') {
            this.resetSearchResults(null);
        }
        if(e.key == 'ArrowDown') {
            this.navigateUpDown(true);
        }
        if(e.key == 'ArrowUp') {
            this.navigateUpDown(false);
        }
        if(e.key == 'Enter' && this.state.currentResult !== null) {
            const doc = this.props.results.response.docs[ this.state.currentResult ];
            this.handleSelectedResult(doc);
        }
    }

    navigateUpDown(incr) {
        if(this.props.results.length == 0) {
            return;
        }
        const totalResults = this.props.results.response.docs.length;
        let nextResult;
        // Select first result
        if((this.state.currentResult === null || this.state.currentResult == totalResults - 1) && incr) {
            nextResult = 0;
        }
        // Select last result
        else if((this.state.currentResult === null || this.state.currentResult == 0) && !incr) {
            nextResult = totalResults - 1;
        }
        // Select previous/next result
        else {
            nextResult = this.state.currentResult + (incr ? 1 : -1);
        }
        this.setState({currentResult: nextResult});
    }

    render() {
        return (
            <div className='gh-dim-search'>
                <div className="gh-dim-search-form">
                    <form role="search" aria-label="Locatie" onSubmit={(e) => e.preventDefault() }>
                        <input type="search" placeholder="Zoek op plaats of postcode" aria-label="Zoek op plaats of postcode" onChange={(e) => this.handleSearch(e)} onKeyDown={(e) => this.keyboardNavigation(e)} />
                        <SearchResultsComponent results={this.props.results} currentResult={this.state.currentResult} handleClick={(e) => this.handleSelectedResult(e)} />
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