(function(pepper, Recipe) {
 
  var Common = pepper.module('common');
 
  Recipe.Model = Backbone.Model.extend({
    idAttribute: '_id',
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
  
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
})(pepper, pepper.module("recipe"));