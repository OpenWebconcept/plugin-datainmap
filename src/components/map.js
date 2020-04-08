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
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { zoomTo, zoomToMax } from '../util/map-animations';
import { getUid } from 'ol/util';
import Overlay from 'ol/Overlay';
import { FEATURE_TYPE_BUILTIN, FEATURE_TYPE_FEATUREINFOURL } from '../constants';

const isCluster = (feature) => {
    return feature.get('features') !== undefined;
};
const isSingleFeature = (feature) => {
    if(feature.get('features') === undefined) {
        return true;
    }
    return feature.get('features').length == 1;
};

export class MapComponent extends Component {

    constructor(props) {
        super(props);
        this.olMap = null;
        this.tooltipFeature = null;
    }

    componentDidMount() {
        const olView = new View(this.props.viewSettings);
        const mapElement = ReactDOM.findDOMNode(this.refs.map);
        const tooltipElement = ReactDOM.findDOMNode(this.refs.tooltip);
        this.olMap = new Map({
            view: olView,
            target: mapElement,
            layers: this.props.layers,
        });
        // Display pointer when over a feature
        this.olMap.on('pointermove', (e) => {
            if(e.dragging) {
                return;
            }
            const pixel = this.olMap.getEventPixel(e.originalEvent);
            const hit = this.olMap.hasFeatureAtPixel(pixel);
            this.olMap.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });
        // PickLocation
        this.olMap.on('click', (e) => {
            const pixel = this.olMap.getEventPixel(e.originalEvent);
            const coord = this.olMap.getCoordinateFromPixel(pixel);
            this.props.onPickLocation(coord, this.olMap);
        });

        if(!this.props.enableDrawing) {
            // Show tooltip on hover
            if(this.props.enableTooltip) {
                const tooltip = new Overlay({
                    element: tooltipElement,
                    positioning: 'bottom-center',
                    insertFirst: false,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                // Allow clicking on the tooltip to select the feature
                tooltipElement.addEventListener('click', (e) => {
                    if(this.tooltipFeature !== null) {
                        this.props.onSelectFeature({
                            feature: this.tooltipFeature.getProperties(),
                            type: FEATURE_TYPE_BUILTIN
                        });
                        tooltip.setPosition(undefined);
                    }
                })
                this.olMap.addOverlay(tooltip);
                this.olMap.on('pointermove', _.throttle((e) => {
                    const pixel = this.olMap.getEventPixel(e.originalEvent);
                    const features = this.olMap.getFeaturesAtPixel(pixel);
                    if(features.length == 0) {
                        this.tooltipFeature = null;
                        tooltipElement.innerHTML = '';
                        tooltip.setPosition(undefined);
                        return;
                    }
                    if(isSingleFeature(features[0])) {
                        let feature;
                        if(isCluster(features[0])) {
                            feature = features[0].get('features')[0];
                        }
                        else {
                            feature = features[0];
                        }
                        if(feature != this.tooltipFeature) {
                            const coord = this.olMap.getCoordinateFromPixel(pixel);
                            tooltipElement.innerHTML = '<span>' + feature.get('title') + '</span>';
                            tooltip.setPosition(coord);
                            this.tooltipFeature = feature;
                        }
                    }
                }, 35, {
                    'trailing': true,
                    'leading': false
                }));
            }
            this.olMap.on('click', (e) => {
                const pixel = this.olMap.getEventPixel(e.originalEvent);
                let features = [];
                this.olMap.forEachFeatureAtPixel(pixel, (feature) => {
                    features.push(feature);
                });
                // console.log('features', features);

                // Check for selected features in one of our layers (such as WMS)
                const viewResolution = olView.getResolution();
                this.olMap.getLayers().forEach((layer) => {
                    const source = layer.getSource();
                    if(source.getFeatureInfoUrl) {
                        this.props.onSelectFeature({
                            cb: (params) => source.getFeatureInfoUrl(e.coordinate, viewResolution, olView.getProjection(), params),
                            type: FEATURE_TYPE_FEATUREINFOURL
                        });
                    }
                });

                const getXY = (feature) => {
                    const x = feature.get('geometry').flatCoordinates[0];
                    const y = feature.get('geometry').flatCoordinates[1];
                    return [x, y];
                };

                if(features.length > 1) {
                    // console.log('- Meerdere features');
                    zoomTo(olView, getXY(features[0]));
                }
                else if(features.length == 1) {
                    // console.log('- Enkele feature');
                    let feature = null;
                    if(isCluster(features[0])) {
                        // console.log('-- Is een cluster of onderdeel van');
                        if(isSingleFeature(features[0])) {
                            // console.log('--- Is een single feature in een cluster')
                            feature = features[0].get('features')[0];
                        }
                        else if(isCluster(features[0])) {
                            // console.log('--- Is een cluster');
                            zoomTo(olView, getXY(features[0]));
                        }
                    }
                    else {
                        // console.log('-- Is een single feature');
                        feature = features[0];
                    }
                    if(feature !== null) {
                        // console.log('- select feature', feature);
                        this.props.onSelectFeature({
                            feature: feature.getProperties(),
                            type: FEATURE_TYPE_BUILTIN
                        });
                    }
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.layers && this.props.layers.length != prevProps.layers.length) {
            const layers = this.olMap.getLayers().getArray();
            const map_ids = layers.map(getUid);
            this.props.layers.forEach((layer) => {
                const id = getUid(layer);
                if(map_ids.indexOf(id) == -1) {
                    this.olMap.addLayer(layer);
                }
            });
        }
        if(this.props.centerLocation && this.props.centerLocation != prevProps.centerLocation) {
            zoomToMax(this.olMap.getView(), this.props.centerLocation);
        }
        if(this.props.interactions) {
            prevProps.interactions.forEach((o) => {
                this.olMap.removeInteraction(o);
            });
            this.props.interactions.forEach((o) => {
                this.olMap.addInteraction(o);
            });
        }
    }

    render() {
        return (
            <>
                <div className="gh-dim-map-container">
                    <div ref="map" className="gh-dim-map"></div>
                    {this.props.children}
                </div>
                <div ref="tooltip" className="gh-dim-tooltip"></div>
            </>
        )
    }
}

MapComponent.defaultProps = {
    layers: [],
    interactions: [],
    onSelectFeature: _.noop,
    onPickLocation: _.noop,
    isFetching: 0,
    centerLocation: null,
    enableDrawing: false,
    enableTooltip: false
};

export default MapComponent;