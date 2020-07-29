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
import _ from 'lodash';

export function isCluster(feature) {
    return feature.get('features') !== undefined;
}

export function isSingleFeature(feature) {
    if(feature.get('features') === undefined) {
        return true;
    }
    return feature.get('features').length == 1;
}

export function featureContainsSelectedProperties(feature, selectedFilters = [], strategy = 'ANY') {
    if(selectedFilters.length == 0) {
        return true;
    }
    const location_properties = feature.get('location_properties');
    switch(strategy) {
        default:
        // Show feature if ANY selected filter matches
        case 'ANY':
            for (let index = 0; index < selectedFilters.length; index++) {
                const selectedFilter = selectedFilters[index];
                if(_.indexOf(location_properties, selectedFilter) !== -1) {
                    return true;
                }
            }
            return false;
        // Show feature if ALL selected filters match
        case 'ALL':
            return _.intersection(location_properties, selectedFilters).length == selectedFilters.length;
        // Hide feature if ANY selected filter matches
        case 'NONE':
            return !_.intersection(location_properties, selectedFilters).length > 0;
    }
}

// Given single features or a cluster feature, will flatten them to a single list
export function flattenFeatures(features) {
    let singleFeatures = [];
    features.forEach((feature) => {
        if(isCluster(feature)) {
            if(isSingleFeature(feature)) {
                singleFeatures.push(feature.get('features')[0]);
            }
            else {
                const flattened = flattenFeatures(feature.get('features'));
                singleFeatures = singleFeatures.concat(flattened);
            }
        }
        else {
            singleFeatures.push(feature);
        }
    });
    return singleFeatures;
}