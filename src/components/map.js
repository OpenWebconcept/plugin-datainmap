import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { zoomTo, moveToAndZoom, flyTo, moveTo } from '../util/map-animations';

export class MapComponent extends Component {

    constructor(props) {
        super(props);
        this.olMap = null;
    }

    componentDidMount() {
        const olView = new View(this.props.viewSettings);
        const mapElement = ReactDOM.findDOMNode(this.refs.map);
        this.olMap = new Map({
            view: olView,
            target: mapElement,
            layers: this.props.layers,
        });
        // Display pointer when over a feature
        this.olMap.on('pointermove', (e) => {
            const pixel = this.olMap.getEventPixel(e.originalEvent);
            if(this.olMap.hasFeatureAtPixel(pixel)) {
                document.body.style.cursor = 'pointer';
            }
            else {
                document.body.style.cursor = 'default';
            }
        });
        this.olMap.on('click', (e) => {
            const pixel = this.olMap.getEventPixel(e.originalEvent);
            const coord = this.olMap.getCoordinateFromPixel(pixel);
            this.props.onPickLocation(coord, this.olMap);
        });
        this.olMap.on('click', (e) => {
            // Reset cursor pointer
            document.body.style.cursor = 'default';
            const pixel = this.olMap.getEventPixel(e.originalEvent);
            let features = [];
            this.olMap.forEachFeatureAtPixel(pixel, (feature) => {
                features.push(feature);
            });
            // console.log('features', features);

            const isCluster = (feature) => {
                return feature.get('features') !== undefined;
            };
            const isSingleFeature = (feature) => {
                if(feature.get('features') === undefined) {
                    return true;
                }
                return feature.get('features').length == 1;
            };
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
                    this.props.onSelectFeature(feature.getProperties());
                }
            }
        });
    }

    componentDidUpdate(prevProps) {
        if(this.props.layers && this.props.layers.length != prevProps.layers.length) {
            const layers = this.olMap.getLayers().getArray();
            const map_ids = layers.map((l) => {return l.ol_uid});
            this.props.layers.forEach((layer) => {
                if(map_ids.indexOf(layer.ol_uid) == -1) {
                    this.olMap.addLayer(layer);
                }
            });
        }
        if(this.props.centerLocation && this.props.centerLocation != prevProps.centerLocation) {
            moveToAndZoom(this.olMap.getView(), this.props.centerLocation);
        }
    }

    render() {
        return (
            <div className="gh-dim-map-container">
                <div ref="map" className="gh-dim-map"></div>
                {this.props.children}
            </div>
        )
    }
}

MapComponent.defaultProps = {
    layers: [],
    onSelectFeature: _.noop,
    onPickLocation: _.noop,
    isFetching: 0,
    centerLocation: null
};

export default MapComponent;