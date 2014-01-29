define( function( require ) {
	"use strict";

	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var CONST = require( 'js/constants' );

	var TileView = Marionette.ItemView.extend({
		template: Handlebars.compile( '' ),
		className: 'tile',
		events: {
			contextmenu: 'rotateTile',
			click: 'updateTile',
			mouseenter: 'showGhost',
			mouseleave: 'hideGhost'
		},
		modelEvents: {
			change: 'render',
		},
		initialize: function( options ) {
			this.game = options.game;
			this.tiles = this.game.get( 'tiles' );
		},
		onRender: function() {
			this.$el.css({
				top: this.model.get( 'y' ) * ( CONST.tileHeight - CONST.tileOffset ),
				left: this.model.get( 'x' ) * CONST.tileWidth,
				zIndex: this.model.get( 'y' ) + 500
			});

			this.$el.html('');

			_.each( this.model.get( 'layers' ), function( id, index ) {
				var $layer = $( '<div class="layer"></div>' );
				$layer.addClass( id );
				$layer.css( { top: -1 * index * CONST.tileStackHeight } );
				this.$el.append( $layer );
			}, this );
		},
		showGhost: function() {
			console.log( 'show ghost' );
			var id = this.game.get( 'selectedTile' );
			var $ghost = $( '<div class="ghost layer"></div>' );
			$ghost.addClass( id + '_left' );
			$ghost.css( { top: -1 * this.model.get( 'layers' ).length * CONST.tileStackHeight } );
			this.$el.append( $ghost );
		},
		hideGhost: function() {
			this.$el.find( '.ghost' ).remove();
		},
		rotateTile: function( jEvent ) {
			jEvent.preventDefault();
			var layers = this.model.get( 'layers' );
			var id = layers.pop().split('_');
			var direction = id[1];
			id = id[0];

			direction = {
				'left':'up',
				'up':'right',
				'right':'down',
				'down':'left'
			}[ direction ];

			layers.push( id + '_' + direction );
			this.model.save( { layers: layers } );
			this.render();
		},
		updateTile: function( jEvent ) {
			jEvent.preventDefault();

			if ( this.game.dragging ) {
				return;
			}

			var id = this.game.get( 'selectedTile' );
			var layers = this.model.get( 'layers' );

			if ( jEvent.shiftKey ) {
				layers.pop();
			} else if ( id === 0 ) {
				layers = [];
			} else {
				layers.push( id + '_left' );
			}

			this.model.set( { layers: layers } );
			console.log( 'saving', this.model.attributes );

			this.model.save();
			this.render();
		}
	});

	return TileView;
});