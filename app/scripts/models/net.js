/*global pit, Backbone*/

pit.Models = pit.Models || {};

(function () {
    'use strict';

    pit.Models.NetModel = Backbone.Model.extend({

        url: '',

        initialize: function() {
            this.options = _.extend({}, this.defaults, this.options);
        },

        defaults: {
            'net_salary' : 0,
            'bonus' : 0,
            'allowances' : 0,
            'dependants' : 0,
            'include_unemployment_insurance' : 1
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
