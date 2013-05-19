  (function(pepper, Pages) {
    
  var User = pepper.module("user");
  var Recipe = pepper.module('recipe');
  var Paper = pepper.module('paper');
  
  // Welcome page
  Pages.WelcomePage = Backbone.View.extend({
   el: '#main-container',

   render: function(){
     $(this.el).html(ich.welcomePage());
   }
  });

  // Explore page
  Pages.ExplorePage = Backbone.View.extend({
    el: '#main-container',

    initialize: function(){
      this.recipe_all = new Recipe.List();
      this.recipe_daily = new Recipe.List();
      this.papers = new Paper.List();
    },

    render: function(){
      $(this.el).html(ich.explorePage());
      
    }
  });

  // Phone page
  Pages.PhonePage = Backbone.View.extend({
     el: '#main-container',

     render: function(){
       $(this.el).html(ich.phonePage());
     }
   });

  // Shorthands 
  // The application container
  var app = pepper.app;


  Pages.Router = Backbone.Router.extend({
   initialize: function(){
      this.welcomePage = new Pages.WelcomePage();
      this.explorePage = new Pages.ExplorePage();
      this.phonePage = new  Pages.PhonePage ();
      
      app.widgets.push(new User.NameplateWidget());
    },

    routes: {
      "": "index",
      "explore": "explore",
      "phone": "phone"
    },

    index: function(){
      app.render_widgets();
      this.welcomePage.render();
    },

    explore: function(){
      app.render_widgets();
      this.explorePage.render();
    },

    phone: function(){
      app.render_widgets();
      this.phonePage.render();
    }
  });

  })(pepper, pepper.module("pages"));