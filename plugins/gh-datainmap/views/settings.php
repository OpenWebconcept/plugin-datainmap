<div class="wrap">
<h1><?php _e('Settings', 'gh-datainmap') ?></h1>
<form method="post" action="options.php">
    <?php
        settings_fields('gh-datainmap-settings-group');
        $settings = get_option('gh-datainmap-settings');
    ?>

    <label for=""><?php _e('', 'gh-datainmap'); ?></label>
    <table class="form-table" role="presentation">
        <tbody>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[layer_url]"><?php _e('Layer: URL', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="url" name="gh-datainmap-settings[layer_url]" id="gh-datainmap-settings[layer_url]" value="<?php echo esc_attr( $settings['layer_url'] ) ?>" class="large-text" />
                    <p class="description"><?php _e( 'Provide the url to the WMTS map with GetCapabilities.', 'gh-datainmap' ) ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[layer_name]"><?php _e('Layer: Name', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[layer_name]" id="gh-datainmap-settings[layer_name]" value="<?php echo esc_attr( $settings['layer_name'] ) ?>" class="regular-text" />
                    <p class="description"><?php _e( 'The name of the layer to display.', 'gh-datainmap' ) ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[layer_maxtrixset]"><?php _e('Layer: Matrixset', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[layer_matrixset]" id="gh-datainmap-settings[layer_matrixset]" value="<?php echo esc_attr( $settings['layer_matrixset'] ) ?>" class="regular-text" />
                    <p class="description"><?php _e('E.g. EPSG:3857', 'gh-datainmap' ) ?></p>
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
                    <label for="gh-datainmap-settings[style_circle_stroke_color]"><?php _e('Landmark style: stroke color', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_circle_stroke_color]" id="gh-datainmap-settings[style_circle_stroke_color]" value="<?php echo esc_attr( $settings['style_circle_stroke_color'] ) ?>" class="regular-text" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_fill_color_cluster]"><?php _e('Landmark style: fill color cluster', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_circle_fill_color_cluster]" id="style_circle_fill_color_cluster" value="<?php echo esc_attr( $settings['style_circle_fill_color_cluster'] ) ?>" class="regular-text" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="gh-datainmap-settings[style_circle_fill_color]"><?php _e('Landmark style: fill color', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_circle_fill_color]" id="gh-datainmap-settings[style_circle_fill_color]" value="<?php echo esc_attr( $settings['style_circle_fill_color'] ) ?>" class="regular-text" />
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top">
                    <label for="style_text_color"><?php _e('Landmark style: text color', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="text" name="gh-datainmap-settings[style_text_color]" id="gh-datainmap-settings[style_text_color]" value="<?php echo esc_attr( $settings['style_text_color'] ) ?>" class="regular-text" />
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
                    <label for="gh-datainmap-settings[maxZoom]"><?php _e('Max zoom', 'gh-datainmap') ?></label>
                </th>
                <td>
                    <input type="number" name="gh-datainmap-settings[maxZoom]" id="gh-datainmap-settings[maxZoom]" value="<?php echo esc_attr( $settings['maxZoom'] ) ?>" class="small-text" />
                </td>
            </tr>
        </tbody>
    </table>
    <?php submit_button(); ?>
</form>
</div>