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
        this.state = {
            displaySearch: false
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