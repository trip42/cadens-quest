define(function( require ) {
  "use strict";

  var _ = require( 'underscore' );
  
  _.each( [ 'three', 'two', 'one' ], function( num ) {
    document.write( num );
  });

});