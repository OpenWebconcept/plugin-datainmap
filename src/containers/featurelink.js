import { connect } from 'react-redux';
import FeatureComponent from '../components/feature';
import { setFeature } from '../actions';

const mapStateToProps  = (state) => {
    return {
        feature: state.feature.feature
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetFeature: () => {
            dispatch(setFeature(null));
        }
    }
}

const FeatureComponentLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(FeatureComponent)

export default FeatureComponentLink