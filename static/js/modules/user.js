// src/modules/user.js
// Module reference argument, assigned at the bottom
(function(pepper, User) {
 
 // Dependencies
 var Recipe = pepper.module("recipe");
 
 
 
 
 User.Model = Backbone.Model.extend({
    initialize: function() {
    }
  });

  // Define a friend list
  User.List = Backbone.Collection.extend({
    model: User.Model
  });
  
  
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
})(pepper, pepper.module("user"));