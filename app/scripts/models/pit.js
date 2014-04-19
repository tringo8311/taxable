/*global pit, Backbone*/

pit.Models = pit.Models || {};

(function () {
    'use strict';

    pit.Models.PitModel = Backbone.Model.extend({
        url: '/pit',
        initialize: function() {
            this.options = _.extend({}, this.defaults, this.options);
        },
        defaults: {
            title: 'Month',
            gross: 0,
            bonus: 0,
            insurance_paid: 0,
            dependants: 0,
            pit_paid: 0,
            deduction_of_taxpayer: 4000000,
            income_paid_tax: 0,
            tax_pit: 0
        },
        validate: function(attrs, options) {
        },
        parse: function(response, options)  {
            return response;
        },
        toNumberFormat: function(response){
            var jsonVal = this.toJSON(), result = "";
            function numberReplacer(key, val){
                if(key == "title"){
                    return val;
                }else if(typeof(val) == "object"){
                    return val;
                }
                return _.string.numberFormat(parseInt(val));
            };
            result = JSON.stringify(jsonVal, numberReplacer);
            return $.parseJSON(result);
        }
    });

})();
