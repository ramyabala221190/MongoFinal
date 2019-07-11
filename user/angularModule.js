(function()
{

'use strict';

var myInterceptor = function($q) {
  return {
    request: function(config) {
      console.log('requst started...');
      window.showAJAXSpinner();
      return config;
    },

    response: function(result) {
      console.log('request completed');
       window.hideAJAXSpinner();
      return result;
    },
    responseError: function(rejection) {
      console.log('Failed with', rejection.status, 'status');
      window.hideAJAXSpinner();
      return $q.reject(rejection);
    }
  }
}

var app=angular.module("userapp",['ui.router']);

app.config(function($httpProvider) {
  $httpProvider.interceptors.push(myInterceptor);
});

})();