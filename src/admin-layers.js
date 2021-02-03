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
        '#gh_dim_layer_cross_origin',
        '#gh_dim_layer_ignore_features'
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
            '#gh_dim_layer_ignore_features'
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
