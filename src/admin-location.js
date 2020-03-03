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
