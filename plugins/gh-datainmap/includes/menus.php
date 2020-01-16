<?php

add_action('admin_menu' , 'gh_dim_menu');
function gh_dim_menu() {
    add_menu_page(
        __('DataInMap', 'gh-datainmap'),
        __('DataInMap', 'gh-datainmap'),
        'manage_options',
        'gh-dim',
        'gh_dim_settings_page',
        'dashicons-location-alt'
    );
    add_submenu_page(
        'gh-dim',
        __('Location Types', 'gh-datainmap'),
        __('Location Types', 'gh-datainmap'),
        'manage_options',
        'edit-tags.php?taxonomy=gh-dim-location-types&post_type=gh-dim-locations',
        null
    );
    add_submenu_page(
        'gh-dim',
        __('Location Properties', 'gh-datainmap'),
        __('Location Properties', 'gh-datainmap'),
        'manage_options',
        'edit-tags.php?taxonomy=gh-dim-location-properties&post_type=gh-dim-locations',
        null
    );
    add_submenu_page(
        'gh-dim',
        __('Settings', 'gh-datainmap'),
        __('Settings', 'gh-datainmap'),
        'manage_options',
        'gh_dim_settings',
        'gh_dim_settings_page'
    );
}

function gh_dim_set_current_menu($parent_file) {
    global $submenu_file, $current_screen, $pagenow;
        // Stel submenu in als actief bij custom post type gh-dim-locations
        if ( $current_screen->post_type == 'gh-dim-locations' ) {
            if ( $pagenow == 'edit-tags.php' ) {
                $submenu_file = 'edit-tags.php?taxonomy=' . $current_screen->taxonomy . '&post_type=' . $current_screen->post_type;
            }
            $parent_file = 'gh-dim';
        }
        return $parent_file;
}
add_filter( 'parent_file', 'gh_dim_set_current_menu' );