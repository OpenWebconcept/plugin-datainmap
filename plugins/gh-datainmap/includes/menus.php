<?php
/*
* Copyright 2020 Gemeente Heerenveen
*
* Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
* You may not use this work except in compliance with the Licence.
* You may obtain a copy of the Licence at:
*
* https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
*
* Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the Licence for the specific language governing permissions and limitations under the Licence.
*/

add_action('admin_menu' , 'gh_dim_menu');
function gh_dim_menu() {
    add_menu_page(
        __('DataInMap', 'gh-datainmap'),
        __('DataInMap', 'gh-datainmap'),
        'edit_gh-dim-locations',
        'gh-dim',
        'gh_dim_settings_page',
        'dashicons-location-alt',
        25
    );
    add_submenu_page(
        'gh-dim',
        __('Location Types', 'gh-datainmap'),
        __('Location Types', 'gh-datainmap'),
        'manage_gh-dim-location-types',
        'edit-tags.php?taxonomy=gh-dim-location-types&post_type=gh-dim-locations',
        null
    );
    add_submenu_page(
        'gh-dim',
        __('Location Properties', 'gh-datainmap'),
        __('Location Properties', 'gh-datainmap'),
        'manage_gh-dim-location-properties',
        'edit-tags.php?taxonomy=gh-dim-location-properties&post_type=gh-dim-locations',
        null
    );
    add_submenu_page(
        'gh-dim',
        __('Settings', 'gh-datainmap'),
        __('Settings', 'gh-datainmap'),
        'manage_options_gh-dim',
        'gh_dim_settings',
        'gh_dim_settings_page'
    );
    add_submenu_page(
        'gh-dim',
        __('Manual', 'gh-datainmap'),
        __('Manual', 'gh-datainmap'),
        'edit_gh-dim-locations',
        'gh_dim_manual',
        'gh_dim_manual_page'
    );
}

function gh_dim_set_current_menu($parent_file) {
    global $submenu_file, $current_screen, $pagenow;
        // Set submenu active when custom post type is gh-dim-locations
        if ( $current_screen->post_type == 'gh-dim-locations' ) {
            if ( $pagenow == 'edit-tags.php' ) {
                $submenu_file = 'edit-tags.php?taxonomy=' . $current_screen->taxonomy . '&post_type=' . $current_screen->post_type;
            }
            $parent_file = 'gh-dim';
        }
        return $parent_file;
}
add_filter( 'parent_file', 'gh_dim_set_current_menu' );


function gh_dim_manual_page() {
    if (!current_user_can('edit_gh-dim-locations')) {
        wp_die('Unauthorized user.');
    }
    $parsedown = new Parsedown();
    $markdownFromFile = function($file) use($parsedown) {
        return $parsedown->text( file_get_contents($file) );
    };
    $selected_tab = function($a, $b) {
        if($a === $b) {
            return 'nav-tab-active';
        }
        return null;
    };
    include GH_DIM_DIR . '/views/manual.php';
}