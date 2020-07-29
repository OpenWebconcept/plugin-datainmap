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
import ReactDOM from 'react-dom';

class FeaturesListboxComponent extends Component {

    render() {
        return (
            <div className="gh-dim-features-listbox">
                <ul>
                    {this.props.visibleFeatures.slice(0, this.props.maxResults).map((feature, i) => {
                        return <li key={i}>{feature.get('title')}</li>
                    })}
                </ul>
            </div>
        )
    }
}

FeaturesListboxComponent.defaultProps = {
    visibleFeatures: [],
    maxResults: 100
};

export default FeaturesListboxComponent;