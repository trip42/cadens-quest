define( function( require ) {
	"use strict";

	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var tmplTile = require( 'text!templates/sidebar-tile.html' );

	var TileView = Marionette.ItemView.extend({
		template: Handlebars.compile( tmplTile ),
		className: 'tile-container',
		events: {
			click: 'selectTile'
		},
		initialize: function( options ) {
			this.game = options.game;
			this.listenTo( this.game, 'change:selectedTile', this.toggleSelected, this );
		},
		selectTile: function() {
			this.game.set( {
				selectedTile: this.model.get( 'id' )
			} );
		},
		toggleSelected: function() {
			this.$el.toggleClass( 'selected', this.game.get( 'selectedTile' ) === this.model.get( 'id' ) );
		}
	});

	return TileView;
});