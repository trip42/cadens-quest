define( function( require ) {
	"use strict";

	var _ = require( 'underscore' );
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var CONST = require( 'js/constants' );
	var tmplGameLayout = require( 'text!templates/game-layout.html' );
	var TilesView = require( 'views/sidebar-tiles' );
	var MapView = require( 'views/map' );

	return Marionette.Layout.extend({
		template: Handlebars.compile( tmplGameLayout ),
		regions: {
			map: '.map-region',
			tiles: '.tiles-region',
			tilecss: '.tile-css-region'
		},
		ui: {
			tilesetImg: '.tileset-img',
			tilesetCss: '.tileset-css'
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

			this.ui.tilesetImg.one( 'load', _.bind( this.generateTiles, this ) );
			this.ui.tilesetImg.attr( 'src', CONST.tilesetImg );
		},
		generateTiles: function() {
			var height = Math.floor( this.ui.tilesetImg.height() / CONST.tileHeight );
			var id, offsetX, offsetY, css = '';

			for( var y=0; y<height; y++ ) {
				_.each( CONST.tileViews, function( x, view ) {
					offsetX = -1 * CONST.tileWidth * x;
					offsetY = -1 * CONST.tileHeight * y;
					css += '.t' + y + '_' + view + ' { background-position: ' + offsetX + 'px ' + offsetY + 'px }\n';
				}, this );

				this.model.get( 'tiles' ).add({
					id: 't' + y,
					direction: 'left'
				});
			}

			css += '.tile, .layer {\n';
			css += '  background-image: url(' + this.ui.tilesetImg.attr( 'src' ) + ');\n';
			css += '  height: ' + CONST.tileHeight + 'px;\n';
			css += '  width: ' + CONST.tileWidth + 'px;\n';
			css += '}';

			this.ui.tilesetCss.html( css );

		}
	});
	
} );