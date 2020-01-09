<table class="form-table">
    <tbody>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_location_type">Type</label>
            </th>
            <td>
                <select id="gh_dim_location_type" name="gh_dim_location_type">
                    <option value="point" <?php echo selected('point', $gh_dim_location_type) ?>><?php _e( 'Point (x,y)', 'gh-datainmap' ); ?></option>
                    <option value="linestring" <?php echo selected('linestring', $gh_dim_location_type) ?>><?php _e( 'LineString (x,y,x,y)', 'gh-datainmap' ); ?></option>
                    <option value="polygon" <?php echo selected('polygon', $gh_dim_location_type) ?>><?php _e( 'Polygon (x,y,x,y,...)', 'gh-datainmap' ); ?></option>
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
                <div id="<?php echo GH_DIM_LOCATIONPICKER_ELEMENT ?>" class="gh-dim-locationpicker"><?php _e('Loading...', 'gh-datainmap') ?></div>
            </td>
        </tr>
    </tbody>
</table>