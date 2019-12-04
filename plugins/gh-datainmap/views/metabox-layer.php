<table class="form-table">
    <tbody>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_layer_type">Type</label>
            </th>
            <td>
                <select id="gh_dim_layer_type" name="gh_dim_layer_type">
                    <option value="WMTS-auto" <?php selected('WMTS-auto', $gh_dim_layer_type) ?>><?php _e( 'WMTS (+GetCapabilities)', 'gh-datainmap' ); ?></option>
                    <option value="KML" <?php selected('KML', $gh_dim_layer_type) ?>><?php _e( 'KML', 'gh-datainmap' ); ?></option>
                    <option value="OSM" <?php selected('OSM', $gh_dim_layer_type) ?>><?php _e( 'OpenStreetMap', 'gh-datainmap' ); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_layer_url"><?php _e( 'URL', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <input type="url" name="gh_dim_layer_url" id="gh_dim_layer_url" value="<?php echo esc_attr( $gh_dim_layer_url ) ?>"  class="regular-text" />
                <p class="description"><?php _e( 'URL to the dataset.', 'gh-datainmap' ) ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_layer_name"><?php _e('Layer name', 'gh-datainmap') ?></label>
            </th>
            <td>
                <input type="text" name="gh_dim_layer_name" id="gh_dim_layer_name" value="<?php echo esc_attr( $gh_dim_layer_name ) ?>" />
                <p class="description"><?php _e( 'The name of the layer to display.', 'gh-datainmap' ) ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_layer_maxtrixset"><?php _e('Matrixset', 'gh-datainmap') ?></label>
            </th>
            <td>
                <input type="text" name="gh_dim_layer_maxtrixset" id="gh_dim_layer_maxtrixset" value="<?php echo esc_attr( $gh_dim_layer_maxtrixset ) ?>" class="regular-text" />
                <p class="description"><?php _e('E.g. EPSG:3857', 'gh-datainmap' ) ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_kml_ignore_style"><?php _e('KML Style', 'gh-datainmap') ?></label>
            </th>
            <td>
                <input type="hidden" name="gh_dim_kml_ignore_style" value="0" />
                <input type="checkbox" name="gh_dim_kml_ignore_style" id="gh_dim_kml_ignore_style" value="1" <?php checked(1, $gh_dim_kml_ignore_style, true) ?> />
                <?php _e('Yes, ignore provided KML styles', 'gh-datainmap') ?>
                <p class="description"><?php _e( 'The name of the layer to display.', 'gh-datainmap' ) ?></p>
            </td>
        </tr>
    </tbody>
</table>