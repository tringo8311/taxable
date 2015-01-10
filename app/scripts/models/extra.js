/*global pit, Backbone*/

pit.Models = pit.Models || {};

(function () {
    'use strict';

    pit.Models.ExtraModel = Backbone.Model.extend({
        url: '',
        initialize: function() {
            this.options = _.extend({}, this.defaults, this.options);
        },

        defaults: {
            exchange_from: "USD",
            exchange_to: "VND",
            exchange_value: 0,
            salary_paid : 0,
            pit_tax_paid : 0,
            pregnant_salary_gross_average : null,
            pregnant_percent : 100,
            pregnant_months : 6,
            pregnant_subsidy : 1150000*2,
            unemployment_salary_gross_average : null,
            unemployment_percent : 70,
            unemployment_months : 6
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },

        toNumberFormat: function(response){
            var jsonVal = this.toJSON(), result = "";
            function numberReplacer(key, val){
                if(typeof(val) == "object"){
                    return val;
                }
                return _.string.numberFormat(parseInt(val));
            };
            result = JSON.stringify(jsonVal, numberReplacer);
            return $.parseJSON(result);
        }
    });

})();
