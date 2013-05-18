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
  
  User.NameplateWidget = Backbone.View.extend({
    el: "#Nameplate",
    
    render: function(){
      if (app.current_user){
        _data = {
          avatar_src: app.current_user.avatar_src,
          user_name: app.current_user.name
        }
        $(this.el).html(ich.nameplateWidget(_data));
      }else{
        $(this.el).html(ich.nameplateWidgetLogout());
      }
    }
  });
  
  
 
 
})(pepper, pepper.module("user"));