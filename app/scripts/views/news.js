/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.NewsView = Backbone.View.extend({
        template: JST['app/scripts/templates/news.ejs'],
        initialize: function(){
            this.render();
        },
        render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}

    });

})();
