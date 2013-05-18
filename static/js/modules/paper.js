(function(pepper, Paper) {
 
 Paper.Model = Backbone.Model.extend({
    initialize: function() {
    }
  });

  // Define a friend list
  Paper.List = Backbone.Collection.extend({
    model: Paper.Model
  });
  
  
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
})(pepper, pepper.module("paper"));