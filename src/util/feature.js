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