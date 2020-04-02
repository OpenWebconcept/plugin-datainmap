<table class="form-table">
    <tbody>
        <tr>
            <th scope="row" valign="top">
                <label for="_gh_dim_location_content_type"><?php _e( 'Content Type', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <select id="gh_dim_location_content_type" name="_gh_dim_location_content_type">
                    <option value="post" <?php echo selected('post', $gh_dim_location_content_type) ?>><?php _e( 'Post', 'gh-datainmap' ); ?></option>
                    <option value="redirect" <?php echo selected('redirect', $gh_dim_location_content_type) ?>><?php _e( 'Redirect', 'gh-datainmap' ); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="_gh_dim_location_redirect_url"><?php _e( 'Redirect URL', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <input type="url" name="_gh_dim_location_redirect_url" id="gh_dim_location_redirect_url" value="<?php echo esc_attr( $gh_dim_location_redirect_url ) ?>" />
                <p class="description"><?php _e( 'The URL to redirect the user to after clicking on this location.', 'gh-datainmap' ) ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="_gh_dim_location_alternative_title"><?php _e( 'Alternative title', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <input type="hidden" name="_gh_dim_location_alternative_title" value="0" />
                <input type="checkbox" name="_gh_dim_location_alternative_title" id="_gh_dim_location_alternative_title" value="1" <?php checked(1, $gh_dim_location_alternative_title, true) ?> />
                <?php _e('Yes, use title from post', 'gh-datainmap') ?>
            </td>
        </tr>
        <tr>
            <th></th>
            <td>
                <input type="text" name="_gh_dim_location_alternative_title_text" id="_gh_dim_location_alternative_title_text" value="<?php echo esc_attr( $gh_dim_location_alternative_title_text ) ?>" />
                <p class="description"><?php _e( 'If the alternative title is enabled the modal title will default to the post title. If you want to change it you can override it here.', 'gh-datainmap' ) ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_location"><?php _e( 'Type', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <select id="gh_dim_location_type" name="_gh_dim_location_type">
                    <option value="point" <?php echo selected('point', $gh_dim_location_type) ?>><?php _e( 'Point', 'gh-datainmap' ); ?></option>
                    <option value="linestring" <?php echo selected('linestring', $gh_dim_location_type) ?>><?php _e( 'LineString', 'gh-datainmap' ); ?></option>
                    <option value="polygon" <?php echo selected('polygon', $gh_dim_location_type) ?>><?php _e( 'Polygon', 'gh-datainmap' ); ?></option>
                    <option value="circle" <?php echo selected('circle', $gh_dim_location_type) ?>><?php _e( 'Circle', 'gh-datainmap' ); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_location"><?php _e( 'Coordinate', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <input type="hidden" name="_gh_dim_location" id="gh_dim_location" value="<?php echo esc_attr( $gh_dim_location ) ?>" />
                <div id="<?php echo GH_DIM_LOCATIONPICKER_ELEMENT ?>" class="gh-dim-locationpicker"><?php _e('Loading...', 'gh-datainmap') ?></div>
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_location_style_line_color"><?php _e( 'Line color', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <input type="text" class="color-picker" data-alpha="true" name="_gh_dim_location_style_line_color" id="gh_dim_location_style_line_color" value="<?php echo esc_attr( $gh_dim_location_style_line_color ) ?>" />
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_location_style_line_width"><?php _e( 'Line width', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <input type="number" name="_gh_dim_location_style_line_width" id="gh_dim_location_style_line_width" value="<?php echo esc_attr( $gh_dim_location_style_line_width ) ?>" />
            </td>
        </tr>
        <tr>
            <th scope="row" valign="top">
                <label for="gh_dim_location_style_fill_color"><?php _e( 'Fill color', 'gh-datainmap' ) ?></label>
            </th>
            <td>
                <input type="text" class="color-picker" data-alpha="true" name="_gh_dim_location_style_fill_color" id="gh_dim_location_style_fill_color" value="<?php echo esc_attr( $gh_dim_location_style_fill_color ) ?>" />
            </td>
        </tr>
    </tbody>
</table>