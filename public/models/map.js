define( function( require ) {
	"use strict";

	var Backbone = require( 'backbone' );
	var TileModel = require( 'models/tile' );

	return Backbone.Collection.extend({
		model: TileModel,
		url: function() {
			return '/map/' + this.game.get( 'x' ) + '/' + this.game.get( 'y' );
		},
		initialize: function( options ) {
			this.game = options.game;
			this.fetchPosition = _.debounce( this.fetchPosition, 1 );
			this.listenTo( this.game, 'change:x change:y', this.fetchPosition, this );
		},
		fetchPosition: function() {
			this.fetch( { remove: false } );
		}
	});
});