define( function( require ) {
	"use strict";

	var _ = require( 'underscore' );
	var Backbone = require( 'backbone' );
	var TileModel = require( 'models/tile' );

	return Backbone.Collection.extend({
		model: TileModel,
		url: function() {
			return '/map/' + this.game.get( 'x' ) + '/' + this.game.get( 'y' );
		},
		initialize: function( options ) {
			this.game = options.game;
		},
		removeNonVisible: function() {
			var x = this.game.get( 'x' );
			var y = this.game.get( 'y' );
			var nonVisible = this.filter( function( tile ) {
				return ( tile.get( 'x' ) < x - 20 ||
					     tile.get( 'x' ) > x + 20 ||
					     tile.get( 'y' ) < y - 20 ||
					     tile.get( 'y' ) > y + 20 );
			}, this );

			this.remove( nonVisible );

			console.log( '# tiles', this.length );
		},
		fetchPosition: function() {
			this.fetch( {
				remove: false,
				success: _.bind( this.game.set, this.game, { mapFetched: new Date() } )
			} );
		}
	});
});