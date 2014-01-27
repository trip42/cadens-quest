define( function( require ) {
	"use strict";

	var _ = require( 'underscore' );
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var CONST = require( 'js/constants' );
	var tmplMap = require( 'text!templates/map.html' );
	var TileView = require( 'views/tile' );

	var MapView = Marionette.CompositeView.extend({
		template: Handlebars.compile( tmplMap ),
		itemViewContainer: '.map-tiles',
		itemView: TileView,
		itemViewOptions: function() {
			return { game: this.model };
		},
		className: 'map-viewport',
		ui: {
			platter: '.map-platter'
		},
		modelEvents: {
			'change:x change:y': 'scrollMap'
		},
		initialize: function() {
			this.zoom = 1;
			this.scrollMap = _.debounce( _.bind( this.scrollMap, this ), 1 );
			$( window ).resize( this.scrollMap );
			$( window ).keypress( _.bind( this.zoomMap, this ) );
		},
		onRender: function() {
			this.scrollMap();
		},
		scrollMap: function() {
			this.ui.platter.css({
				top: -1 * CONST.tileSize * this.model.get( 'y' ) + this.$el.height() / 2,
				left: -1 * CONST.tileSize * this.model.get( 'x' ) + this.$el.width() / 2
			});

			this.ui.platter.one( 'transitionend', _.bind( function() {
				this.model.get( 'map' ).fetchPosition();
			}, this ) );

		},
		zoomMap: function( jEvent ) {
			if ( jEvent.keyCode === 43 ) {
				this.zoom = this.zoom * 1.5;
			} else {
				this.zoom = this.zoom / 1.5;
			}

			this.$el.css( { zoom: this.zoom } );
			this.scrollMap();
		}
	});

	return MapView;
} );