define( function( require ) {
	"use strict";

	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );

	var TileView = Marionette.ItemView.extend({
		template: Handlebars.compile( '' ),
		className: 'tile',
		events: {
			contextmenu: 'selectTile',
			click: 'updateTile'
		},
		initialize: function( options ) {
			this.game = options.game;
			this.tiles = this.game.get( 'tiles' );
		},
		onRender: function() {
			this.$el.css({
				top: this.model.get( 'y' ) * 64,
				left: this.model.get( 'x' ) * 64
			});

			this.$el.html('');

			_.each( this.model.get( 'tiles' ), function( id ) {
				var $layer = $( '<div class="layer"></div>' );
				$layer.addClass( this.tiles.get( id ).get( 'name' ) );
				this.$el.append( $layer );
			}, this );
		},
		selectTile: function( jEvent ) {
			jEvent.preventDefault();

			this.game.set( {
				x: this.model.get( 'x' ),
				y: this.model.get( 'y' )
			} );
		},
		updateTile: function( jEvent ) {
			jEvent.preventDefault();

			var id = this.game.get( 'selectedTile' );
			var tiles = this.model.get( 'tiles' );

			if ( jEvent.shiftKey ) {
				tiles.pop();
			} else if ( id === 0 ) {
				tiles = [];
			} else {
				tiles.push( id );
			}

			this.model.set( { tiles: tiles } );
			console.log( 'saving', this.model.attributes );

			this.model.save();
			this.render();
		}
	});

	return TileView;
});