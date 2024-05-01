/*
* Copyright 2020-2024 Gemeente Heerenveen
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
import { CONTENT_TYPE_REDIRECT, CONTENT_TYPE_POST, FEATURE_TYPE_BUILTIN, FEATURE_TYPE_FEATUREINFOURL, FEATURE_TYPE_KMLFEATURE, FEATURE_TYPE_UNKNOWN } from '../constants';

const mapStateToProps  = (state) => {
    return {
        viewSettings: state.map.view,
        layers: state.map.layers,
        interactions: state.map.interactions,
        isFetching: state.map.isFetching,
        centerLocation: state.map.centerLocation,
        rerenderLayers: state.map.rerenderLayers,
        storedFeatures: state.map.storedFeatures,
        selectedFilters: state.filter.selected,
        toggledLayersState: state.toggler.toggledLayersState,
        toggleLayers: state.map.toggleLayers,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectFeature: (obj) => {
            switch(obj.type) {
                case FEATURE_TYPE_BUILTIN:
                    // Request additional info from the selected feature (WordPress location)
                    if(obj.feature.feature_id) {
                        switch(obj.feature.content_type) {
                            default:
                            case CONTENT_TYPE_POST:
                                dispatch(selectFeature(obj.feature.feature_id));
                                break;
                            case CONTENT_TYPE_REDIRECT:
                                location.assign(obj.feature.redirect);
                                break;
                        }
                    }
                    // Not a WordPress location feature, no need to fetch. Probably a KML feature
                    else {
                        dispatch(setFeature({
                            type: obj.feature.name ? FEATURE_TYPE_KMLFEATURE : FEATURE_TYPE_UNKNOWN,
                            data: obj.feature
                        }));
                    }
                    break;
                case FEATURE_TYPE_FEATUREINFOURL:
                    dispatch(selectFeatureGeoserver(obj.cb));
                    break;
            }
        }
    }
};

const MapComponentLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(MapComponent);

export default MapComponentLink;