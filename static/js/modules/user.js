// src/modules/user.js
// Module reference argument, assigned at the bottom
(function(pepper, User) {
 
 // Dependencies
 var Recipe = pepper.module("recipe");
 var Comment = pepper.module("comment");
 
 
 
 
  User.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: "/users",
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
    el: "#nameplate",
    
    render: function(){
      if (app.current_user){
        _data = {
          avatar_src: "/img/avatar_small.png",
          user_name: app.current_user.get('name')
        };
        $(this.el).html(ich.nameplateWidget(_data));
        
      }else{
        $(this.el).html(ich.nameplateWidgetLogout());
      }
    }
  });

/***  User View  ***/

  User.View = Backbone.View.extend({
    el: '#main-container',
    initialize: function() {
      this.recipes = new Recipe.List(this.model.get('_recipes'));
      this.recipes.total_page = this.model.get('recipes').length;
      this.recipesView = new Recipe.ListView({
        tagName: "div",
        id: "recipeList",
        collection: this.recipes
      });
      
      
      this.watches = new Recipe.List(this.model.get('_watches'));
      this.watches.total_page = this.model.get('watches').length;
      this.watchesView = new Recipe.ListView({
        tagName: "div",
        id: "watcheList",
        collection: this.watches
      });
      
    },

    render: function() {
      _data = {
        name: this.model.get('name'),
        description: this.model.get('description'),
        joined_since: this.model.get('joined_since'),
        avatar_big: "/img/avatar_big.png",
        watches_count: this.model.get('watches').length,
        recipes_count: this.model.get('recipes').length,
        comments_count: this.model.get('comments').length,
      };
      
      $(this.el).html(ich.userViewPage(_data));
      $('.recipe-list-wrapper').html(this.recipesView.render().el);
      $('.watch-list-wrapper').html(this.watchesView.render().el);
    }


  });

  /***  User PreViewPage  ***/


  User.PreViewPage = Backbone.View.extend({
    el: "#main-container",
    
    render: function(){
      $(this.el).html(ich.userPreViewPage());
    }
  });


  User.Router = Backbone.Router.extend({
   initialize: function(){
      this.pre_view_page = new User.PreViewPage();
    },
  
    routes: {
      "user/:user_id": "user",
      "dashboard": "dashboard",
      "login": "login",
      "logout": "logout"
    },

    user: function(user_id) {
      
      app.render_widgets();
      model = new User.Model({
        _id: user_id
      });
      
      
      this.pre_view_page.render();
      $('#loading-animation').show();

      model.fetch({success:function(model, success){

        user_view_page = new User.View({
          model: model
        });
        
        app.current_user = model;

        $('#loading-animation').hide();
        user_view_page.render();

      }});
    },
    
    dashboard: function(){
      // for test
      app.render_widgets();
      user = new User.Model({
        _id: "5197f2294bd5630799849a6f",
        name: "gsj987",
      });
      app.current_user = user;
      return this.user(app.current_user.get('_id'));
    },
    
    login: function(){
      un = $("#username").val();
      pw = $("#password").val();
      
      user = new User.Model({
      });
      
      
      $("#loading-animation").show();
      
      var navi = this.navigate;
      
      user.fetch({data: {name: un, password: pw}, success:function(){
        $("#loading-animation").hide();
        if(user.get("_id")){
          app.current_user = user;
          navi("dashboard",{trigger: true});
        }else{
          alert("用户名密码错误，请重试");
          navi('',{trigger: true});
        }
      }});
    },
    
    logout: function(){
      app.current_user = null;
      this.navigate("#",{trigger: true});
    }
    
  });

  
 
 
})(pepper, pepper.module("user"));