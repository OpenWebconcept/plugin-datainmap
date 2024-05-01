<?php
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

add_action('admin_init', 'gh_dim_register_settings');
function gh_dim_register_settings() {
    register_setting('gh-datainmap-settings-group', 'gh-datainmap-settings', 'gh_dim_sanitize_settings');
}

add_filter('option_page_capability_gh-datainmap-settings-group', function($cap) {
    return 'manage_options_gh-dim';
}, 10, 1);


function gh_dim_sanitize_settings($input) {
    $text_fields = [
        'include_default_style',
        'style_circle_radius',
        'style_circle_text_font',
        'style_circle_text_scale',
        'style_circle_text_baseline',
        'style_circle_stroke_color',
        'style_circle_fill_color',
        'style_text_color',
        'style_circle_stroke_color_cluster',
        'style_circle_fill_color_cluster',
        'style_text_color_cluster',
        'center_x',
        'center_y',
        'zoom',
        'minZoom',
        'maxZoom',
        'projection',
        'search_coord_system',
        'filter_description',
        'toggler_description',
    ];
    foreach($text_fields as $k) {
        $input[$k] = sanitize_text_field( $input[$k] );
    }
    $input['projections'] = sanitize_textarea_field( $input['projections'] );
    $input['style_circle_text_scale'] = sprintf('%.2f', $input['style_circle_text_scale']);
    return $input;
}

function gh_dim_settings_page() {
    if (!current_user_can('manage_options_gh-dim')) {
        wp_die('Unauthorized user.');
    }
    include GH_DIM_DIR . '/views/settings.php';
}