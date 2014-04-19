/*global pit, Backbone*/

pit.Collections = pit.Collections || {};

(function () {
    'use strict';

    pit.Collections.TodosCollection = Backbone.Collection.extend({
		//localStorage: new Backbone.LocalStorage('backbone-generator-todos'),
		initialize: function () {
			this.model = pit.Models.TodoModel;
		},
        done: function() {
          return this.where({done: true});
        }
    });

})();
