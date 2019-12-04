import jQuery from 'jquery';
const $ = jQuery;
$(document).ready(function() {
    const layerType = $('#gh_dim_layer_type');
    if(!layerType) {
        return;
    }

    const visibleFields = {
        'KML': [
            '#gh_dim_layer_url',
            '#gh_dim_kml_ignore_style'
        ],
        'OSM': [
        ],
        'WMTS-auto': [
            '#gh_dim_layer_url',
            '#gh_dim_layer_name',
            '#gh_dim_layer_maxtrixset',
        ]
    };

    const createShowFields = (type) => {
        const _showFields = (selectors, checkFn) => {
            let result = checkFn();
            $.each(selectors, (i, selector) => {
                if(result) {
                    $(selector).closest('tr').show();
                }
                else {
                    $(selector).closest('tr').hide();
                }
            });
        };
        return () => {
            const fields = visibleFields[type];
            _showFields(visibleFields[type], () => {
                return layerType.val() == type;
            });
        }
    };

    // Verberg alle velden die niet van toepassing zijn voor een layer type
    Object.keys(visibleFields).forEach( k => {
        const f = createShowFields(k);
        layerType.on('change', f);
        f();
    });
});
