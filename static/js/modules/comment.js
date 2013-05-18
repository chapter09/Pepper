(function(pepper, Comment) {
 
 Comment.Model = Backbone.Model.extend({
    initialize: function() {
    }
  });

  // Define a friend list
  Comment.List = Backbone.Collection.extend({
    model: Comment.Model
  });
  
  
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
})(pepper, pepper.module("comment"));