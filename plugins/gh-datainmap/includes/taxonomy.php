<?php

add_action('init', 'gh_dim_register_taxonomy', 10);
function gh_dim_register_taxonomy() {
    $labels = array(
        'name' 				=> __( 'Type', 'gh-datainmap' ),
        'singular_name' 	=> __( 'Type', 'gh-datainmap' ),
        'search_items' 		=> __( 'Search Types', 'gh-datainmap' ),
        'all_items' 		=> __( 'All Types', 'gh-datainmap' ),
        'parent_item' 		=> __( 'Parent Type', 'gh-datainmap' ),
        'parent_item_colon' => __( 'Parent Type:', 'gh-datainmap' ),
        'edit_item' 		=> __( 'Edit Type', 'gh-datainmap' ),
        'update_item' 		=> __( 'Update Type', 'gh-datainmap' ),
        'add_new_item' 		=> __( 'Add New Type', 'gh-datainmap' ),
        'new_item_name' 	=> __( 'New Type Name', 'gh-datainmap' ),
        'menu_name' 		=> __( 'Types', 'gh-datainmap' ),
    );

    register_taxonomy( 'gh-dim-location-types', 'gh-dim-locations', array(
        'hierarchical' 		=> true,
        'labels' 			=> $labels,
        'show_ui' 			=> true,
        'show_admin_column' => true,
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