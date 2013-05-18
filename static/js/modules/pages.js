(function(pepper, Pages) {
 
 Pages.WelcomePage = Backbone.View.extend({
   el: 'body',
   
   render: function(){
     $(this.el).html(ich.welcomePage());
   }
 });
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
 
})(pepper, pepper.module("pages"));