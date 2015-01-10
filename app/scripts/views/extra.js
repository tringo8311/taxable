/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.ExtraView = Backbone.View.extend({
        template: JST['app/scripts/templates/extra.ejs'],
        events: {
			'change input.currency': 'modify',
            'change input.numeric': 'modify',
            'change input.token-input': 'modify',
            'click #calculateExchange' : 'calculateExchange',
            'click #calculateRevertPITRate' : 'calculateRevertPITRate',
            'click #calculatePITRate' : 'calculatePITRate',
            'click #pregnantCalculate' : 'pregnantCalculate',
            'click #unemploymentCalculate' : 'unemploymentCalculate'
		},
        initialize: function () {
            this.listenTo(pit.SingletonModel.settingModel, 'change', this.doChangeSetting);
            this.render();
        },
        render: function () {
            // Set Value for pregnant subsidy
            var settingModel = pit.SingletonModel.settingModel;
            this.model.set('pregnant_subsidy', parseInt(settingModel.get('min_range')) * 2);

			this.$el.html(this.template(this.model.toNumberFormat()));
            if(pit.isMobile()){
                this.$el.find('input.currency').formatCurrency({
                    colorize:true,
                    symbol: "",
                    decimalSymbol: pit.SingletonModel.settingModel.format.decimalSymbol,
                    digitGroupSymbol: pit.SingletonModel.settingModel.format.digitGroupSymbol,
                    roundToDecimalPlace: pit.SingletonModel.settingModel.format.roundToDecimalPlace
                });
            }else{
                this.$el.find('input.currency').formatCurrencyLive({
                        colorize:true,
                        symbol: "",
                        decimalSymbol: pit.SingletonModel.settingModel.format.decimalSymbol,
                        digitGroupSymbol: pit.SingletonModel.settingModel.format.digitGroupSymbol,
                        roundToDecimalPlace: pit.SingletonModel.settingModel.format.roundToDecimalPlace
                    });
            }
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
        doChangeSetting : function(model, value, options){
            //console.log("value:"+parseInt(model.get('min_range'))*2);
            this.model.set('pregnant_subsidy', parseInt(model.get('min_range'))*2);
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
        calculateExchange: function(e){
            var exchangeFrom = this.model.get('exchange_from');
            var exchangeTo = this.model.get('exchange_to');
            var exchangeValue = this.model.get('exchange_value');
            var self = this;
            window.pit.exchangeRate(exchangeFrom, exchangeTo, exchangeValue).then(function (resultVal) {
                pit.pasteAndFormatValue(self.$el.find('.exchange-article .total'), resultVal);
            });
            return false;
        },
        calculatePITRate: function(e){
            var settingModel = pit.SingletonModel.settingModel;
            var extraSalaryPaid = 0;
            extraSalaryPaid = settingModel.process_pit_rate(this.model.get('salary_paid'));
            pit.pasteAndFormatValue(this.$el.find('.pitRate-article .total'), extraSalaryPaid);

            // Detail PIT Rate
            var result = $("<table class='table table-striped table-bordered table-hover'/>");
            var template = _.template("<tr><td><%= label %></td><td><%= rate %>%</td><td><%= submitted %>(VND)</td></tr>");
            _.each(pit.SingletonModel.settingModel.process_pit_rate_detail(this.model.get('salary_paid'), null), function(item){
                if(item.submitted > 0){
                    item.submitted = _.string.numberFormat(item.submitted, 0);
                }
                result.append(template(item));
            });
            this.$el.find('#pitRateResult').html(result);
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
                pregnantSalary = this.model.get('pregnant_salary_gross_average'),
                pregnantSubsidy = this.model.get("pregnant_subsidy");
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
            benefitPaid += pregnantSubsidy;

            pit.pasteAndFormatValue(this.$el.find('.pregnant-article input[name=pregnant_subsidy]'), pregnantSubsidy);
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
