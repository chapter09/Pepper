(function(pepper, Rank) {
 
 Rank.Model = Backbone.Model.extend({
    initialize: function() {
    }
  });

  // Define a friend list
  Rank.List = Backbone.Collection.extend({
    model: Rank.Model
  });
  
  
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
})(pepper, pepper.module("rank"));