// modules register
var pepper = {
 // Create this closure to contain the cached modules
 module: function() {
    // Internal module cache.
    var modules = {};
  
    // Create a new module reference scaffold or load an
    // existing module.
    return function(name) {
      // If this module has already been created, return it.
      if (modules[name]) {
        return modules[name];
      }
 
      // Create a module and save it under this name
      return modules[name] = { Views: {} };
    };
  }(),
  
  Router: Backbone.Router.extend({
     initialize: function(){
       this.welcomePage = new (pepper.module("pages").WelcomePage)();
     },

     routes: {
       "": "index"
     },

     index: function(){
       this.welcomePage.render();
     }
   })
};



$(document).ready(function(){
  
  var app = new pepper.Router();
  Backbone.history.start();
  
});