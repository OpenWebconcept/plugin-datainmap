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
