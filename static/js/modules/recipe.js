(function(pepper, Recipe) {
 
  var Common = pepper.module('common');
  var Paper = pepper.module('paper');
  var Comment = pepper.module('comment');
 
  Recipe.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: '/recipes',
    dataAdapter: function(){
		  return {
		    'item_title': this.get('title'),
		    'item_description': this.get('description'),
		    'stars': this.get('watches').length,
		    'forks': this.get('forks').length
		  };
		}
  });

  // Define a friend list
  Recipe.List = Backbone.Collection.extend({
    model: Recipe.Model,
    url: '/recipes',
    
    initialize: function(){
      this.inited = false;
    },
    
    parse: function(data){
		  return JSON.parse(data);
		}
  });
  
  Recipe.ListItemView = Common.ListItemView.extend({
    initialize: function(){
      this.template = ich.recipeListItem;
    }
  });
  
  Recipe.ListView = Common.ListView.extend({
    initialize : function() {
        // bind the functions 'add' and 'remove' to the view.
        _(this).bindAll('add', 'remove');

        // create an array of donut views to keep track of children
        this._donutViews = [];
        this.itemViewClass = Recipe.ListItemView;
        this.template = ich.recipeList;
        
        // add each donut to the view
        this.collection.each(this.add);
        
        // bind this view to the add and remove events of the collection!
        this.collection.bind('add', this.add);
        this.collection.bind('remove', this.remove);
        
        this.current_page = 0;
        this.total_page = 0;
        
    }
  });
  
  
  Recipe.Page = Backbone.View.extend({
    el: "#main-container",
    
    render: function(){
      
      data = {
        title: this.model.get('title'),
        description: this.model.get('description'),
        forks: this.model.get('forks').length,
        watches: this.model.get('watches').length,
        inwatch: (app.current_user && 
            this.model.get('_id') in app.current_user.watches)
      };
      
      _papers = this.model.get('_papers');
      paperList = new Paper.List(_papers);
      
      _comments = this.model.get('_comments');
      comments = new Comment.List(_comments);
      
      $(this.el).html(ich.recipeViewPage(data));
      
      $('.watch').click(this.watch);
      $('.fork').click(this.fork);
      
      
      paperListView = new Paper.ListView({
        el: '#paper-list',
        collection: paperList
      });
      
      paperListView.render();
      
      
      cw = new Comment.InputView({
        modelObject: this.model,
        collection: comments,
        el: '.my-comment-list',
      });
      
      cw.render();
      
      cv = new Comment.ListView({
        tagName: "div",
        id: "comment-list",
        collection: comments
      });
      
      $('.comment-list-wrapper', this.el).html(cv.render().el);
      
      
    }
  });
  
  Recipe.Router = Backbone.Router.extend({
    initialize: function(){
    },
     
     routes: {
       "recipe/:recipe_id": "recipe",
     },
    
     recipe: function(recipe_id){
       app.render_widgets();
       
       model = new Recipe.Model({_id: recipe_id});
       
       $("#loading-animtion").show();
       
       model.fetch({success:function(model, success){
         
         view = new Recipe.Page({
           model:model
         });
         
         
         view.render();
         $('#loading-animtion').hide();
         
       }});
       
     }
   });
  
  
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
})(pepper, pepper.module("recipe"));