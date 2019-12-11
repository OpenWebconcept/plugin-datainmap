<table class="form-table">
    <tbody>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_location_type">Type</label>
            </th>
            <td>
                <select id="gh_dim_location_type" name="gh_dim_location_type">
                    <option value="point" <?php selected('point', $gh_dim_layer_type) ?>><?php _e( 'Point (x,y)', 'gh-datainmap' ); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_location"><?php _e( 'Coordinate(s)', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <input type="text" name="gh_dim_location" id="gh_dim_location" value="<?php echo esc_attr( $gh_dim_location ) ?>" />
                <p class="description"><?php _e( 'A string of coordinates, comma seperated, at least one coordinate set is required.', 'gh-datainmap' ) ?></p>
            </td>
        </tr>
    </tbody>
</table>