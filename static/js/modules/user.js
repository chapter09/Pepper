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

/***  User View  ***/

  User.View = Backbone.View.extend({
    initialize: function() {
    },

    render: function() {
      _data = {
        name: this.model.get('name')
        
      };

      papers = new Paper.List(this.model.get('papers'));

      papersView = new Paper.ListView({
        el: '#papersView .list',
        collection: papers
      });


      papersView.render();



      $(this.el).html(ich.userViewPage(_data));
    }


  });

  /***  User PreViewPage  ***/


  User.PreViewPage = Backbone.View.extend({

    render: function(){

    }
  });


  User.Router = Backbone.Router.extend({
   initialize: function(){
      this.pre_view_page = new User.PreViewPage();
      this.user_view_page = new User.View();
      this.dashboard_page = new User.View();
    },
  
  routes: {
      "user/:user_id": "user",
      "dashboard": "dashboard"
    },

    user: function(user_id) {
        model = new User.Model({
          _id: user_id
        });

        $('#loading-animation').show();

        model.fetch({success:function(){

          user_view_page = new User.View({
            model: model
          });

          $('#loading-animation').hide();
          user_view_page.render();

        }});
    }
  });

  
 
 
})(pepper, pepper.module("user"));