import { connect } from 'react-redux';
import FeatureComponent from '../components/feature';

const mapStateToProps  = (state, ownProps) => {
    return {
        feature: state.feature.feature
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

const FeatureComponentLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(FeatureComponent)

export default FeatureComponentLink