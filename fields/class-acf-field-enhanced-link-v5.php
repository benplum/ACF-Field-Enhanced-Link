<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

class acf_field_enhanced_link extends acf_field_link {

	function initialize() {
		$this->name = 'enhanced_link';
		$this->label = __("Enhanced Link",'acf');
		$this->category = 'relational';
		$this->defaults = array(
			'return_format'	=> 'array',
		);
	}

	// 

	function __construct( $settings ) {
		$this->settings = $settings;

    parent::__construct();
	}


	function render_field( $field ) {
		$div = array(
			'id'	=> $field['id'],
			'class'	=> $field['class'] . ' acf-link acf-enhanced_link',
		);

		acf_enqueue_uploader();

		$link = $this->get_link( $field['value'] );

		if( $link['url'] ) {
			$div['class'] .= ' -value';
		}

		if( $link['target'] === '_blank' ) {
			$div['class'] .= ' -external';
		}

		/*<textarea id="<?php echo esc_attr($field['id']); ?>-textarea"><?php
			echo esc_textarea('<a href="'.$link['url'].'" target="'.$link['target'].'">'.$link['title'].'</a>');
		?></textarea>*/
?>
<div <?php acf_esc_attr_e($div); ?>>

	<div class="acf-hidden">
		<a class="link-node" href="<?php echo esc_url($link['url']); ?>" target="<?php echo esc_attr($link['target']); ?>" data-klass="<?php echo esc_attr($link['class']); ?>"><?php echo esc_html($link['title']); ?></a>
		<?php foreach( $link as $k => $v ): ?>
			<?php acf_hidden_input(array( 'class' => "input-$k", 'name' => $field['name'] . "[$k]", 'value' => $v )); ?>
		<?php endforeach; ?>
	</div>

	<a href="#" class="button" data-name="add" target=""><?php _e('Select Link', 'acf'); ?></a>

	<div class="link-wrap">
		<span class="link-title"><?php echo esc_html($link['title']); ?></span>
		<a class="link-url" href="<?php echo esc_url($link['url']); ?>" target="_blank"><?php echo esc_html($link['url']); ?></a>
		<i class="acf-icon -link-ext acf-js-tooltip" title="<?php _e('Opens in a new window/tab', 'acf'); ?>"></i><?php
		?><a class="acf-icon -pencil -clear acf-js-tooltip" data-name="edit" href="#" title="<?php _e('Edit', 'acf'); ?>"></a><?php
		?><a class="acf-icon -cancel -clear acf-js-tooltip" data-name="remove" href="#" title="<?php _e('Remove', 'acf'); ?>"></a>
	</div>

</div>
<?php

	}


	function input_admin_enqueue_scripts() {
		// vars
		$url = $this->settings['url'];
		$version = $this->settings['version'];

		// register & include JS
		wp_register_script('acf_enhanced_link-js', "{$url}assets/js/input.js", array('acf-input'), $version);
		wp_enqueue_script('acf_enhanced_link-js');

		// register & include CSS
		wp_register_style('acf_enhanced_link-css', "{$url}assets/css/input.css", array('acf-input'), $version);
		wp_enqueue_style('acf_enhanced_link-css');
	}


	function get_link( $value = '' ) {

		// vars
		$link = array(
			'title'		=> '',
			'url'		=> '',
			'target'	=> '',
      'class' => ''
		);

		// array (ACF 5.6.0)
		if ( is_array($value) ) {

			$link = array_merge($link, $value);

		// post id (ACF < 5.6.0)
		} elseif ( is_numeric($value) ) {

			$link['title'] = get_the_title( $value );
			$link['url'] = get_permalink( $value );

		// string (ACF < 5.6.0)
		} elseif ( is_string($value) ) {

			$link['url'] = $value;

		}

		// return
		return $link;
	}


}

new acf_field_enhanced_link( $this->settings );