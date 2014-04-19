/*global pit, Backbone*/

pit.Models = pit.Models || {};

(function () {
    'use strict';
    pit.Models.TodoModel = Backbone.Model.extend({
        url: '',

        initialize: function() {
        },
        defaults: {
			title: '',
			completed: false
        },
        validate: function(attrs, options) {
        },
        parse: function(response, options)  {
            return response;
        },
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
            console.log("Save");
		}
    });

})();
