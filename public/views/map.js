define( function( require ) {
	"use strict";

	var _ = require( 'underscore' );
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
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
			this.scrollMap = _.debounce( _.bind( this.scrollMap, this ), 1 );
			$( window ).resize( this.scrollMap );
		},
		onRender: function() {
			this.scrollMap();
		},
		scrollMap: function() {
			this.ui.platter.css({
				top: -64 * this.model.get( 'y' ) + this.$el.height() / 2,
				left: -64 * this.model.get( 'x' ) + this.$el.width() / 2
			});
		}
	});

	return MapView;
} );