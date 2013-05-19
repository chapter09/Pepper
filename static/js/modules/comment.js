(function(pepper, Comment) {
 
 
 var Common = pepper.module('common');
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
 
 Comment.Model = Common.ListItem.extend({
    
    urlRoot: '/comments',
    dataAdapter: function(){
		  return {
		    'user_name': this.get('user'),
		    'content': this.get('content'),
		    'datetime': this.get('created_datetime'),
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
  
  Comment.InputView = Backbone.View.extend({
    
    initialize: function(){
      
      _(this).bindAll('send_comment', 'render');
      this.modelObject = this.options.modelObject;
      this._comments = this.modelObject.get('_comments');
      this.comment = null;
      for (var i=0; i < this._comments.length; i++) {
        if(this._comments[i].user == app.current_user.get('name')){
          this.comment = new Comment.Model(this._comments[i]);
        }
      };
      
    },
    
    render: function(){
      if (!this.comment){
        $(this.el).html(ich.commentInputWidget());
        $(".send-commnet", this.el).click(this.send_comment);
      }else{
        data = this.comment.dataAdapter();
        $(this.el).html(ich.commentViewWidget(data));
      }
      
    },
    
    send_comment: function(e){
      e.preventDefault();
      content = $(".comment-body", this.el).val();
      stars = $("input[name='stars']:checked").val();
      user = app.current_user.get('name');
      datetime = new Date();
      
      this.comment = new Comment.Model({
        content: content,
        stars: stars,
        user: user,
        created_datetime: datetime
      });
      
      _r = this.render;
      _c = this.collection;
      _m = this.modelObject;
      
      this.comment.save({}, {success:function(model, success){
        _c.add(model);
        comments = _m.get('comments');
        comments.push(model.get('_id'));
        _m.save({comments: comments});
        _r();
      }});
    }
    
    
  });
  
  
 
 
})(pepper, pepper.module("comment"));