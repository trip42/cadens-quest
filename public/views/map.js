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
		events: {
			mousedown: 'startDrag',
			mousemove: 'onDrag'
		},
		initialize: function() {
			this.zoom = 1;
			this.drag = null;

			this.scrollMap = _.debounce( _.bind( this.scrollMap, this ), 1 );
			$( window ).resize( this.scrollMap );
			$( window ).keypress( _.bind( this.zoomMap, this ) );
			// refetch the collection every 5 seconds
			window.setInterval( _.bind( this.collection.fetchPosition, this.collection ), 5000 );
		},
		onRender: function() {
			this.scrollMap();
		},
		startDrag: function( jEvent ) {
			jEvent.preventDefault();
			var position = this.ui.platter.position();

			this.drag = {
				pageX: jEvent.pageX,
				pageY: jEvent.pageY,
				startX: position.left,
				startY: position.top,
				valid: false
			};

			this.model.dragging = false;

			$( window ).one( 'mouseup', _.bind( this.endDrag, this ) );
		},
		onDrag: function( jEvent ) {
			if ( this.drag ) {
				var offsetX = jEvent.pageX - this.drag.pageX;
				var offsetY = jEvent.pageY - this.drag.pageY;

				if ( Math.abs( offsetX ) > 10 || Math.abs( offsetY ) > 10 ) {
					this.drag.valid = true;
					this.model.dragging = true;
					this.ui.platter.css({
						top: this.drag.startY + offsetY,
						left: this.drag.startX + offsetX
					});
				}
			}
		},
		endDrag: function( jEvent ) {
			jEvent.preventDefault();
			jEvent.stopPropagation();

			if ( this.drag && this.drag.valid ) {
				var position = this.ui.platter.position();

				this.model.set( {
					y: Math.floor( -1 * ( position.top - this.$el.height() / 2 ) / ( CONST.tileHeight - CONST.tileOffset ) ),
					x: Math.floor( -1 * ( position.left - this.$el.width() / 2 ) / ( CONST.tileWidth ) )
				}, { silent: true } );

				this.model.get( 'map' ).fetchPosition();
			}

			this.drag = null;
		},
		scrollMap: function() {
			this.ui.platter.css({
				top: -1 * ( CONST.tileHeight - CONST.tileOffset ) * this.model.get( 'y' ) + this.$el.height() / 2,
				left: -1 * CONST.tileWidth * this.model.get( 'x' ) + this.$el.width() / 2
			});
		},
		zoomMap: function( jEvent ) {
			return;

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