(function(pepper, Recipe) {
 
 Recipe.Model = Backbone.Model.extend({
    initialize: function() {
    }
  });

  // Define a friend list
  Recipe.List = Backbone.Collection.extend({
    model: Recipe.Model
  });
  
  
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
})(pepper, pepper.module("recipe"));