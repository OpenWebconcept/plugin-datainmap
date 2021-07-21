export const CONTENT_TYPE_POST = 0;
export const CONTENT_TYPE_REDIRECT = 1;

// The different type of features the map can return after clicking
// - BuiltIn are WordPress locations or from KML
// - FeatureInfoUrl are from WMS
export const FEATURE_TYPE_BUILTIN = 'BuiltIn';
export const FEATURE_TYPE_FEATUREINFOURL = 'FeatureInfoUrl';

// The different type of features. The type will decide which modal to use
export const FEATURE_TYPE_DIMFEATURE = 'DIMFeature';
export const FEATURE_TYPE_KMLFEATURE = 'KMLFeature';
export const FEATURE_TYPE_WMSFEATURE = 'WMSFeature';
export const FEATURE_TYPE_UNKNOWN = 'UnknownFeature';

// The different types of layers
export const LAYER_TYPE_MAP = 'MapLayer';
export const LAYER_TYPE_LOCATION = 'LocationLayer';