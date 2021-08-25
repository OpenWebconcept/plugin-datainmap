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

class TogglerItemComponent extends Component {
    isChecked(layerType, layerId) {
        const found = this.props.toggledLayersState.find( o => {
            return o.layerId === layerId && o.layerType === layerType;
        });
        return found !== undefined ? found.checked : true;
    }

    render() {
        const layerId = this.props.layer.get('dimLayerID');
        const layerType = this.props.layer.get('dimLayerType');
        const layerName = this.props.layer.get('dimLayerName');
        const id = _.uniqueId('gh-dim-toggler-');
        const checked = this.isChecked(layerType, layerId);
        return (
            <div className="gh-dim-toggler-toggle">
                <input id={id} type="checkbox" defaultChecked={checked} onKeyDown={blur} onClick={(e) => this.props.handleChange(layerType, layerId, e.currentTarget.checked)} /> <label htmlFor={id}>{layerName}</label>
            </div>
        );
    }
}

export class TogglerComponent extends Component {
    constructor(props) {
        super(props);
    }

    doToggleLayer(layerType, layerId, checked) {
        this.props.doToggleLayer(layerType, layerId, checked);
    }

    shouldShowLayerToggler(layerType, layerId) {
        return this.props.togglers.some(toggle => {
            if(toggle.id === undefined) {
                return false;
            }
            return toggle.type === layerType && (
                toggle.id == 'all' || toggle.id == layerId
            );
        });
    }

    render() {
        if(this.props.layers.length == 0) {
            return null;
        }
        const id = _.uniqueId('toggler-title-');
        return (
            <div className="gh-dim-toggler" tabIndex="0" onKeyDown={blur}>
                <section aria-labelledby={id}>
                    <header>
                        <h1 id={id}>Lagen</h1>
                    </header>
                    <div className="gh-dim-togglers">
                        {this.props.description &&
                            <p className="gh-dim-togglers-description">{this.props.description}</p>
                        }
                        <form>
                            <div role="group" aria-label="Togglers">
                                {this.props.layers.map((layer) => {
                                    const id = layer.get('dimLayerID');
                                    const type = layer.get('dimLayerType');
                                    if(!this.shouldShowLayerToggler(type, id)) {
                                        return null;
                                    }
                                    return <TogglerItemComponent key={type + '-' + id} toggledLayersState={this.props.toggledLayersState} layer={layer} handleChange={(type, id, checked) => this.doToggleLayer(type, id, checked)} />;
                                })}
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        )
    }
}

TogglerComponent.defaultProps = {
    doToggleLayer: _.noop,
    layers: [],
    toggledLayersState: [],
    togglers: []
};

export default TogglerComponent;