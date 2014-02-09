define( function( require ) {
	"use strict";

	var Backbone = require( 'backbone' );

	return Backbone.Model.extend({
		url: function() {
			return '/map/' + this.get( 'x' ) + '/' + this.get( 'y' );
		}
		, getClass: function() {
			return this.get( 'id' ) + '_' + this.get( 'direction' );
		}
	});
});