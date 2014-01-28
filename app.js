"use strict";

var fs = require( 'fs' );
var express = require( 'express' );
var CONST = require( './constants' );

var app = express();

var map = {};

if ( fs.existsSync( 'map.json' ) ) {
	map = JSON.parse( fs.readFileSync( 'map.json', { encoding: 'utf8' } ) );
}

app.use( express.static( __dirname + '/public' ) );
app.use( express.bodyParser() );

app.get( '/map/:x/:y', function( req, res )  {
	var grow = Math.floor( CONST.mapSectionSize / 2 );
	var x = parseInt( req.params.x );
	var y = parseInt( req.params.y );
	var xMin = Math.max( 0, x - grow );
	var xMax = Math.min( CONST.mapWidth, x + grow );
	var yMin = Math.max( 0, y - grow );
	var yMax = Math.min( CONST.mapWidth, y + grow );

	var section = [];

	// grab all tiles for the target region
	for ( var cx=xMin; cx<xMax; cx++ ) {
		for ( var cy=yMin; cy<yMax; cy++ ) {
			var id = cy * CONST.mapWidth + cx;
			var tile = map[ id ] || { id: id, tiles: [] };
			tile.x = cx;
			tile.y = cy;
			section.push( tile );
		}
	}

	res.setHeader( 'content-type', 'application/json' );
	res.send( JSON.stringify( section ) );
});

app.put( '/map/:x/:y', function( req, res ) {
	var x = parseInt( req.params.x );
	var y = parseInt( req.params.y );
	var id = y * CONST.mapWidth + x;

	console.log( 'updating tile', x, y, JSON.stringify( req.body.tiles ) );

	map[ id ] = {
		id: id,
		tiles: req.body.tiles
	};

	res.setHeader( 'content-type', 'application/json' );
	res.send( JSON.stringify( map[ id ] ) );
});

// save the map state to disk
setInterval( function() {
	fs.writeFile( 'map.json', JSON.stringify( map ) );
}, 15000 );

app.listen( 3000 );
