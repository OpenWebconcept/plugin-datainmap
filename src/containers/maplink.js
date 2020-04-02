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
import { connect } from 'react-redux';
import MapComponent from '../components/map';
import { selectFeature, setFeature, selectFeatureGeoserver } from '../actions';

const mapStateToProps  = (state) => {
    return {
        viewSettings: state.map.view,
        layers: state.map.layers,
        interactions: state.map.interactions,
        isFetching: state.map.isFetching,
        centerLocation: state.map.centerLocation
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectFeature: (feature) => {
            // Feature is a feature URL from a Geoserver
            if(typeof(feature) === 'string') {
                dispatch(selectFeatureGeoserver(feature));
            }
            // Request additional info from the selected feature (WordPress location)
            else if(feature.feature_id) {
                dispatch(selectFeature(feature.feature_id));
            }
            // Not a WordPress location feature, no need to fetch. Probably a KML feature
            else {
                dispatch(setFeature(feature));
            }
        }
    }
};

const MapComponentLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(MapComponent);

export default MapComponentLink;