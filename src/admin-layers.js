import jQuery from 'jquery';
const $ = jQuery;
$(document).ready(function() {
    const layerType = $('#gh_dim_layer_type');
    if(!layerType) {
        return;
    }

    const allFields = [
        '#gh_dim_layer_url',
        '#gh_dim_kml_ignore_style',
        '#gh_dim_layer_name',
        '#gh_dim_layer_maxtrixset',
        '#gh_dim_layer_server_type',
        '#gh_dim_layer_cross_origin'
    ];

    const visibleFields = {
        'GeoJSON': [
            '#gh_dim_layer_url',
        ],
        'KML': [
            '#gh_dim_layer_url',
            '#gh_dim_kml_ignore_style'
        ],
        'OSM': [
        ],
        'TileWMS': [
            '#gh_dim_layer_url',
            '#gh_dim_layer_name',
            '#gh_dim_layer_server_type',
            '#gh_dim_layer_cross_origin',
        ],
        'WMTS-auto': [
            '#gh_dim_layer_url',
            '#gh_dim_layer_name',
            '#gh_dim_layer_maxtrixset'
        ]
    };

    layerType.on('change', function(e) {
        const _showFields = (selectors, result) => {
            $.each(selectors, (i, selector) => {
                if(result) {
                    $(selector).closest('tr').show();
                }
                else {
                    $(selector).closest('tr').hide();
                }
            });
        };
        const type = $(this).val();
        const fields = visibleFields[type];
        _showFields(allFields, false);
        _showFields(fields, true);
    });
    layerType.trigger('change');
});
