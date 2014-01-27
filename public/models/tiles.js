define( function( require ) {
	"use strict";

	var Backbone = require( 'backbone' );
	var TileModel = require( 'models/tile' );

	return Backbone.Collection.extend({
		model: TileModel
	});
})