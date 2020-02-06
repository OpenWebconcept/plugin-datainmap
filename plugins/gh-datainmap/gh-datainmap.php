<?php
/*
Plugin Name: Data In Map
Plugin URI: https://www.heerenveen.nl/
Description: Data In Map is een plugin voor het weergeven van kaarten.
Version: 1.2.0
Requires at least: 5.0
Requires PHP: 7.2
Author: Gemeente Heerenveen
Author URI: https://www.heerenveen.nl/
Text Domain: gh-datainmap
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
if ( ! defined('GH_DIM_VERSION')) define('GH_DIM_VERSION', '1.2.0');
if ( ! defined('GH_DIM_FILE')) define('GH_DIM_FILE', __FILE__);
if ( ! defined('GH_DIM_DIR')) define('GH_DIM_DIR', dirname(__FILE__));
if ( ! defined('GH_DIM_DEBUG')) define('GH_DIM_DEBUG', false);
if ( ! defined('GH_DIM_LOCATIONPICKER_ELEMENT')) define('GH_DIM_LOCATIONPICKER_ELEMENT', 'gh-datainmap-locationpicker');

include GH_DIM_DIR . '/includes/post-type.php';
include GH_DIM_DIR . '/includes/taxonomy.php';
include GH_DIM_DIR . '/includes/tax-meta-image.php';
include GH_DIM_DIR . '/includes/metaboxes.php';
include GH_DIM_DIR . '/includes/settings.php';
include GH_DIM_DIR . '/includes/shortcode.php';
include GH_DIM_DIR . '/includes/ajax.php';
include GH_DIM_DIR . '/includes/menus.php';

add_filter('upload_mimes', function($mime_types) {
    if(!isset($mime_types['kml'])) {
        $mime_types['kml'] = 'text/xml';
    }
    if(!isset($mime_types['geojson'])) {
        $mime_types['geojson'] = 'text/plain';
    }
    return $mime_types;
}, 1, 1);

add_action('wp_enqueue_scripts', 'gh_dim_register_scripts');
add_action('admin_enqueue_scripts', 'gh_dim_register_scripts');
function gh_dim_register_scripts() {
    wp_register_script( 'gh-dim-vendors', plugin_dir_url(GH_DIM_FILE) . 'dist/vendors.js', array(), GH_DIM_VERSION, true );
    wp_register_script( 'gh-dim-datainmap', plugin_dir_url(GH_DIM_FILE) . 'dist/datainmap.js', array('gh-dim-vendors'), GH_DIM_VERSION, true );
    wp_register_script( 'gh-dim-locationpicker', plugin_dir_url(GH_DIM_FILE) . 'dist/admin-locationpicker.js' , array('gh-dim-vendors'), GH_DIM_VERSION, true );
    wp_register_script( 'gh-dim-location', plugin_dir_url(GH_DIM_FILE) . 'dist/admin-location.js' , array('gh-dim-vendors', 'gh-dim-colorpicker-vendor'), GH_DIM_VERSION, true );
    wp_register_style( 'gh-dim-style', plugin_dir_url(GH_DIM_FILE) . 'dist/style.css', array(), GH_DIM_VERSION);
    // Vendor
    wp_register_script( 'gh-dim-colorpicker-vendor', plugin_dir_url(GH_DIM_FILE) . 'vendor/wp-color-picker-alpha/dist/wp-color-picker-alpha.min.js', array( 'wp-color-picker' ), GH_DIM_VERSION, true );
}

add_action('admin_enqueue_scripts', function($hook) {
    global $current_screen;
    if($current_screen->base == 'datainmap_page_gh_dim_settings') {
        wp_enqueue_script( 'gh-dim-colorpicker-vendor' );
    }

    if(!in_array($hook, array('post.php', 'post-new.php'))) {
        return;
    }
    if($current_screen->post_type == 'gh-dim-layers') {
        wp_enqueue_script( 'gh-dim-admin', plugin_dir_url(GH_DIM_FILE) . 'dist/admin-layers.js', array('jquery'), GH_DIM_VERSION, true);
    }
    elseif($current_screen->post_type == 'gh-dim-locations') {
        wp_enqueue_script( 'gh-dim-location' );
        $settings = get_option('gh-datainmap-settings');
        $settings['element'] = GH_DIM_LOCATIONPICKER_ELEMENT;
        $settings['minZoom'] = (int)$settings['minZoom'];
        $settings['maxZoom'] = (int)$settings['maxZoom'];
        $pro4j = gh_dim_parse_pro4j($settings['projections']);
        unset($settings['projections']);
        $security = wp_create_nonce('gh-dim-datainmap');
        wp_enqueue_script( 'gh-dim-locationpicker' );
        wp_localize_script( 'gh-dim-locationpicker', 'GHDataInMap', [
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'security' => $security,
            'settings' => $settings,
            'pro4j' => $pro4j,
        ] );
        wp_enqueue_style( 'gh-dim-style' );
    }
});


/**
 * Parse CSV met pro4j definities
 *
 * @param string $csv
 * @return array
 */
function gh_dim_parse_pro4j($csv) {
    $pro4j = [];
    $rows = str_getcsv($csv, "\n");
    foreach($rows as $row) {
        $projection = str_getcsv($row, ',');
        if(count($projection) == 2) {
            $pro4j[] = $projection;
        }
    }
    return $pro4j;
}