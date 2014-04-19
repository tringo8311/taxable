/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.ExtraView = Backbone.View.extend({
        template: JST['app/scripts/templates/extra.ejs'],
        events: {
			'blur input.currency': 'modify',
            'blur input.numeric': 'modify',
            'change input.token-input': 'modify',
            'click #calculateRevertPITRate' : 'calculateRevertPITRate',
            'click #calculatePITRate' : 'calculatePITRate',
            'click #pregnantCalculate' : 'pregnantCalculate',
            'click #unemploymentCalculate' : 'unemploymentCalculate'
		},
        initialize: function () {
            this.render();
        },
        render: function () {
			this.$el.html(this.template(this.model.toNumberFormat()));
            this.$el.find('input.currency').formatCurrencyLive({
                colorize:true,
                symbol: "",
                decimalSymbol: pit.SingletonModel.settingModel.format.decimalSymbol,
                digitGroupSymbol: pit.SingletonModel.settingModel.format.digitGroupSymbol,
                roundToDecimalPlace: pit.SingletonModel.settingModel.format.roundToDecimalPlace
            });
            this.$el.find('input.token-input').tokenfield({limit:12,delimiter:';'})
                .on('tokenfield:preparetoken', function (e) {
                    e.token.value = parseFloat(e.token.value);
                    e.token.label = _.string.numberFormat(e.token.value, 2);
                })
                .on('tokenfield:createtoken', function (e) {
                    // Über-simplistic e-mail validation
                    var re = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;
                    var valid = re.test(e.token.value)
                    if (!valid) {
                      $(e.relatedTarget).addClass('invalid')
                    }
                });
			return this;
		},
        modify: function(e){
            var self = this, valRaw = null;
            valRaw = $.trim(e.target.value);
            if(valRaw != "" && (valRaw.indexOf(";")==-1)){
                valRaw = $(e.target).asNumber();
            }
            self.model.set(e.target.name, valRaw);
            //self.calculate(e);
        },        
        calculatePITRate: function(e){
            var settingModel = pit.SingletonModel.settingModel;
            var extraSalaryPaid = 0;
            extraSalaryPaid = settingModel.process_pit_rate(this.model.get('salary_paid'));
            pit.pasteAndFormatValue(this.$el.find('.pitRate-article .total'), extraSalaryPaid);
            return false;
        },
        calculateRevertPITRate: function(e){
            var settingModel = pit.SingletonModel.settingModel;
            var extraSalaryPaid = 0;
            extraSalaryPaid = settingModel.process_revert_pit_rate(this.model.get('pit_tax_paid'));
            pit.pasteAndFormatValue(this.$el.find('.revertPitRate-article .total'), extraSalaryPaid);
            return false;
        },
        pregnantCalculate: function(e){
            var settingModel = pit.SingletonModel.settingModel;
            var benefitPaid = 0, pregnantSalaryAvg = 0, pregnantSalaryArr = [],
                pregnantSalary = this.model.get('pregnant_salary_gross_average');
            if($.isNumeric(pregnantSalary))
                pregnantSalaryArr = [pregnantSalary];
            else if(pregnantSalary != null && pregnantSalary != 0)
                pregnantSalaryArr = pregnantSalary.split(';');

            _.each(pregnantSalaryArr, function(val){
                return pregnantSalaryAvg += Math.min(parseFloat(val), parseFloat(settingModel.get('max_range')));
            });
            pregnantSalaryAvg = pregnantSalaryAvg / pregnantSalaryArr.length;

            //if(pregnantSalaryAvg > parseInt(settingModel.get('max_range')))
                //pregnantSalaryAvg = parseInt(settingModel.get('max_range'));
            benefitPaid = pregnantSalaryAvg / 100;
            benefitPaid *= this.model.get('pregnant_percent') * this.model.get('pregnant_months');
            pit.pasteAndFormatValue(this.$el.find('.pregnant-article .total'), benefitPaid);
            return false;
        },
        unemploymentCalculate: function(e){
            var settingModel = pit.SingletonModel.settingModel,
                unemploymentSalaryAvg = 0, unemploymentSalaryArr = [],
                unemploymentSalary = this.model.get('unemployment_salary_gross_average');
            if($.isNumeric(unemploymentSalary))
                unemploymentSalaryArr = [unemploymentSalary];
            else if(unemploymentSalary!=null&&unemploymentSalary!=0)
                unemploymentSalaryArr = unemploymentSalary.split(';');

            _.each(unemploymentSalaryArr, function(val){
                return unemploymentSalaryAvg += Math.min(parseFloat(val), parseFloat(settingModel.get('max_range')));
            });
            unemploymentSalaryAvg = unemploymentSalaryAvg / unemploymentSalaryArr.length;

            /*if(unemploymentSalaryAvg > parseInt(settingModel.get('max_range')))
                unemploymentSalaryAvg = parseInt(settingModel.get('max_range'));*/
            
            var benefitPaid = unemploymentSalaryAvg / 100;
            benefitPaid *= this.model.get('unemployment_percent') * this.model.get('unemployment_months');
            pit.pasteAndFormatValue(this.$el.find('.unemployment-article .total'), benefitPaid);
            return false;
        }
    });

})();
