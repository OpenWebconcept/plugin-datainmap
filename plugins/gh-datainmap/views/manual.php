<style>
    ul {
        list-style:inside;
    }
</style>
<div class="wrap">
    <h1><?php _e('Manual', 'gh-datainmap') ?></h1>
    <?php $current_section = $_GET['section'] ?? 'description'; ?>
    <h2 class="nav-tab-wrapper">
        <a href="?page=gh_dim_manual&section=description" class="nav-tab <?php echo $selected_tab('description', $current_section) ?>"><?php _e('Description', 'gh-datainmap') ?></a>
        <a href="?page=gh_dim_manual&section=configuration" class="nav-tab <?php echo $selected_tab('configuration', $current_section) ?>"><?php _e('Configuration', 'gh-datainmap') ?></a>
        <a href="?page=gh_dim_manual&section=shortcode" class="nav-tab <?php echo $selected_tab('shortcode', $current_section) ?>"><?php _e('Shortcode', 'gh-datainmap') ?></a>
        <a href="?page=gh_dim_manual&section=changelog" class="nav-tab <?php echo $selected_tab('changelog', $current_section) ?>"><?php _e('Changelog', 'gh-datainmap') ?></a>
    </h2>

    <?php
        switch($current_section) {
            default:
            case 'description':
                echo $markdownFromFile( GH_DIM_DIR . '/DESCRIPTION.md' );
                break;
            case 'configuration':
                echo $markdownFromFile( GH_DIM_DIR . '/CONFIGURATION.md' );
                break;
            case 'shortcode':
                echo $markdownFromFile( GH_DIM_DIR . '/SHORTCODE.md' );
                break;
            case 'changelog':
                echo $markdownFromFile( GH_DIM_DIR . '/CHANGELOG.md' );
                break;
        }
    ?>
</div>