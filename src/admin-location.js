import jQuery from 'jquery';
const $ = jQuery;
$(document).ready(function() {
    const layerType = $('#gh_dim_location_type');
    if(!layerType) {
        return;
    }

    const allFields = [
        '#gh_dim_location_type',
        '#gh_dim_location',
        '#gh_dim_location_style_line_color',
        '#gh_dim_location_style_line_width',
        '#gh_dim_location_style_fill_color'
    ];

    const visibleFields = {
        'point': [
            '#gh_dim_location_type',
            '#gh_dim_location',
        ],
        'linestring': [
            '#gh_dim_location_type',
            '#gh_dim_location',
            '#gh_dim_location_style_line_color',
            '#gh_dim_location_style_line_width',
            '#gh_dim_location_style_fill_color'
        ],
        'polygon': [
            '#gh_dim_location_type',
            '#gh_dim_location',
            '#gh_dim_location_style_line_color',
            '#gh_dim_location_style_line_width',
            '#gh_dim_location_style_fill_color'
        ],
        'circle': [
            '#gh_dim_location_type',
            '#gh_dim_location',
            '#gh_dim_location_style_line_color',
            '#gh_dim_location_style_line_width',
            '#gh_dim_location_style_fill_color'
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
