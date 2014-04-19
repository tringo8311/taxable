/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.PitView = Backbone.View.extend({
        tagName: 'tr',
        template: JST['app/scripts/templates/pit.ejs'],
        events: {
			'submit form': 'process',
            'change input.currency, change input.numeric': 'modify'
		},
        initialize: function () {
			/*this.listenTo(this.model, 'change', this.render);*/
            this.listenTo(pit.SingletonModel.settingModel, 'change', this.doChangeSetting);
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
            this.calculate(null);
			return this;
		},
        doChangeSetting: function(model, value, options){
            this.calculate(options);
        },
        modify: function(e){
            var self = this, valRaw = null;
            valRaw = $.trim(e.target.value);
            if(valRaw!=""){
                /*console.log(e.target);*/
                valRaw = $(e.target).asNumber();
            }
            self.model.set(e.target.name, valRaw);
            self.calculate(e);
        },
        calculate: function(e){
            var settingModel = pit.SingletonModel.settingModel,
                deductionEachDependant = parseInt(settingModel.get('deduction_each_dependant'));
            var grossSalary = this.model.get("gross"), bonusSalary = this.model.get("bonus"), incomePaidTax = 0;
            incomePaidTax = grossSalary + bonusSalary - this.model.get("insurance_paid") - this.model.get("deduction_of_taxpayer") - (this.model.get("dependants") * deductionEachDependant);
            this.model.set('income_paid_tax', incomePaidTax);
            if(e!=null){
                this.model.trigger("change:income_paid_tax");
            }
            pit.pasteAndFormatValue(this.$el.find('.income-paid-tax'), incomePaidTax);

            var taxPIT = 0;
            if(incomePaidTax > 0){
                taxPIT = settingModel.process_pit_rate(incomePaidTax);
            }
            this.model.set('tax_pit', taxPIT);
            if(e!=null){
                this.model.trigger("change:tax_pit");
            }
            pit.pasteAndFormatValue(this.$el.find('.tax-pit'), taxPIT);
        }
    });

})();
