(function(pepper, Common) {
	var User = pepper.module("user");

	Common.ListItem = Backbone.Model.extend({
		defaults: {

		}

	})

	Common.ListItemView = Backbone.View.extend({
		el: '#common_list_item',

		render: function(){
			$(this.el).html(ich.commonListItem());
		}
	})

	Common.List = Backbone.Collection.extend({
		model:Common.ListItem
	});

	Common.ListView = Backbone.View.extend({
		el: 'body',

	})




})(pepper, pepper.module("common"));