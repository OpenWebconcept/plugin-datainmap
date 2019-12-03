<?php

add_action('admin_menu', 'gh_dim_menu');
function gh_dim_menu() {
    add_submenu_page(
        'edit.php?post_type=gh-dim-locations',
        __('Settings', 'gh-datainmap'),
        __('Settings', 'gh-datainmap'),
        'manage_options',
        'gh_dim_settings',
        'gh_dim_settings_page',
    );
}

add_action('admin_init', 'gh_dim_register_settings');
function gh_dim_register_settings() {
    register_setting('gh-datainmap-settings-group', 'gh-datainmap-settings', 'gh_dim_sanitize_settings');
}

function gh_dim_sanitize_settings($input) {
    foreach($input as $k => $v) {
        $input[$k] = sanitize_text_field( $v );
    }
    return $input;
}

function gh_dim_settings_page() {
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized user.');
    }

    include GH_DIM_DIR . '/views/settings.php';
}