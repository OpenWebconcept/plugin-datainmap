import React, {Component} from 'react';
import {Animated} from 'react-animated-css';
import _ from 'lodash';

class SearchResultsComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if( this.props.results.response && this.props.results.response.numFound > 0 ) {
            return (
                <Animated
                    animationInDuration={400}
                    animationOutDuration={400}>
                    <ul className="gh-dim-search-results">
                        {this.props.results.response.docs.map((doc) => {
                            return <li key={doc.id} onClick={(e) => this.props.handleClick(doc)}>{doc.weergavenaam}</li>
                        })}
                    </ul>
                </Animated>
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
        this.timeout = setTimeout(cb, 500);
    }

    handleSelectedResult(doc) {
        this.props.doSelectResult(doc);
        this.toggleDisplaySearch();
        this.props.resetSearchResults(null);
    }

    toggleDisplaySearch(e) {
        this.setState((currentState) => ({
            displaySearch: !currentState.displaySearch
        }));
    }

    render() {
        return (
            <div className="gh-dim-search">
                <button className="gh-dim-search-toggle" type="button" onClick={(e) => this.toggleDisplaySearch(e)}>
                    {this.state.displaySearch && 'Zoekbalk verbergen'}
                    {!this.state.displaySearch && 'Zoekbalk tonen'}
                </button>
                <Animated
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    isVisible={this.state.displaySearch}
                    animateOnMount={false}
                    animationInDuration={400}
                    animationOutDuration={1}
                    styles={{display: 'none'}}>
                    <div className="gh-dim-search-form">
                        {this.state.displaySearch &&
                        <form role="search" aria-label="" onSubmit={(e) => e.preventDefault() }>
                            <input type="search" placeholder="Zoek op plaats of postcode" aria-label="Zoeken" onChange={(e) => this.handleSearch(e)} />
                            <SearchResultsComponent results={this.props.results} handleClick={(e) => this.handleSelectedResult(e)} />
                        </form>
                        }
                    </div>
                </Animated>
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