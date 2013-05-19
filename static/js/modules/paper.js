(function(pepper, Paper) {
 
 var Common = pepper.module('common');
 var Comment = pepper.module('comment');
 
 
 // Shorthands 
 // The application container
 var app = pepper.app;
 
 Paper.Model = Common.ListItem.extend({
    
    urlRoot: '/papers',
    
    dataAdapter: function(){
      authors = this.get('author');
      _a = []
      for (var i=0; i < authors.length; i++) {
        _a.push({name: authors[i]});
      };
      
		  return {
		    'item_title': this.get('title'),
		    'item_authors': _a,
		    'stars': this.get('stars')
		  };
		}
  });

  // Define a friend list
  Paper.List = Backbone.Collection.extend({
    model: Paper.Model,
    url: '/papers',
    
    parse: function(data){
		  return JSON.parse(data);
		}
    
  });
  
  
  Paper.ListItemView = Common.ListItemView.extend({
    
    initialize: function(){
      this.template = ich.paperListItem;
    },
    
  });
  
  Paper.ListView = Common.ListView.extend({
    initialize : function() {
        // bind the functions 'add' and 'remove' to the view.
        _(this).bindAll('add', 'remove');

        // create an array of donut views to keep track of children
        this._donutViews = [];

        this.itemViewClass = Paper.ListItemView;
        this.template = ich.commonList;
        
        // add each donut to the view
        this.collection.each(this.add);
        
        // bind this view to the add and remove events of the collection!
        this.collection.bind('add', this.add);
        this.collection.bind('remove', this.remove);
      
    },
  });
  
  Paper.Page = Backbone.View.extend({
    
    el: "#main-container",
    
    render: function(){
      authors = this.model.get('author');
      authors_html = "";
      for (var i=0; i < authors.length; i++) {
        authors_html += "<li>"+authors[i]+"</li>";
      };
      
      
      comments = new Comment.List(this.model.get('_comments'));
      
      cv = new Comment.ListView({
        tagName: "div",
        id: "comment-list",
        collection: comments
      });
      
      
      
      data = {
        title: this.model.get('title'),
        source: this.model.get('source').title,
        year: this.model.get('year')
      }
      
      $(this.el).html(ich.paperViewPage(data));
      
      $(".authors", this.el).html(authors_html);
      $(this.el).attr('paper_id', this.model.get('_id'));
      
      cw = new Comment.InputView({
        modelObject: this.model,
        collection: comments,
        el: '.my-comment-list',
      });
      
      cw.render();
      $('.comment-list-wrapper', this.el).html(cv.render().el);
      
    }
  });
  
  Paper.Router = Backbone.Router.extend({
    initialize: function(){
    },
     
     routes: {
       "paper/:paper_id": "paper",
     },
    
     paper: function(paper_id){
       app.render_widgets();
       
       model = new Paper.Model({_id: paper_id});
       
       $("#loading-animtion").show();
       
       model.fetch({success:function(model, success){
         
         view = new Paper.Page({
           model:model
         });
         
         
         view.render();
         $('#loading-animtion').hide();
         
       }});
       
     }
   });
  
  
 
 
})(pepper, pepper.module("paper"));