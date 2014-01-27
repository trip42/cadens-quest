define(function( require ) {
	"use strict";

	var $ = require( 'jquery' );
	var Backbone = require( 'backbone' );
	var TilesCollection = require( 'models/tiles' );
	var MapCollection = require( 'models/map' );

	return Backbone.Model.extend({
		initialize: function() {
			this.set({
				tiles: new TilesCollection(),
				map: new MapCollection({ game: this }),
				x: 512,
				y: 512,
				selectedTile: 0,
				mapFetched: new Date()
			});
		},
		fetch: function( options ) {
			$.when(
				this.get( 'map' ).fetch()
			).then( options.success, options.error );
		}
	});
});