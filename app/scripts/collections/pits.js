/*global pit, Backbone*/

pit.Collections = pit.Collections || {};

(function () {
    'use strict';

    pit.Collections.PitsCollection = Backbone.Collection.extend({
        url : '/',
		initialize: function () {
		    this.model = pit.Models.PitModel
            this.totalModel = new pit.Models.PitModel();
        },
        done: function() {
            return this.where({done: true});
        }

    });

})();
