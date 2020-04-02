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
import { selectFeature, setFeature } from '../actions';
import { CONTENT_TYPE_REDIRECT, CONTENT_TYPE_POST } from '../constants';

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
            // Vraag aanvullende informatie op van feature
            if(feature.feature_id) {
                switch(feature.content_type) {
                    default:
                    case CONTENT_TYPE_POST:
                        dispatch(selectFeature(feature.feature_id));
                        break;
                    case CONTENT_TYPE_REDIRECT:
                        location.assign(feature.redirect);
                        break;
                }
            }
            // KML feature, fetchen niet nodig
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