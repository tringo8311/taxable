/*global pit, Backbone*/

pit.Models = pit.Models || {};

(function () {
    'use strict';
    pit.Models.SettingModel = Backbone.Model.extend({
        //localStorage: new Backbone.LocalStorage("taxable-setting"),
        url: '',
        initialize: function() {
            this.options = _.extend({}, this.defaults, this.options);
        },

        defaults: {
            social_insurance : '8',
            health_insurance : '1.5',
            unemployment_insurance : '1',
            max_range : '23000000',
            min_range :  '1150000',
            min_range_area :  '2700000',
            deduction :  '9000000',
            deduction_each_dependant : '3600000',
            social_insurance_company : '18',
            health_insurance_company : '3',
            unemployment_insurance_company : '1'
        },

        format: {
            decimalSymbol: ".",
            digitGroupSymbol: ",",
            negativeFormat: "(%s%n)",
            positiveFormat: "%s%n",
            roundToDecimalPlace: "0"
        },

        toNumberFormat: function(response){
            var jsonVal = this.toJSON(), result = "";
            function numberReplacer(key, val){
                if(typeof(val) == "object"){
                    return val;
                }
                return _.string.numberFormat(parseFloat(val), 1);
            };
            result = JSON.stringify(jsonVal, numberReplacer);
            return $.parseJSON(result);
        },

        validate: function(attrs, options) {

        },

        parse: function(response, options)  {
            return response;
        },

        pit_rates: function(year){
            // 0 - 5 trieu => 5%
            // 5 - 10 trieu => 10%
            // 10 - 18 trieu => 15%
            // 18 - 32 trieu => 20%
            // 32 - 52 trieu => 25%
            // 52 - 80 trieu => 30%
            // 80 trieu => 35%
            return [
                { label : '0 - 5 000 000(VND)', min_value : '0', max_value: '5000000', rate : '5', submitted : 0 },
                { label : '5 000 000(VND) - 10 000 000(VND)', min_value : '5000000', max_value: '10000000', rate : '10', submitted : 0 },
                { label : '10 0000 000(VND) - 18 000 000(VND)', min_value : '10000000', max_value: '18000000', rate : '15', submitted : 0 },
                { label : '18 0000 000(VND) - 32 000 000(VND)', min_value : '18000000', max_value: '32000000', rate : '20', submitted : 0 },
                { label : '32 0000 000(VND) - 52 000 000(VND)', min_value : '32000000', max_value: '52000000', rate : '25', submitted : 0 },
                { label : '52 0000 000(VND) - 80 000 000(VND)', min_value : '52000000', max_value: '80000000', rate : '30', submitted : 0 },
                { label : '> 80 0000 000(VND)', min_value : '80000000', max_value: '1000000000', rate : '35', submitted : 0 }
            ];
        },
        process_pit_rate: function(taxable, year){
            // Return money after pit rate
            var taxable = parseInt(taxable), result = 0, i = 0, pitRate = {}, pitRates = this.pit_rates(year),
                min_value = 0, max_value = 0, actual_value = 0;
            while ((i < pitRates.length) && (taxable > 0)){
                pitRate = pitRates[i];
                max_value = parseInt(pitRate.max_value);
                min_value = parseInt(pitRate.min_value);
                actual_value = max_value - min_value;
                if(taxable > actual_value){
                    result += (actual_value / 100) * pitRate.rate;
                }else{
                    result += (taxable / 100) * pitRate.rate;
                }
                taxable -= actual_value;
                i++;
            }
            return result;
        },
        process_revert_pit_rate: function(taxable, year){
            // Return money before pit rate
            var taxable = parseInt(taxable), result = 0, i = 0, pitVal = 0, pitRate = {}, pitRates = this.pit_rates(year),
                min_value = 0, max_value = 0, actual_value = 0, tmp_value = 0;
            while ((i < pitRates.length) && (taxable > max_value)){
                pitRate = pitRates[i];
                max_value = parseFloat(pitRate.max_value);
                min_value = parseFloat(pitRate.min_value);
                actual_value = max_value - min_value;
                if(taxable > (max_value - ((actual_value / 100) * pitRate.rate))){
                    tmp_value = (actual_value / 100) * pitRate.rate;
                    result += tmp_value;
                } else {
                    tmp_value = ((taxable - min_value) / (100 - pitRate.rate)) * pitRate.rate;
                    result += tmp_value;
                }
                taxable += tmp_value;
                i++;
            }
            return result;
        },
        process_pit_rate_detail: function(taxable, year){
            // Return money after pit rate
            var taxable = parseInt(taxable), i = 0, pitRate = {}, pitRates = this.pit_rates(year), tmpVal = 0,
                min_value = 0, max_value = 0, actual_value = 0;
            while ((i < pitRates.length) && (taxable > 0)){
                pitRate = pitRates[i];
                max_value = parseInt(pitRate.max_value);
                min_value = parseInt(pitRate.min_value);
                actual_value = max_value - min_value;
                if(taxable > actual_value){
                    tmpVal = (actual_value / 100) * pitRate.rate;
                }else{
                    tmpVal = (taxable / 100) * pitRate.rate;
                }
                pitRates[i].submitted = tmpVal;
                taxable -= actual_value;
                i++;
            }
            return pitRates;
        }
    });

})();
