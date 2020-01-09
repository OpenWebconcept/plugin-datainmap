<?php
/*
Plugin Name: Data In Map
Plugin URI: https://www.heerenveen.nl/
Description: Data In Map is een plugin voor het weergeven van kaarten.
Version: 1.00
Author: Gemeente Heerenveen
Author URI: https://www.heerenveen.nl/
Text Domain: gh-datainmap
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
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

add_action('admin_enqueue_scripts', function($hook) {
    global $current_screen;
    if(!in_array($hook, array('post.php', 'post-new.php'))) {
        return;
    }
    if($current_screen->post_type == 'gh-dim-layers') {
        wp_enqueue_script( 'gh-dim-admin', plugin_dir_url(GH_DIM_FILE) . 'dist/admin-layers.js', array('jquery'), null, true);
    }
    if($current_screen->post_type == 'gh-dim-locations') {
        $settings = get_option('gh-datainmap-settings');
        $settings['element'] = GH_DIM_LOCATIONPICKER_ELEMENT;
        $settings['minZoom'] = (int)$settings['minZoom'];
        $settings['maxZoom'] = (int)$settings['maxZoom'];
        $pro4j = gh_dim_parse_pro4j($settings['projections']);
        unset($settings['projections']);
        $security = wp_create_nonce('gh-datainmap');
        wp_register_script( 'gh-dim-locationpicker', plugin_dir_url(GH_DIM_FILE) . 'dist/admin-locationpicker.js' , array('gh-dim-vendors'), null, true );
        wp_enqueue_script( 'gh-dim-locationpicker' );
        wp_localize_script( 'gh-dim-locationpicker', 'GHDataInMap', [
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'security' => $security,
            'settings' => $settings,
            'pro4j' => $pro4j,
        ] );
        wp_enqueue_style( 'gh-datainmap-style', plugin_dir_url(GH_DIM_FILE) . 'dist/style.css');
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