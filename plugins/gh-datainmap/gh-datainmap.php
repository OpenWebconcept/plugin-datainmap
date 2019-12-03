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
if ( ! defined('GH_DIM_DEBUG')) define('GH_DIM_DEBUG', true);

include GH_DIM_DIR . '/includes/post-type.php';
include GH_DIM_DIR . '/includes/taxonomy.php';
include GH_DIM_DIR . '/includes/tax-meta-image.php';
include GH_DIM_DIR . '/includes/metaboxes.php';
include GH_DIM_DIR . '/includes/settings.php';
include GH_DIM_DIR . '/includes/shortcode.php';
include GH_DIM_DIR . '/includes/ajax.php';