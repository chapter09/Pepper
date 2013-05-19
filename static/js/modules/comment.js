(function(pepper, Comment) {
 
 
 var Common = pepper.module('common');
 
 
 Comment.Model = Common.ListItem.extend({
    
    dataAdapter: function(){
		  return {
		    'user_name': this.get('user').name,
		    'content': this.get('content'),
		    'stars': this.get('stars')
		  };
		}
  });

  // Define a friend list
  Comment.List = Common.List.extend({
    model: Comment.Model,
    
    url: '/comments'
  });
  
  Comment.ListItemView = Common.ListItemView.extend({
    initialize: function(){
      this.template = ich.commentListItem;
    }
  });
  
  Comment.ListView = Common.ListView.extend({
    initialize : function() {
        // bind the functions 'add' and 'remove' to the view.
        _(this).bindAll('add', 'remove');

        // create an array of donut views to keep track of children
        this._donutViews = [];
        this.itemViewClass = Comment.ListItemView;
        this.template = ich.commonList;
        
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
 
})(pepper, pepper.module("comment"));