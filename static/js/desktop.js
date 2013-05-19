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
  
  app: {
    current_user: null,
    widgets: [],
    
    render_widgets: function(){
      for (var i=0; i < this.widgets.length; i++) {
        this.widgets[i].render();
      };
    }
  }
};



$(document).ready(function(){
  
  var pagesRouter = new (pepper.module("pages").Router)();
  var paperRouter = new (pepper.module('paper').Router)();
  var recipeRouter = new (pepper.module('recipe').Router)();
  var userRouter = new (pepper.module('user').Router)();
  
  Backbone.history.start();
  
});