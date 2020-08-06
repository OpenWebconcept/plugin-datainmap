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
import { FEATURE_TYPE_BUILTIN, CONTENT_TYPE_POST, CONTENT_TYPE_REDIRECT } from '../constants';
import classNames from 'classnames';
import _ from 'lodash';

class FeaturesListboxComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentResult: null
        };
        this.headerId = _.uniqueId('gh-dim-features-listbox-title-');
        this.selectedItem = React.createRef();
        this.listboxContainer = React.createRef();
    }

    keyboardNavigation(e) {
        if(e.key == 'ArrowDown') {
            e.preventDefault();
            this.navigateUpDown(true);
        }
        if(e.key == 'ArrowUp') {
            e.preventDefault();
            this.navigateUpDown(false);
        }
        if(e.key == 'Enter' && this.state.currentResult !== null) {
            e.preventDefault();
            const feature = this.props.visibleFeatures[ this.state.currentResult ];
            this.props.onSelectFeature({
                feature: feature.getProperties(),
                type: FEATURE_TYPE_BUILTIN
            })
        }
    }

    navigateUpDown(incr) {
        if(!this.props.visibleFeatures) {
            return;
        }
        const totalResults = this.props.visibleFeatures.slice(0, this.props.maxResults).length;
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

    componentDidUpdate() {
        // Take care of scrolling the listbox when using keyboard navigation
        if(this.state.currentResult === null) {
            return;
        }
        const listboxNode = this.listboxContainer.current;
        const element = this.selectedItem.current;
        if(element === null) {
            return;
        }
        if(listboxNode.scrollHeight > listboxNode.clientHeight) {
            const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
            const elementBottom = element.offsetTop + element.offsetHeight;
            if (elementBottom > scrollBottom) {
                listboxNode.scrollTop = elementBottom - listboxNode.clientHeight;
            }
            else if (element.offsetTop < listboxNode.scrollTop + element.offsetHeight) {
                listboxNode.scrollTop = element.offsetTop - element.offsetHeight;
            }
        }
    }

    render() {
        const features = this.props.visibleFeatures;
        const totalResults = features.length;
        if(totalResults == 0) {
            return null;
        }
        let activeDescendant;
        let i = 0;
        const results = features.slice(0, this.props.maxResults).map((feature) => {
            const selected = i++ === this.state.currentResult;
            const classes = classNames({
                focused: selected,
                redirect: feature.get('content_type') == CONTENT_TYPE_REDIRECT,
                post: feature.get('content_type') == CONTENT_TYPE_POST
            });
            const id = _.uniqueId('gh-dim-features-listbox-item-');
            if(selected) {
                activeDescendant = id;
            }
            return <li key={i}
                id={id}
                aria-selected={selected ? 'true' : 'false'}
                onClick={(e) => this.props.onSelectFeature({
                    feature: feature.getProperties(),
                    type: FEATURE_TYPE_BUILTIN
                })}
                ref={selected ? this.selectedItem : null}
                role="option"
                className={classes}>{feature.get('title')}</li>
        });
        const expanded = totalResults > 0 ? true : false;
        
        return (
            <div className="gh-dim-features-listbox" tabIndex="0" onKeyDown={(e) => this.keyboardNavigation(e)} onBlur={(e) => this.setState({currentResult: null})}>
                <section aria-labelledby={this.headerId}>
                    <header>
                        <h1 id={this.headerId}>Gevonden locaties <span>({totalResults > 100 ? '100+' : totalResults})</span></h1>
                    </header>
                    <div className="gh-dim-features-listbox-content" ref={this.listboxContainer}>
                        <ul aria-live="polite" role="listbox" aria-label="Locaties zichtbaar op de kaart" aria-activedescendant={activeDescendant} aria-expanded={expanded}>
                            {results.map((result) => { return result })}
                        </ul>
                        {totalResults > this.props.maxResults &&
                            <p className="gh-dim-features-listbox-description">{this.props.maxResults} van de {totalResults} resultaten zichtbaar. Zoom in om de resultaten te verfijnen.</p>}
                    </div>
                </section>
            </div>
        )
    }
}

FeaturesListboxComponent.defaultProps = {
    visibleFeatures: [],
    onSelectFeature: _.noop,
    maxResults: 25
};

export default FeaturesListboxComponent;