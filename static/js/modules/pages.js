  (function(pepper, Pages) {
    
  var User = pepper.module("user");
  
  // Welcome page
  Pages.WelcomePage = Backbone.View.extend({
   el: 'body',

   render: function(){
     $(this.el).html(ich.welcomePage());
   }
  });

  // Explore page
  Pages.ExplorePage = Backbone.View.extend({
    el: 'body',

    render: function(){
      $(this.el).html(ich.explorePage());
    }
  });

  // Phone page
  Pages.PhonePage = Backbone.View.extend({
     el: 'body',

     render: function(){
       $(this.el).html(ich.phonePage());
     }
   });

  // Navigator widget
  Pages.NavigatorWidget = Backbone.View.extend({
    el: '#navigator',
    _renderd: false,
    
    render: function(){
      if (!this._renderd){
        this._renderd = true;
        $(this.el).html(ich.navigatorWidget());
      }
    }
  })

  // Shorthands 
  // The application container
  var app = pepper.app;


  Pages.Router = Backbone.Router.extend({
   initialize: function(){
      this.welcomePage = new Pages.WelcomePage();
      this.explorePage = new Pages.ExplorePage();
      this.phonePage = new  Pages.PhonePage ();
      this.navigatorWidet = new Pages.NavigatorWidget();
      this.nameplateWidget = new User.NameplateWidget();
    },

    routes: {
      "": "index",
      "explore": "explore",
      "phone": "phone"
    },

    index: function(){
      this.navigatorWidet.render();
      this.nameplateWidget.render();
      this.welcomePage.render();
    },

    explore: function(){
      this.navigatorWidet.render();
      this.nameplateWidget.render();
      this.explorePage.render();
    },

    phone: function(){
      this.navigatorWidet.render();
      this.nameplateWidget.render();
      this.phonePage.render();
    }
  });

  })(pepper, pepper.module("pages"));