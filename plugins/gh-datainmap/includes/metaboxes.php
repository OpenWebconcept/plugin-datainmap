<?php

add_action( 'add_meta_boxes', 'gh_dim_add_metabox', 10 );
function gh_dim_add_metabox() {
    add_meta_box(
        'gh-dim-location',
        __('Location info', 'gh-datainmap'),
        'gh_dim_metabox_location',
        'gh-dim-locations',
        'normal',
        'default'
    );
}

function gh_dim_metabox_location($post) {
    $gh_dim_location = get_post_meta( $post->ID, 'gh_dim_location', true );
    $gh_dim_location_type = get_post_meta( $post->ID, 'gh_dim_location_type', true );
    $gh_dim_images = get_post_meta( $post->ID, 'gh_dim_images', true );
    include GH_DIM_DIR . '/views/metabox.php';
}

add_action( 'save_post', 'gh_dim_metabox_location_save_postdata' );
function gh_dim_metabox_location_save_postdata($post_id) {
    $keys = array(
        'gh_dim_location',
        'gh_dim_location_type',
        'gh_dim_images',
    );
    foreach($keys as $key) {
        if(array_key_exists($key, $_POST)) {
            update_post_meta($post_id, $key, $_POST[$key]);
        }
    }
}