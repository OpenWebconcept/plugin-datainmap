<?php

add_action( 'wp_ajax_gh_dim_get_location_info', 'gh_dim_ajax_get_location_info' );
add_action( 'wp_ajax_nopriv_gh_dim_get_location_info', 'gh_dim_ajax_get_location_info' );

function gh_dim_ajax_get_location_info() {
    check_ajax_referer( 'gh-datainmap', 'security' );
    $json = [];
    if(isset($_REQUEST['location_id'])) {
        $post = get_post( $_REQUEST['location_id'] );
        if($post === false) {
            return wp_send_json_error( $json, 404 );
        }
        elseif($post->post_type != 'gh-dim-locations') {
            return wp_send_json_error( $json, 404 );
        }
        $x = get_post_meta( $post->ID, 'gh_dim_location_x', true );
        $y = get_post_meta( $post->ID, 'gh_dim_location_y', true );
        $content = $post->post_content;
        $content = apply_filters( 'the_content', $content );
        $content = do_shortcode( $content );
        $imageIds = explode(',', get_post_meta( $post->ID, 'gh_dim_images', true ));
        $imageSizes = get_intermediate_image_sizes();
        $images = [];
        foreach($imageIds as $imageId) {
            $imgset = [];
            foreach($imageSizes as $imageSize) {
                $image = wp_get_attachment_image_src( $imageId, $imageSize );
                if($image !== false) {
                    $imgset[$imageSize] = $image;
                }
            }
            if(count($imgset) > 0) {
                $images[] = $imgset;
            }
        }
        $featuredImage = null;
        if(has_post_thumbnail( $post )) {
            $featuredImageId = get_post_thumbnail_id( $post );
            $imgset = [];
            foreach($imageSizes as $imageSize) {
                $imgset[$imageSize] = wp_get_attachment_image_src( $imageId, $imageSize );
            }
            $featuredImage = $imgset;
        }
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
            'location'      => [$x, $y],
            'images'        => $images,
            'featuredImage' => $featuredImage,
            'locationType'  => $locationType,
        ];
        wp_send_json_success( $json );
    }
    else {
        wp_send_json_error( $json, 400);
    }
}