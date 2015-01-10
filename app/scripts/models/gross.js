/*global pit, Backbone*/

pit.Models = pit.Models || {};

(function () {
    'use strict';

    pit.Models.GrossModel = Backbone.Model.extend({
        url: '',
        initialize: function() {
            this.options = _.extend({}, this.defaults, this.options);
        },
        defaults: {
            'foreign_salary' : 0,
            'gross_salary' : 0,
            'taxable_salary' : 0,
            'bonus' : 0,
            'allowances' : 0,
            'working_days' : 22,
            'no_pay_leave' : 0,
            'dependants' : 0,
            'include_unemployment_insurance' : 1
        },
        validate: function(attrs, options) {
            var errors = this.errors = {};
            if(attrs.gross_salary != null) {
                if (!attrs.gross_salary) {
                    errors.gross_salary = 'Gross_salary is required';
                    console.log('Gross_salary isEmpty validation called');
                }
            }
            if(attrs.taxable_salary != null) {
                if (!attrs.taxable_salary) {
                    errors.taxable_salary = 'taxable_salary is required';
                    console.log('Taxable_salary isEmpty validation called');
                }else if(!this.validators.min(attrs.taxable_salary, 1900000))
                    errors.taxable_salary = 'Taxable_salary is too min';
            }
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
