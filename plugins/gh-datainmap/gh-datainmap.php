<?php
/*
Plugin Name: Data In Map
Plugin URI: https://www.heerenveen.nl/
Description: ...
Version: 1.00
Author: Gemeente Heerenveen
Author URI: https://www.heerenveen.nl/
Text Domain: gh-datainmap
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
if ( ! defined('GH_DIM_FILE')) define('GH_DIM_FILE', __FILE__);
if ( ! defined('GH_DIM_DIR')) define('GH_DIM_DIR', dirname(__FILE__));
if ( ! defined('GH_DIM_DEBUG')) define('GH_DIM_DEBUG', false);

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
});