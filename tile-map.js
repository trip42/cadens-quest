"use strict";

var _ = require( 'underscore' );

var tileMap = {
	byName: {
		empty: 0,
		grass: 1,
		tree: 2,
		rock: 3
	}
	, byId: {
		// dynamic below
	}
};

_.each( tileMap.byName, function( id, name ) {
	tileMap.byId[ id ] = name;
});

module.exports = tileMap;