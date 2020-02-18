<?php

add_action( 'wp_ajax_gh_dim_get_location_info', 'gh_dim_ajax_get_location_info' );
add_action( 'wp_ajax_nopriv_gh_dim_get_location_info', 'gh_dim_ajax_get_location_info' );

function gh_dim_ajax_get_location_info() {
    check_ajax_referer( 'gh-dim-datainmap', 'security' );
    $json = [];
    if(isset($_REQUEST['location_id'])) {
        $post = get_post( $_REQUEST['location_id'] );
        if($post === false) {
            return wp_send_json_error( $json, 404 );
        }
        elseif($post->post_type != 'gh-dim-locations') {
            return wp_send_json_error( $json, 404 );
        }
        $content = $post->post_content;
        $content = apply_filters( 'the_content', $content );
        $locationType = [];
        $terms = get_the_terms($post, 'gh-dim-location-types');
        foreach($terms as $term) {
            $locationType[] = [
                'term_id' => $term->term_id,
                'name' => $term->name,
                'taxonomy' => $term->taxonomy,
                'description' => $term->description,
            ];
        }
        $json = [
            'id'            => $post->ID,
            'title'         => get_the_title($post),
            'content'       => $content,
            'locationType'  => $locationType,
            'useAlternativeTitle' => get_post_meta( $post->ID, '_gh_dim_location_alternative_title', true ) == 1,
            'alternativeTitle' => get_post_meta( $post->ID, '_gh_dim_location_alternative_title_text', true),
        ];
        wp_send_json_success( $json );
    }
    else {
        wp_send_json_error( $json, 400);
    }
}