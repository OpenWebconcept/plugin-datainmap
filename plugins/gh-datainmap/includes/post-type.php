<?php

add_action('init', 'gh_dim_register_post_type', 10);
function gh_dim_register_post_type() {
    // If debug is true, allow access to the post edit page
    if( WP_DEBUG === true || GH_DIM_DEBUG === true ) {
        $capabilities = [];
    }
    else {
        $capabilities = [
            'create_posts' => 'do_not_allow'
        ];
    }
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
        'show_in_menu' => true,
        'show_in_nav_menus' => true,
        'show_in_admin_bar' => true,
        'capability_type' => 'post',
        'can_export' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'exclude_from_search' => true,
        'publicly_queryable' => false,
        'menu_position'	=> 20,
        'menu_icon'	=> 'dashicons-text-page',
        'capabilities' => $capabilities,
    ]);
}
