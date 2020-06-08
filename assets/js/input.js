(function($, undefined){

	var Field = acf.Field.extend({

		type: 'enhanced_link',

		events: {
			'click a[data-name="add"]': 	'onClickEdit',
			'click a[data-name="edit"]': 	'onClickEdit',
			'click a[data-name="remove"]':	'onClickRemove',
			'change .link-node':			'onChange',
		},

		$control: function(){
			return this.$('.acf-enhanced_link');
		},

		$node: function(){
			return this.$('.link-node');
		},

		getValue: function(){

			// vars
			var $node = this.$node();

			// return false if empty
			if( !$node.attr('href') ) {
				return false;
			}

			// return
			return {
				'title':	$node.html(),
				'url':	$node.attr('href'),
				'target':	$node.attr('target'),
				'class':	$node.data('klass')
			};
		},

		setValue: function( val ){

			// default
			val = acf.parseArgs(val, {
				'title':	'',
				'url':	'',
				'target':	'',
				'class': ''
			});

			// vars
			var $div = this.$control();
			var $node = this.$node();

			// remove class
			$div.removeClass('-value -external');

			// add class
			if( val.url ) $div.addClass('-value');
			if( val.target === '_blank' ) $div.addClass('-external');

			// update text
			this.$('.link-title').html( val.title );
			this.$('.link-url').attr('href', val.url).html( val.url );
			this.$('.link-class').data('klass', val.class);

			// update node
			$node.html(val.title);
			$node.attr('href', val.url);
			$node.attr('target', val.target);
			$node.data('klass', val.class);

			// update inputs
			this.$('.input-title').val( val.title );
			this.$('.input-target').val( val.target );
			this.$('.input-url').val( val.url ).trigger('change');
			this.$('.input-class').val( val.class );
		},

		onClickEdit: function( e, $el ){
			acf.wpEnhancedLink.open( this.$node() );
		},

		onClickRemove: function( e, $el ){
			this.setValue( false );
		},

		onChange: function( e, $el ){

			// get the changed value
			var val = this.getValue();

			// update inputs
			this.setValue(val);
		}

	});

	acf.registerFieldType( Field );


	// manager
	acf.wpEnhancedLink = new acf.Model({

		getNodeValue: function(){
			var $node = this.get('node');
			return {
				title:	acf.decode( $node.html() ),
				url:	$node.attr('href'),
				target:	$node.attr('target'),
				class:	$node.data('klass')
			};
		},

		setNodeValue: function( val ){
			var $node = this.get('node');
			$node.text( val.title );
			$node.attr('href', val.url);
			$node.attr('target', val.target);
			$node.data('klass', val.class);
			$node.trigger('change');
		},

		getInputValue: function(){
			return {
				title:	$('#wp-link-text').val(),
				url:	$('#wp-link-url').val(),
				target:	$('#wp-link-target').prop('checked') ? '_blank' : '',
				class:	$('#wp-link-class').val()
			};
		},

		setInputValue: function( val ){
			$('#wp-link-text').val( val.title );
			$('#wp-link-url').val( val.url );
			$('#wp-link-target').prop('checked', val.target === '_blank' );
			$('#wp-link-class').val( val.class );
		},

		open: function( $node ){
			// add events
			this.on('wplink-open', 'onOpen');
			this.on('wplink-close', 'onClose');

			// set node
			this.set('node', $node);

			// create textarea
			var $textarea = $('<textarea id="acf-link-textarea" style="display:none;"></textarea>');
			$('body').append( $textarea );

			// vars
			var val = this.getNodeValue();

			// open popup
			wpLink.open( 'acf-link-textarea', val.url, val.title, null );

		},

		onOpen: function(){

			// always show title (WP will hide title if empty)
			$('#wp-link-wrap').addClass('has-text-field enhanced_link');

			if ( $('#link-options .wp-link-class-field').length < 1 ) {
				$('#link-options .link-target').before('<div class="wp-link-class-field"><label><span>Class</span> <input id="wp-link-class" type="text"></label></div>');
			}

			// set inputs
			var val = this.getNodeValue();
			this.setInputValue( val );
		},

		close: function(){
			wpLink.close();
		},

		onClose: function(){
			// bail early if no node
			// needed due to WP triggering this event twice
			if( !this.has('node') ) {
				return false;
			}

			// remove events
			this.off('wplink-open');
			this.off('wplink-close');

			// set value
			var val = this.getInputValue();
			this.setNodeValue( val );

			// remove textarea
			$('#acf-link-textarea').remove();

			$('#link-options .wp-link-class-field').remove();

			$('#wp-link-wrap').removeClass('enhanced_link');

			// reset
			this.set('node', null);

		}
	});

})(jQuery);
