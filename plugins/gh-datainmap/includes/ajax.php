<?php
/*
* Copyright 2020-2022 Gemeente Heerenveen
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

add_action( 'wp_ajax_gh_dim_get_location_layer_features', 'gh_dim_get_location_layer_features' );
add_action( 'wp_ajax_nopriv_gh_dim_get_location_layer_features', 'gh_dim_get_location_layer_features' );

function gh_dim_get_location_layer_features() {
    check_ajax_referer( 'gh-dim-datainmap', 'security' );
    $json = [];
    if(isset($_REQUEST['term_id'])) {
        $term = get_term( $_REQUEST['term_id'], 'gh-dim-location-types' );
        if(is_wp_error($term) || $term === null) {
            return wp_send_json_error( $json, 404 );
        }
        $json = gh_dim_get_location_layer( $term )['features'];
        wp_send_json_success( $json );
    }
    wp_send_json_error( $json, 400);
}