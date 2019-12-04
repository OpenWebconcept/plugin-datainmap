import { connect } from 'react-redux';
import FeatureComponent from '../components/feature';
import { setFeature } from '../actions';

const mapStateToProps  = (state, ownProps) => {
    return {
        feature: state.feature.feature
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
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