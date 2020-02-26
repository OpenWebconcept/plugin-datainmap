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

add_action('init', 'gh_dim_register_taxonomy', 10);
function gh_dim_register_taxonomy() {
    $labels = array(
        'name' 				=> __( 'Location Types', 'gh-datainmap' ),
        'singular_name' 	=> __( 'Location Type', 'gh-datainmap' ),
        'search_items' 		=> __( 'Search Location Types', 'gh-datainmap' ),
        'all_items' 		=> __( 'All Location Types', 'gh-datainmap' ),
        'parent_item' 		=> __( 'Parent Location Type', 'gh-datainmap' ),
        'parent_item_colon' => __( 'Parent Location Type:', 'gh-datainmap' ),
        'edit_item' 		=> __( 'Edit Location Type', 'gh-datainmap' ),
        'update_item' 		=> __( 'Update Location Type', 'gh-datainmap' ),
        'add_new_item' 		=> __( 'Add New Location Type', 'gh-datainmap' ),
        'new_item_name' 	=> __( 'New Location Type Name', 'gh-datainmap' ),
        'menu_name' 		=> __( 'Location Types', 'gh-datainmap' ),
    );

    register_taxonomy( 'gh-dim-location-types', 'gh-dim-locations', array(
        'hierarchical' 		=> true,
        'labels' 			=> $labels,
        'show_ui' 			=> true,
        'show_admin_column' => true,
        'public'            => false,
    ));

    $labels = array(
        'name' 				=> __( 'Location Properties', 'gh-datainmap' ),
        'singular_name' 	=> __( 'Location Property', 'gh-datainmap' ),
        'search_items' 		=> __( 'Search Location Properties', 'gh-datainmap' ),
        'all_items' 		=> __( 'All Location Properties', 'gh-datainmap' ),
        'parent_item' 		=> __( 'Parent Location Property', 'gh-datainmap' ),
        'parent_item_colon' => __( 'Parent Location Property:', 'gh-datainmap' ),
        'edit_item' 		=> __( 'Edit Location Property', 'gh-datainmap' ),
        'update_item' 		=> __( 'Update Location Property', 'gh-datainmap' ),
        'add_new_item' 		=> __( 'Add New Location Property', 'gh-datainmap' ),
        'new_item_name' 	=> __( 'New Location Property Name', 'gh-datainmap' ),
        'menu_name' 		=> __( 'Location Property', 'gh-datainmap' ),
    );

    register_taxonomy( 'gh-dim-location-properties', 'gh-dim-locations', array(
        'hierarchical' 		=> false,
        'labels' 			=> $labels,
        'show_ui' 			=> true,
        'show_admin_column' => true,
        'public'            => false,
    ));
}

add_action('gh-dim-location-types_edit_form_fields', function($term) {
    $cluster = get_term_meta($term->term_id, 'cluster', true);
    $cluster_distance = get_term_meta($term->term_id, 'cluster_distance', true);
?>
    <tr class="form-field">
        <th scope="row" valign="top">
            <label for="cluster"><?php _e('Cluster', 'gh-datainmap'); ?></label>
        </th>
        <td>
            <input type="hidden" name="cluster" value="0" />
            <input type="checkbox" name="cluster" id="cluster" value="1" <?php echo $cluster == 1 ? 'checked' : '' ?> />
            <p class="description"><?php _e( 'Display locations as a cluster', 'gh-datainmap' ) ?></p>
        </td>
    </tr>
    <tr class="form-field">
        <th scope="row" valign="top">
            <label for="cluster_distance"><?php _e('Cluster distance', 'gh-datainmap'); ?></label>
        </th>
        <td>
            <input type="number" name="cluster_distance" id="cluster_distance" value="<?php echo esc_attr($cluster_distance) ?>" min="1" max="250" />
            <p class="description"><?php _e( 'Minimum distance in pixels between clusters.', 'gh-datainmap' ) ?></p>
        </td>
    </tr>
<?php
}, 10, 2);

add_action('edited_gh-dim-location-types', 'gh_dim_taxonomy_dim_location_types_save', 10, 2);
add_action('created_gh-dim-location-types', 'gh_dim_taxonomy_dim_location_types_save', 10, 2);
function gh_dim_taxonomy_dim_location_types_save($term_id) {
    $keys = ['cluster', 'cluster_distance'];
    foreach($keys as $key) {
        if(isset($_POST[$key])) {
            update_term_meta( $term_id, $key, $_POST[$key] );
        }
    }
}