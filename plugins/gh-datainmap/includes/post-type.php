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

add_action('init', 'gh_dim_register_post_type', 10);
function gh_dim_register_post_type() {
    $labels = array(
        'name'                => __( 'Locations', 'gh-datainmap' ),
        'singular_name'       => __( 'Location', 'gh-datainmap' ),
        'menu_name'           => __( 'Locations', 'gh-datainmap' ),
        'parent_item_colon'   => __( 'Parent Locations', 'gh-datainmap' ),
        'all_items'           => __( 'All Locations', 'gh-datainmap' ),
        'view_item'           => __( 'View Location', 'gh-datainmap' ),
        'add_new_item'        => __( 'Add New Location', 'gh-datainmap' ),
        'add_new'             => __( 'Add New', 'gh-datainmap' ),
        'edit_item'           => __( 'Edit Location', 'gh-datainmap' ),
        'update_item'         => __( 'Update Location', 'gh-datainmap' ),
        'search_items'        => __( 'Search Locations', 'gh-datainmap' ),
        'not_found'           => __( 'Not Found', 'gh-datainmap' ),
        'not_found_in_trash'  => __( 'Not found in Trash', 'gh-datainmap' ),
    );
    register_post_type('gh-dim-locations', [
        'name' => __('Locations', 'gh-datainmap'),
        'singular' => __('Location', 'gh-datainmap'),
        'labels' => $labels,
        'public' => false,
        'has_archive' => false,
        'show_ui' => true,
        'show_in_menu' => 'gh-dim',
        'show_in_nav_menus' => true,
        'show_in_admin_bar' => true,
        'capability_type' => ['gh-dim-location', 'gh-dim-locations'],
        'map_meta_cap' => true,
        'can_export' => true,
        'supports' => ['title', 'editor', 'custom-fields'],
        'exclude_from_search' => true,
        'publicly_queryable' => false,
    ]);
    $labels = array(
        'name'                => __( 'Layers', 'gh-datainmap' ),
        'singular_name'       => __( 'Layer', 'gh-datainmap' ),
        'menu_name'           => __( 'Layers', 'gh-datainmap' ),
        'parent_item_colon'   => __( 'Parent Layers', 'gh-datainmap' ),
        'all_items'           => __( 'All Layers', 'gh-datainmap' ),
        'view_item'           => __( 'View Layer', 'gh-datainmap' ),
        'add_new_item'        => __( 'Add New Layer', 'gh-datainmap' ),
        'add_new'             => __( 'Add New', 'gh-datainmap' ),
        'edit_item'           => __( 'Edit Layer', 'gh-datainmap' ),
        'update_item'         => __( 'Update Layer', 'gh-datainmap' ),
        'search_items'        => __( 'Search Layers', 'gh-datainmap' ),
        'not_found'           => __( 'Not Found', 'gh-datainmap' ),
        'not_found_in_trash'  => __( 'Not found in Trash', 'gh-datainmap' ),
    );
    register_post_type('gh-dim-layers', [
        'name' => __('Layers', 'gh-datainmap'),
        'singular' => __('Layer', 'gh-datainmap'),
        'labels' => $labels,
        'public' => false,
        'has_archive' => false,
        'show_ui' => true,
        'show_in_menu' => 'gh-dim',
        'show_in_nav_menus' => true,
        'show_in_admin_bar' => true,
        'capability_type' => ['gh-dim-layer', 'gh-dim-layers'],
        'map_meta_cap' => true,
        'can_export' => true,
        'supports' => ['title'],
        'exclude_from_search' => true,
        'publicly_queryable' => false,
    ]);
}

// Pas de kolommen aan voor het gh-dim-locations overzicht
add_filter( 'manage_gh-dim-locations_posts_columns', function($columns) {
    $date = $columns['date'];
    unset( $columns['date'] );
    $columns['shape'] = __( 'Location Display', 'gh-datainmap' );
    $columns['content_type'] = __( 'Content Type', 'gh-datainmap' );
    $columns['date'] = $date;
    return $columns;
}, 10, 1 );

// Weergave van de extra gh-dim-locations kolommen
add_action( 'manage_gh-dim-locations_posts_custom_column' , function($column, $post_id) {
    switch ( $column ) {
        case 'shape':
            // Transformeer voor vertaling
            $type = ucfirst(get_post_meta($post_id, '_gh_dim_location_type', true));
            if($type == 'Linestring') {
                $type = 'LineString';
            }
            echo _e($type, 'gh-datainmap' );
            break;
        case 'content_type':
            // Transformeer voor vertaling
            $type = ucfirst(get_post_meta($post_id, '_gh_dim_location_content_type', true));
            echo _e($type, 'gh-datainmap' );
            break;
    }
}, 10, 2 );

// Extra gh-dim-locations kolommen klikbaar maken voor sorteren
add_filter( 'manage_edit-gh-dim-locations_sortable_columns', function($columns) {
    $columns['shape'] = 'shape';
    $columns['content_type'] = 'content_type';
	return $columns;
}, 10, 1 );

// Pas extra sorteer opties toe op gh-dim-locations
add_action( 'pre_get_posts', function($query) {
    global $current_screen;
    if(!(is_admin() && $query->is_main_query() && $current_screen->post_type === 'gh-dim-locations')) {
        return;
    }

    switch($query->get( 'orderby')) {
        case 'shape':
            $query->set('meta_key', '_gh_dim_location_type');
            $query->set('orderby', 'meta_value');
            break;
        case 'content_type':
            $query->set('meta_key', '_gh_dim_location_content_type');
            $query->set('orderby', 'meta_value');
            break;
    }
}, 10, 1);

// Voeg extra filter toe aan gh-dim-locations overzicht
add_action('restrict_manage_posts', function($post_type) {
    if($post_type !== 'gh-dim-locations') {
        return;
    }

    $selected = '';
    if(isset($_REQUEST['gh-dim-location-types'])) {
        $selected = $_REQUEST['gh-dim-location-types'];
    }

    $taxonomy = 'gh-dim-location-types';
    $info_taxonomy = get_taxonomy($taxonomy);
    wp_dropdown_categories(array(
        'show_option_all' => __( 'All location types', 'gh-datainmap' ),
        'taxonomy'        => $taxonomy,
        'name'            => $taxonomy,
        'orderby'         => 'name',
        'selected'        => $selected,
        'show_count'      => true,
        'hide_empty'      => true,
        'value_field'     => 'slug',
    ));
}, 10, 1);
