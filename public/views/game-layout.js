define( function( require ) {
	"use strict";

	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var tmplGameLayout = require( 'text!templates/game-layout.html' );
	var TilesView = require( 'views/sidebar-tiles' );
	var MapView = require( 'views/map' );

	return Marionette.Layout.extend({
		template: Handlebars.compile( tmplGameLayout ),
		regions: {
			map: '.map-region',
			tiles: '.tiles-region'
		},
		onRender: function() {
			this.map.show( new MapView( {
				model: this.model,
				collection: this.model.get( 'map' )
			} ) );

			this.tiles.show( new TilesView( {
				game: this.model,
				collection: this.model.get( 'tiles' )
			} ) );
		}
	});
	
} );