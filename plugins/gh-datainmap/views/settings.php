<div class="wrap">
<h1><?php _e('Settings', 'gh-datainmap') ?></h1>
<form method="post" action="options.php">
    <?php
        settings_fields('gh-datainmap-settings-group');
        $settings = get_option('gh-datainmap-settings');
    ?>

    <table class="form-table" role="presentation">
        <tbody>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[include_default_style]"><?php _e('Default style', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="hidden" name="gh-datainmap-settings[include_default_style]" value="0" />
                    <input type="checkbox" name="gh-datainmap-settings[include_default_style]" id="gh-datainmap-settings[include_default_style]" value="1" <?php checked(1, $settings['include_default_style'], true) ?> />
                    <?php _e('Yes, include default stylesheet', 'gh-datainmap') ?>
                    <p class="description"><?php _e( 'This will include the default styling. Disable to use your own styling.', 'gh-datainmap' ) ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_radius]"><?php _e('Landmark style: radius', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="number" name="gh-datainmap-settings[style_circle_radius]" id="gh-datainmap-settings[style_circle_radius]" value="<?php echo esc_attr( $settings['style_circle_radius'] ) ?>" class="small-text" min="1" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_text_font]"><?php _e('Landmark style: text font', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_circle_text_font]" id="gh-datainmap-settings[style_circle_text_font]" value="<?php echo esc_attr( $settings['style_circle_text_font'] ) ?>" class="regular-text" />
                    <p class="description"><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/font" target="_blank"><?php _e( 'CSS Font property', 'gh-datainmap' ) ?></a></p>
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_text_scale]"><?php _e('Landmark style: text scale', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_circle_text_scale]" id="gh-datainmap-settings[style_circle_text_scale]" value="<?php echo esc_attr( $settings['style_circle_text_scale'] ) ?>" class="small-text" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_text_baseline]"><?php _e('Landmark style: text baseline', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <select name="gh-datainmap-settings[style_circle_text_baseline]" id="gh-datainmap-settings[style_circle_text_baseline]">
                        <option <?php selected( $settings['style_circle_text_baseline'], 'middle', true) ?>>middle</option>
                        <option <?php selected( $settings['style_circle_text_baseline'], 'top', true) ?>>top</option>
                        <option <?php selected( $settings['style_circle_text_baseline'], 'bottom', true) ?>>bottom</option>
                        <option <?php selected( $settings['style_circle_text_baseline'], 'alphabetic', true) ?>>alphabetic</option>
                        <option <?php selected( $settings['style_circle_text_baseline'], 'hanging', true) ?>>hanging</option>
                        <option <?php selected( $settings['style_circle_text_baseline'], 'ideographic', true) ?>>ideographic</option>
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_stroke_color]"><?php _e('Landmark style: stroke color', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_circle_stroke_color]" id="gh-datainmap-settings[style_circle_stroke_color]" value="<?php echo esc_attr( $settings['style_circle_stroke_color'] ) ?>" class="color-picker" data-alpha="true" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_fill_color]"><?php _e('Landmark style: fill color', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_circle_fill_color]" id="gh-datainmap-settings[style_circle_fill_color]" value="<?php echo esc_attr( $settings['style_circle_fill_color'] ) ?>" class="color-picker" data-alpha="true" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_text_color]"><?php _e('Landmark style: text color', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_text_color]" id="gh-datainmap-settings[style_text_color]" value="<?php echo esc_attr( $settings['style_text_color'] ) ?>" class="color-picker" data-alpha="true" />
                </td>
            </tr>
            <!-- Cluster -->
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_stroke_color_cluster]"><?php _e('Cluster landmark style: stroke color', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_circle_stroke_color_cluster]" id="gh-datainmap-settings[style_circle_stroke_color_cluster]" value="<?php echo esc_attr( $settings['style_circle_stroke_color_cluster'] ) ?>" class="color-picker" data-alpha="true" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_fill_color_cluster]"><?php _e('Cluster landmark style: fill color', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_circle_fill_color_cluster]" id="style_circle_fill_color_cluster" value="<?php echo esc_attr( $settings['style_circle_fill_color_cluster'] ) ?>" class="color-picker" data-alpha="true" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_text_color_cluster]"><?php _e('Cluster landmark style: text color', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_text_color_cluster]" id="gh-datainmap-settings[style_text_color_cluster]" value="<?php echo esc_attr( $settings['style_text_color_cluster'] ) ?>" class="color-picker" data-alpha="true" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <?php _e('Map center to', 'gh-datainmap') ?>
                </th>
                <td>
                    <fieldset>
                        <label for="gh-datainmap-settings[center_x]">X</label>
                        <input type="text" name="gh-datainmap-settings[center_x]" id="gh-datainmap-settings[center_x]" value="<?php echo esc_attr( $settings['center_x'] ) ?>" class="regular-text" />
                        <label for="gh-datainmap-settings[center_y]">Y</label>
                        <input type="text" name="gh-datainmap-settings[center_y]" id="gh-datainmap-settings[center_y]" value="<?php echo esc_attr( $settings['center_y'] ) ?>" class="regular-text" />
                    </fieldset>
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[zoom]"><?php _e('Initial zoom', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="number" name="gh-datainmap-settings[zoom]" id="gh-datainmap-settings[zoom]" value="<?php echo esc_attr( $settings['zoom'] ) ?>" class="small-text" min="1" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[minZoom]"><?php _e('Min zoom', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="number" name="gh-datainmap-settings[minZoom]" id="gh-datainmap-settings[minZoom]" value="<?php echo esc_attr( $settings['minZoom'] ) ?>" class="small-text" min="1" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[maxZoom]"><?php _e('Max zoom', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="number" name="gh-datainmap-settings[maxZoom]" id="gh-datainmap-settings[maxZoom]" value="<?php echo esc_attr( $settings['maxZoom'] ) ?>" class="small-text" min="1" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[projection]"><?php _e('Map projection', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[projection]" id="gh-datainmap-settings[projection]" value="<?php echo esc_attr( $settings['projection'] ) ?>" class="regular-text" />
                    <p class="description"><?php _e('The projection to use for the map. Defaults to EPSG:3857.') ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[search_coord_system]"><?php _e('Search coordinate system', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <select name="gh-datainmap-settings[search_coord_system]" id="gh-datainmap-settings[search_coord_system]">
                        <option value="rd" <?php selected( $settings['search_coord_system'], 'rd', true) ?>>RD</option>
                        <option value="ll" <?php selected( $settings['search_coord_system'], 'll', true) ?>>Lon/Lat</option>
                    </select>
                    <p class="description"><?php _e('Decide which coordinates to use from search result.', 'gh-datainmap'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[projections]"><?php _e('Additional projections (pro4j)', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <textarea class="large-text" cols="80" rows="10" id="gh-datainmap-settings[projections]" name="gh-datainmap-settings[projections]"><?php echo esc_textarea( $settings['projections'] ) ?></textarea>
                    <p class="description"><?php _e('Add extra projections for pro4j. Format using CSV (column 1 is projection identifier, column 2 is the projection for pro4j).', 'gh-datainmap'); ?> <a href="https://epsg.io/" target="_blank"><?php _e( 'Lookup projections (pro4j)', 'gh-datainmap' ) ?></a></p>
                </td>
            </tr>
        </tbody>
    </table>
    <?php submit_button(); ?>
</form>
</div>