<?php
/*
* Copyright 2020-2024 Gemeente Heerenveen
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

/**
 * Parse CSV with proj4 definitions
 *
 * @param string $csv
 * @return array
 */
function gh_dim_parse_proj4($csv) {
    $proj4 = [];
    $rows = str_getcsv($csv, "\n");
    foreach($rows as $row) {
        $projection = str_getcsv($row, ',');
        if(count($projection) == 2) {
            $proj4[] = $projection;
        }
    }
    return $proj4;
}

/**
 * Convert location content type to a number
 * 
 * @param string $content_type
 * @return int
 */
function gh_dim_content_type_enum($content_type) {
    switch($content_type) {
        default:
        case 'post':
            return GH_DIM_CONTENT_TYPE_POST;
        case 'redirect':
            return GH_DIM_CONTENT_TYPE_REDIRECT;
    }
}

/**
 * Compose location layer
 * 
 * @param WP_Term $term
 * @return array
 */
function gh_dim_get_location_layer($term) {
    $locations = get_posts([
        'post_type' => 'gh-dim-locations',
        'posts_per_page' => -1,
        'tax_query' => [
            [
                'taxonomy' => 'gh-dim-location-types',
                'field' => 'term_id',
                'terms' => $term->term_id,
            ]
        ]
    ]);
    $features = array_map(function($post) use($term) {
        $location_properties = wp_get_post_terms( $post->ID, 'gh-dim-location-properties', [
            'fields' => 'ids'
        ] );
        $location = get_post_meta( $post->ID, '_gh_dim_location', true);
        $location_type = get_post_meta( $post->ID, '_gh_dim_location_type', true);
        $content_type = get_post_meta( $post->ID, '_gh_dim_location_content_type', true);
        $useAlternativeTitle = get_post_meta( $post->ID, '_gh_dim_location_alternative_title', true ) == 1;
        $alternativeTitle = get_post_meta( $post->ID, '_gh_dim_location_alternative_title_text', true);
        if($useAlternativeTitle && strlen($alternativeTitle) > 0) {
            $title = $alternativeTitle;
        }
        $content_type_enum = gh_dim_content_type_enum( $content_type );
        $feature = [
            'location_type' => $location_type,
            'location' => json_decode($location),
            'location_properties' => $location_properties,
            'feature_id' => $post->ID,
            'title' => $post->post_title,
            'term' => $term->slug,
            'content_type' => $content_type_enum,
        ];
        if($content_type_enum == GH_DIM_CONTENT_TYPE_REDIRECT) {
            $redirect_url = get_post_meta( $post->ID, '_gh_dim_location_redirect_url', true);
            $feature['redirect'] = $redirect_url;
        }
        $line_color = get_post_meta( $post->ID, '_gh_dim_location_style_line_color', true);
        $line_width = get_post_meta( $post->ID, '_gh_dim_location_style_line_width', true);
        $fill_color = get_post_meta( $post->ID, '_gh_dim_location_style_fill_color', true);
        if($line_color || $line_width || $fill_color) {
            $feature['style'] = [
                'line_color' => $line_color,
                'line_width' => $line_width,
                'fill_color' => $fill_color,
            ];
        }
        return $feature;
    }, $locations);
    $icon = null;
    $icon_media_id = get_term_meta( $term->term_id, 'category-image-id', true );
    if($icon_media_id) {
        $icon = wp_get_attachment_image_src($icon_media_id, 'full')[0];
    }
    return [
        'name' => $term->name,
        'term_id' => $term->term_id,
        'slug' => $term->slug,
        'description' => $term->description,
        'icon' => $icon,
        'features' => $features,
        'cluster' => get_term_meta( $term->term_id, 'cluster', true ),
        'cluster_distance' => get_term_meta( $term->term_id, 'cluster_distance', true ),
    ];
}