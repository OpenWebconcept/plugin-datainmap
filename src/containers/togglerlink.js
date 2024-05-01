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
import TogglerComponent from '../components/toggler';
import { toggleLayer } from '../actions';

const mapStateToProps  = (state) => {
    return {
        layers: state.map.layers,
        togglers: state.toggler.togglers,
        toggledLayersState: state.toggler.toggledLayersState,
        description: state.toggler.description
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        doToggleLayer: (layerType, layerId, checked) => {
            dispatch(toggleLayer(layerType, layerId, checked));
        }
    }
}

const TogglerComponentLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(TogglerComponent)

export default TogglerComponentLink