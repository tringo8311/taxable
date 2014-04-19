/*global pit, Backbone*/

pit.Collections = pit.Collections || {};

(function () {
    'use strict';

    pit.Collections.NewsCollection = Backbone.Collection.extend({

        model: pit.Models.NewsModel

    });

})();
