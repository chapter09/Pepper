  (function(pepper, Pages) {
    
  var User = pepper.module("user");
  
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