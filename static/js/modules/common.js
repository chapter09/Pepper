(function(pepper, Common) {
	var User = pepper.module("user");

	Common.ListItem = Backbone.Model.extend({
		idAttribute: '_id',
		
		dataAdapter: function(){
		  return {
		    'item_title': this.get('title'),
		    'item_description': this.get('description'),
		    'stars': this.get('stars')
		  };
		}
	})

	Common.ListItemView = Backbone.View.extend({
	  
		render: function(){
		  data = this.model.dataAdapter();
			$(this.el).html(this.template(data));
			return this;
		}
	})

	Common.List = Backbone.Collection.extend({
		model:Common.ListItem,
		
		total_page: 0,
		current_page: 0,
		
		parse: function(data){
		  return JSON.parse(data);
		}
	});

	Common.ListView = Backbone.View.extend({
		
		initialize : function() {
        // bind the functions 'add' and 'remove' to the view.
        _(this).bindAll('add', 'remove');

        // create an array of donut views to keep track of children
        this._donutViews = [];

        // add each donut to the view
        this.collection.each(this.add);
        
        // bind this view to the add and remove events of the collection!
        this.collection.bind('add', this.add);
        this.collection.bind('remove', this.remove);
        
    },    
    
    add : function(_event) {
          // We create an updating donut view for each donut that is added.
          if (_(this._donutViews).select(function(cv) { 
              return cv.model.get('_id') === _event.get('_id'); 
            }).length==0){


            var dv = new this.itemViewClass({
              tagName : 'li',
              model : _event
            });

            // And add it to the collection so that it's easy to reuse.
            this._donutViews.unshift(dv);

            // If the view has been rendered, then
            // we immediately append the rendered donut.
            if (this._rendered) {
              $(this.el).prepend(dv.render().el);
            }

          };
    },

    remove : function(model) {
      var viewToRemove = _(this._donutViews).select(function(cv) { return cv.model === model; })[0];
      this._donutViews = _(this._donutViews).without(viewToRemove);

      if (this._rendered) $(viewToRemove.el).remove();
    },
    
    
    calc_page: function(){
      if(this.collection.current_page == 0){
        $('.prev', this.el).hide();
      }else{
        $('.prev', this.el).show();
      };
      
      if(this.collection.current_page == this.collection.total_page){
        $('.next', this.el).hide();
      }else{
        $('.next', this.el).show();
      };
      
      
    },
    
    render : function() {
      // We keep track of the rendered state of the view
      this._rendered = true;
      
      data = {
        'current_page': this.collection.current_page,
        'total_page': this.collection.total_page
      }
      
      $(this.el).html(this.template(data));
      
      // Render each Donut View and append them.
      for (var i=0; i < this._donutViews.length; i++) {
        $(".common-list" ,this.el).append(this._donutViews[i].render().el);
      
      };
      
      this.calc_page();
      
      return this;
    }
    

	});




})(pepper, pepper.module("common"));