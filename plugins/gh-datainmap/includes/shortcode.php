<?php
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

add_shortcode( 'datainmap', 'gh_dim_shortcode' );
function gh_dim_shortcode($atts, $content = null) {
    $settings = get_option('gh-datainmap-settings');
    // Override settings from attributes
    $args = shortcode_atts( [
            'types' => null,
            'zoom' => $settings['zoom'],
            'min_zoom' => $settings['minZoom'],
            'max_zoom' => $settings['maxZoom'],
            'center_x' => $settings['center_x'],
            'center_y' => $settings['center_y'],
            'projection' => $settings['projection'],
            'layers' => null,
            'single_cluster' => 0,
            'single_cluster_distance' => 75,
            'enable_search' => 1,
            'enable_feature_dialog' => 1,
            'enable_tooltip' => 0,
            'enable_filter' => 0,
            'dynamic_loading' => 0,
            'css_class' => null,
            'filter_properties' => null,
            'filter_description' => $settings['filter_description'],
        ], $atts );
    $settings['zoom'] = (int)$args['zoom'];
    $settings['minZoom'] = (int)$args['min_zoom'];
    $settings['maxZoom'] = (int)$args['max_zoom'];
    $settings['center_x'] = $args['center_x'];
    $settings['center_y'] = $args['center_y'];
    $settings['projection'] = $args['projection'];
    $settings['single_cluster'] = $args['single_cluster'] == 1 ? true : false;
    $settings['single_cluster_distance'] = (int)$args['single_cluster_distance'];
    $settings['enable_search'] = $args['enable_search'] == 1 ? true : false;
    $settings['enable_feature_dialog'] = $args['enable_feature_dialog'] == 1 ? true : false;
    $settings['enable_tooltip'] = $args['enable_tooltip'] == 1 ? true : false;
    $settings['enable_filter'] = $args['enable_filter'] == 1 ? true : false;
    $settings['dynamic_loading'] = $args['dynamic_loading'] == 1 ? true : false;
    $settings['filter_description'] = $args['filter_description'];

    // Compose map layers
    $layers = get_posts([
        'post_type' => 'gh-dim-layers',
        'include' => explode(',', $args['layers']),
        'orderby' => 'post__in',
    ]);
    $map_layers = array_map(function($post) {
        return [
            'title' => get_the_title( $post->ID ),
            'type' => get_post_meta($post->ID, '_gh_dim_layer_type', true),
            'url' => get_post_meta($post->ID, '_gh_dim_layer_url', true),
            'name' => get_post_meta($post->ID, '_gh_dim_layer_name', true),
            'opacity' => (float)get_post_meta($post->ID, '_gh_dim_layer_opacity', true),
            'matrixset' => get_post_meta($post->ID, '_gh_dim_layer_maxtrixset', true),
            'kml_ignore_style' => (bool)get_post_meta($post->ID, '_gh_dim_kml_ignore_style', true),
            'server_type' => get_post_meta($post->ID, '_gh_dim_layer_server_type', true),
            'cross_origin' => get_post_meta($post->ID, '_gh_dim_layer_cross_origin', true),
        ];
    }, $layers);

    $terms = [];
    if(strlen($args['types']) > 0) {
        $term_taxonomy_ids = explode(',', $args['types']);
        $terms = get_terms([
            'taxonomy' => 'gh-dim-location-types',
            'term_taxonomy_id' => $term_taxonomy_ids,
            'hide_empty' => false,
        ]);
    }

    // Compose location layers
    $location_layers = array_map('gh_dim_get_location_layer', $terms);

    // Fetch all used location-properties tags
    $location_property_ids = array_map(function($location_layer) {
        $ids = array_map(function($feature) {
            return $feature['location_properties'];
        }, $location_layer['features']);
        return array_merge(...$ids);
    }, $location_layers);
    if(count($location_property_ids) > 0) {
        $location_property_ids = array_unique(array_merge(...$location_property_ids));
    }
    $location_property_terms_unfiltered = get_terms([
        'taxonomy' => 'gh-dim-location-properties',
        'term_taxonomy_id' => $location_property_ids,
        'hide_empty' => true,
        'fields' => 'all',
        'orderby' => 'name',
        'order' => 'ASC',
    ]);

    if(!empty($args['filter_properties'])) {
        $include_filters = array_map('trim', explode(',', $args['filter_properties']));
        $location_property_terms_filtered = array_values(array_filter($location_property_terms_unfiltered, function($term) use($include_filters) {
            return
                in_array($term->term_id, $include_filters)
                || in_array($term->name, $include_filters)
                || in_array($term->slug, $include_filters);
        }));
    }
    else {
        $location_property_terms_filtered = $location_property_terms_unfiltered;
    }

    // Delete features from shortcode output if location layers are being dynamically loaded
    if($settings['dynamic_loading']) {
        $location_layers = array_map(function($layer) {
            $layer['features'] = [];
            return $layer;
        }, $location_layers);
    }

    $proj4 = gh_dim_parse_proj4($settings['projections']);
    unset($settings['projections']);

    $el_id = uniqid('gh-datainmap-');
    $settings['element'] = $el_id;

    if($settings['include_default_style']) {
        wp_enqueue_style( 'gh-dim-style' );
    }

    wp_enqueue_script( 'gh-dim-datainmap' );
    $security = wp_create_nonce('gh-dim-datainmap');
    $GHDataInMap = [
        'ajaxurl' => admin_url( 'admin-ajax.php' ),
        'fetchFeatureUrl' => admin_url( 'admin-ajax.php' ) . '?action=gh_dim_get_location_info&security=' . $security . '&location_id=',
        'fetchLayerFeaturesUrl' => admin_url( 'admin-ajax.php' ) . '?action=gh_dim_get_location_layer_features&security=' . $security . '&term_id=',
        'security' => $security,
        'settings' => $settings,
        'location_layers' => $location_layers,
        'map_layers' => $map_layers,
        'location_properties' => array_map(function($term) {
            return [
                'term_id' => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
            ];
        }, $location_property_terms_filtered),
        'proj4' => $proj4,
    ];

    $script_open = '<script type="text/javascript">';
    $script_contents = 'var GHDataInMap = '.wp_json_encode($GHDataInMap) . ';';
    $script_close = '</script>';
    $script_open = apply_filters( 'datainmap_shortcode_script_open', $script_open );
    $script_contents = apply_filters( 'datainmap_shortcode_script_contents', $script_contents, $GHDataInMap );
    $script_close = apply_filters( 'datainmap_shortcode_script_close', $script_close );
    $output = $script_open . $script_contents . $script_close;
    $class = !empty($args['css_class']) ? ' class="'.esc_attr($args['css_class']).'"' : null;
    $output .= '<div id="'.$el_id.'"'.$class.'>'.__('Loading...', 'gh-datainmap').'</div>';
    return $output;
}