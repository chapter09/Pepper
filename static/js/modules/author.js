(function(pepper, Author) {
 
 Author.Model = Backbone.Model.extend({
    initialize: function() {
    }
  });

  // Define a friend list
  Author.List = Backbone.Collection.extend({
    model: Author.Model
  });
  
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
})(pepper, pepper.module("author"));