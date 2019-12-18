<?php

add_action('init', 'gh_dim_register_post_type', 10);
function gh_dim_register_post_type() {
    $capabilities = [];
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
        'capability_type' => 'post',
        'can_export' => true,
        'supports' => array('title', 'editor'),
        'exclude_from_search' => true,
        'publicly_queryable' => false,
        'capabilities' => $capabilities,
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
        'capability_type' => 'post',
        'can_export' => true,
        'supports' => array('title'),
        'exclude_from_search' => true,
        'publicly_queryable' => false,
    ]);
}
