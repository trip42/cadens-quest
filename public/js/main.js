require.config({
  baseUrl: '/vendor',
  paths: {
    js: '../js'
  },
  shim: {
    'marionette': {
      deps: [ 'backbone' ],
      exports: 'Marionette'
    },
    'backbone': {
      deps: [ 'underscore', 'jquery' ],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'jquery': {
      exports: '$'
    }
  },
  deps: [ 'js/app' ]
});