<?php

// Location metabox
add_action( 'add_meta_boxes', 'gh_dim_add_metabox_location', 10 );
function gh_dim_add_metabox_location() {
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
    $gh_dim_location = get_post_meta( $post->ID, '_gh_dim_location', true );
    $gh_dim_location_type = get_post_meta( $post->ID, '_gh_dim_location_type', true );
    include GH_DIM_DIR . '/views/metabox-location.php';
}

add_action( 'save_post', 'gh_dim_metabox_location_save_postdata' );
function gh_dim_metabox_location_save_postdata($post_id) {
    $keys = array(
        '_gh_dim_location',
        '_gh_dim_location_type',
    );
    foreach($keys as $key) {
        if(array_key_exists($key, $_POST)) {
            update_post_meta($post_id, $key, $_POST[$key]);
        }
    }
}

// Layer metabox
add_action( 'add_meta_boxes', 'gh_dim_add_metabox_layer', 10 );
function gh_dim_add_metabox_layer() {
    add_meta_box(
        'gh-dim-layer',
        __('Layer info', 'gh-datainmap'),
        'gh_dim_metabox_layer',
        'gh-dim-layers',
        'normal',
        'default'
    );
}

function gh_dim_metabox_layer($post) {
    $gh_dim_layer_type = get_post_meta( $post->ID, '_gh_dim_layer_type', true );
    $gh_dim_layer_url = get_post_meta( $post->ID, '_gh_dim_layer_url', true );
    $gh_dim_layer_name = get_post_meta( $post->ID, '_gh_dim_layer_name', true );
    $gh_dim_layer_opacity = get_post_meta( $post->ID, '_gh_dim_layer_opacity', true );
    $gh_dim_layer_maxtrixset = get_post_meta( $post->ID, '_gh_dim_layer_maxtrixset', true );
    $gh_dim_kml_ignore_style = get_post_meta( $post->ID, '_gh_dim_kml_ignore_style', true );
    $gh_dim_layer_server_type = get_post_meta( $post->ID, '_gh_dim_layer_server_type', true );
    $gh_dim_layer_cross_origin = get_post_meta( $post->ID, '_gh_dim_layer_cross_origin', true );
    include GH_DIM_DIR . '/views/metabox-layer.php';
}

add_action( 'save_post', 'gh_dim_metabox_layer_save_postdata' );
function gh_dim_metabox_layer_save_postdata($post_id) {
    $keys = array(
        '_gh_dim_layer_type',
        '_gh_dim_layer_url',
        '_gh_dim_layer_name',
        '_gh_dim_layer_maxtrixset',
        '_gh_dim_kml_ignore_style',
        '_gh_dim_layer_server_type',
        '_gh_dim_layer_cross_origin',
    );
    foreach($keys as $key) {
        if(array_key_exists($key, $_POST)) {
            update_post_meta($post_id, $key, $_POST[$key]);
        }
    }
    if(array_key_exists('_gh_dim_layer_opacity', $_POST)) {
        update_post_meta($post_id, '_gh_dim_layer_opacity', sprintf('%.2f', abs($_POST['_gh_dim_layer_opacity'])));
    }
}
