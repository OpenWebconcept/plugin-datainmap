<?php
/*
Plugin Name: Data In Map
Plugin URI: https://github.com/OpenWebconcept/plugin-datainmap
Description: Data In Map is a plugin for displaying maps.
Version: 1.11.1
Requires at least: 5.0
Requires PHP: 7.2
Author: Gemeente Heerenveen
Author URI: https://www.heerenveen.nl/
Text Domain: gh-datainmap
License URI: https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
License: EUPL v1.2

Copyright 2020-2023 Gemeente Heerenveen

Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12

Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and limitations under the Licence.
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
if ( ! defined('GH_DIM_VERSION')) define('GH_DIM_VERSION', '1.11.1');
if ( ! defined('GH_DIM_FILE')) define('GH_DIM_FILE', __FILE__);
if ( ! defined('GH_DIM_DIR')) define('GH_DIM_DIR', dirname(__FILE__));
if ( ! defined('GH_DIM_DEBUG')) define('GH_DIM_DEBUG', false);
if ( ! defined('GH_DIM_LOCATIONPICKER_ELEMENT')) define('GH_DIM_LOCATIONPICKER_ELEMENT', 'gh-datainmap-locationpicker');

if ( ! defined('GH_DIM_CONTENT_TYPE_POST')) define('GH_DIM_CONTENT_TYPE_POST', 0);
if ( ! defined('GH_DIM_CONTENT_TYPE_REDIRECT')) define('GH_DIM_CONTENT_TYPE_REDIRECT', 1);

include GH_DIM_DIR . '/vendor/autoload.php';
include GH_DIM_DIR . '/includes/utils.php';
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

add_action('init', 'gh_dim_register_scripts');
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

    if(!in_array($hook, array('post.php', 'post-new.php', 'datainmap_page_gh_dim_settings'))) {
        return;
    }
    if($current_screen->post_type == 'gh-dim-layers') {
        wp_enqueue_script( 'gh-dim-admin', plugin_dir_url(GH_DIM_FILE) . 'dist/admin-layers.js', array('jquery'), GH_DIM_VERSION, true);
    }
    elseif($current_screen->post_type == 'gh-dim-locations' || $current_screen->base == 'datainmap_page_gh_dim_settings') {
        wp_enqueue_script( 'gh-dim-location' );
        $settings = get_option('gh-datainmap-settings');
        $settings['element'] = GH_DIM_LOCATIONPICKER_ELEMENT;
        $settings['minZoom'] = (int)$settings['minZoom'];
        $settings['maxZoom'] = (int)$settings['maxZoom'];
        $proj4 = gh_dim_parse_proj4($settings['projections']);
        unset($settings['projections']);
        $security = wp_create_nonce('gh-dim-datainmap');
        wp_enqueue_script( 'gh-dim-locationpicker' );
        wp_localize_script( 'gh-dim-locationpicker', 'GHDataInMap', [
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'security' => $security,
            'settings' => $settings,
            'proj4' => $proj4,
        ] );
        wp_enqueue_style( 'gh-dim-style' );
    }
});

add_action('plugins_loaded', function() {
    load_plugin_textdomain( 'gh-datainmap', false, basename( dirname( __FILE__ ) ) . '/languages/' );
} );

register_activation_hook(__FILE__, function() {
    $role = get_role( 'administrator' );
    $caps = [
        'assign_gh-dim-location-properties',
        'assign_gh-dim-location-types',
        'delete_gh-dim-layers',
        'delete_gh-dim-location-properties',
        'delete_gh-dim-location-types',
        'delete_gh-dim-locations',
        'delete_others_gh-dim-layers',
        'delete_others_gh-dim-locations',
        'delete_private_gh-dim-layers',
        'delete_private_gh-dim-locations',
        'delete_published_gh-dim-layers',
        'delete_published_gh-dim-locations',
        'edit_gh-dim-layers',
        'edit_gh-dim-location-properties',
        'edit_gh-dim-location-types',
        'edit_gh-dim-locations',
        'edit_others_gh-dim-layers',
        'edit_others_gh-dim-locations',
        'edit_private_gh-dim-layers',
        'edit_private_gh-dim-locations',
        'edit_published_gh-dim-layers',
        'edit_published_gh-dim-locations',
        'manage_gh-dim-location-properties',
        'manage_gh-dim-location-types',
        'manage_options_gh-dim',
        'publish_gh-dim-layers',
        'publish_gh-dim-locations',
        'read_private_gh-dim-layers',
        'read_private_gh-dim-locations',
    ];

    foreach($caps as $cap) {
        $role->add_cap( $cap );
    }
});

$myUpdateChecker = YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
    'https://github.com/OpenWebconcept/plugin-datainmap',
	__FILE__,
	'gh-datainmap'
);
$myUpdateChecker->getVcsApi()->enableReleaseAssets();