/*
* Copyright 2020-2021 Gemeente Heerenveen
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
import _ from 'lodash';

// Filter view uses :focus and :focus-within CSS states, so we need to blur from
// every element that could have focus
function blur(e) {
    if(e.key == 'Escape') {
        e.currentTarget.blur()
    }
};

class FilterItemComponent extends Component {
    render() {
        const id = _.uniqueId('gh-dim-filter-');
        return (
            <div className="gh-dim-filters-filter">
                <input id={id} type="checkbox" onKeyDown={blur} onClick={(e) => this.props.handleChange(this.props.term, e.currentTarget.checked)} /> <label htmlFor={id}>{this.props.term.name}</label>
            </div>
        )
    }
}

export class FilterComponent extends Component {
    constructor(props) {
        super(props);
    }

    handleFilterChange(term, checked) {
        // console.log(term, checked);
        this.props.doSetFilter(term.term_id, checked);
    }

    handleFilterReset(e) {
        this.props.doResetFilter();
    }

    render() {
        if(this.props.filters.length == 0) {
            return null;
        }
        const id = _.uniqueId('filter-title-');
        return (
            <div className="gh-dim-filter" tabIndex="0" onKeyDown={blur}>
                <section aria-labelledby={id}>
                    <header>
                        <h1 id={id}>Filters</h1>
                    </header>
                    <div className="gh-dim-filters">
                        {this.props.description &&
                            <p className="gh-dim-filters-description">{this.props.description}</p>
                        }
                        <form>
                            <div className="gh-dim-filters-controls">
                                <button onClick={(e) => this.handleFilterReset(e)} type="reset" onKeyDown={blur}>Reset filters</button>
                                <button aria-hidden="true" style={{"display": "none"}} type="submit">Toepassen</button>
                            </div>
                            <div role="group" aria-label="Filters">
                                {this.props.filters.map((term) => {
                                    return <FilterItemComponent key={term.term_id} term={term} handleChange={(term, checked) => this.handleFilterChange(term, checked)} />
                                })}
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        )
    }
}

FilterComponent.defaultProps = {
    doSetFilter: _.noop,
    doResetFilter: _.noop,
    description: null,
    filters: [],
    selected: []
};

export default FilterComponent;