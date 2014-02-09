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
			var tileSize = CONST.tileSize;
			var width = Math.floor( this.ui.tilesetImg.width() / tileSize );
			var height = Math.floor( this.ui.tilesetImg.height() / tileSize );
			var id, offsetX, offsetY, css = '';

			for( var y=0; y<height; y++ ) {
				for ( var x=0; x<width; x++ ) {
					id = 't' + x + '_' + y;
					offsetX = -1 * tileSize * x;
					offsetY = -1 * tileSize * y;

					this.model.get( 'tiles' ).add({
						id: id,
						x: x,
						y: y,
						offsetX: offsetX,
						offsetY: offsetY
					});

					css += '.' + id + ' { background-position: ' + offsetX + 'px ' + offsetY + 'px }\n';
				}
			}

			css += '.tile, .layer {\n';
			css += '  background-image: url(' + this.ui.tilesetImg.attr( 'src' ) + ');\n';
			css += '  height: ' + tileSize + 'px;\n';
			css += '  width: ' + tileSize + 'px;\n';
			css += '}';

			this.ui.tilesetCss.html( css );

		}
	});
	
} );