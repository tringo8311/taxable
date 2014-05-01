/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};
/*var routeMap = [
    {
        dimension: 200,
        text: 'Alpha',
        percent: '90',
        info: '12 Apr, 2014'
    },
    {
        dimension: 200,
        text: 'Beta, Vietnamese',
        percent: '50',
        info: '20 Apr, 2014'
    },
    {
        dimension: 200,
        text: 'Support Smartphone',
        percent: '30',
        info: '30 Apr, 2014'
    },
    {
        dimension: 200,
        text: 'Support Offline',
        percent: '0',
        info: '10 May, 2014'
    },
    {
        dimension: 200,
        text: 'Add full guide',
        percent: '10',
        info: '30 May, 2014'
    }
]*/
(function () {
    'use strict';

    pit.Views.AboutView = Backbone.View.extend({

        template: JST['app/scripts/templates/about.ejs'],
        initialize: function(){
            //if you put this code inside a view, the view will now listening to its model change event
            this.model = {};
            this.render();
        },
        render: function () {
            // Format number
            //console.log(this.model.toNumberFormat());
			this.$el.html(this.template(this.model));
		}

    });

})();
