define( function( require ) {
	"use strict";

	var Marionette = require( 'marionette' );
	var TileView = require( 'views/sidebar-tile' );

	var TilesView = Marionette.CollectionView.extend({
		className: 'tile-sidebar',
		itemView: TileView,
		itemViewOptions: function() {
			return {
				game: this.game
			}
		},
		initialize: function( options ) {
			this.game = options.game;
		}
	});

	return TilesView;
});