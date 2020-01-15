import { connect } from 'react-redux';
import MapComponent from '../components/map';
import { selectFeature, setFeature } from '../actions';

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
                dispatch(selectFeature(feature.feature_id));
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