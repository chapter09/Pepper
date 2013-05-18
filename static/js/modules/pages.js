(function(pepper, Pages) {
 
 Pages.WelcomePage = Backbone.View.extend({
   el: 'body',
   
   render: function(){
     $(this.el).html(ich.welcomePage());
   }
 });
 
 Pages.ExplorePage = Backbone.View.extend({
    el: 'body',

    render: function(){
      $(this.el).html(ich.explorePage());
    }
  });
  
  Pages.PhonePage = Backbone.View.extend({
     el: 'body',

     render: function(){
       $(this.el).html(ich.phonePage());
     }
   });
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
 
 Pages.Router = Backbone.Router.extend({
   initialize: function(){
      this.welcomePage = new (Pages.WelcomePage)();
      this.explorePage = new (Pages.ExplorePage)();
      this.phonePage = new (Pages.PhonePage)();
    },

    routes: {
      "": "index",
      "explore": "explore",
      "phone": "phone"
    },

    index: function(){
      this.welcomePage.render();
    },
    
    explore: function(){
      this.explorePage.render();
    },
    
    phone: function(){
      this.phonePage.render();
    }
 });
 
})(pepper, pepper.module("pages"));