import { connect } from 'react-redux';
import MapComponent from '../components/map';
import { selectFeature } from '../actions';

const mapStateToProps  = (state, ownProps) => {
    return {
        viewSettings: state.map.view,
        layers: state.map.layers,
        isFetching: state.map.isFetching,
        centerLocation: state.map.centerLocation
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSelectFeature: (feature) => {
            dispatch(selectFeature(feature.feature_id));
        }
    }
};

const MapComponentLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(MapComponent);

export default MapComponentLink;