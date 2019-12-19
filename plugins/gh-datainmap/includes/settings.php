<?php

add_action('admin_init', 'gh_dim_register_settings');
function gh_dim_register_settings() {
    register_setting('gh-datainmap-settings-group', 'gh-datainmap-settings', 'gh_dim_sanitize_settings');
}

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
    ];
    foreach($text_fields as $k) {
        $input[$k] = sanitize_text_field( $input[$k] );
    }
    $input['projections'] = sanitize_textarea_field( $input['projections'] );
    $input['style_circle_text_scale'] = sprintf('%.2f', $input['style_circle_text_scale']);
    return $input;
}

function gh_dim_settings_page() {
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized user.');
    }
    include GH_DIM_DIR . '/views/settings.php';
}