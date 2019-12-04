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