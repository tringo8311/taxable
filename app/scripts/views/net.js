/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.NetView = Backbone.View.extend({
        template: JST['app/scripts/templates/net.ejs'],
        events: {
			'blur input.currency': 'modify',
            'blur input.numeric': 'modify',
            'change input.conditional-type' : 'modify',
            'submit form' : 'onSubmit'/*
            'click #netCalculate' : 'calculate'*/
		},
        initialize: function(){
            //if you put this code inside a view, the view will now listening to its model change event
            this.listenTo(pit.SingletonModel.settingModel, 'change', this.doChangeSetting);
            this.render();
        },
        render: function () {
            // Format number
            //console.log(this.model.toNumberFormat());
			this.$el.html(this.template(this.model.toNumberFormat()));
            this.$el.find('input.currency').formatCurrencyLive({
                colorize:true,
                symbol: "",
                decimalSymbol: pit.SingletonModel.settingModel.format.decimalSymbol,
                digitGroupSymbol: pit.SingletonModel.settingModel.format.digitGroupSymbol,
                roundToDecimalPlace: pit.SingletonModel.settingModel.format.roundToDecimalPlace
            });
			return this;
		},
        validate: function() {
            this.model.set(this.name, this.$el.val(), {validate:true});
            this.$msg.text(this.model.errors[this.name] || '');
        },
        doChangeSetting: function(model, value, options){
            this.calculate(options);
        },
        modify: function(e){
            var self = this, valRaw = null;
            valRaw = $.trim(e.target.value);
            if(e.target.type == 'checkbox'){
                valRaw = jQuery(e.target).is(":checked") ? 1 : 0;                
            }else if(valRaw!=""){
                valRaw = $(e.target).asNumber();
            }
            self.model.set(e.target.name, valRaw);
            self.calculate(e);
        },
        onSubmit: function(e){
            var self = this;
            e.preventDefault();
            self.calculate(e);
            return false;  
        },
        calculate: function(e){
            var settingModel = pit.SingletonModel.settingModel;
            var $netSalary = parseInt(this.model.get('net_salary')),
                $bonus = parseInt(this.model.get('bonus')),
                $allowances = parseInt(this.model.get('allowances')),
                $dependants = parseInt(this.model.get('dependants')),
                $maxRange = parseInt(settingModel.get('max_range')),
                $includeUnemploymentInsurance = this.model.get('include_unemployment_insurance');

            // PIT
            var d = new Date();
            var $netPit = $("#netPIT"), $netPitVal = 0, $deductionVal = 0;
            $deductionVal = parseInt(settingModel.get("deduction"));
            if($dependants > 0){
                $deductionVal += $dependants * parseInt(settingModel.get('deduction_each_dependant'));
            }
            if($netSalary > $deductionVal){
                $netPitVal = settingModel.process_revert_pit_rate($netSalary - $deductionVal, d.getFullYear());
            }
            this.pasteValue($netPit, $netPitVal, 'number');

            var $netSalaryBeforePIT = $("#netSalaryBeforePIT");
            var $netSalaryBeforePITVal = $netPitVal + $netSalary;
            this.pasteValue($netSalaryBeforePIT, $netSalaryBeforePITVal, 'number');

            var totalInsurancePer = parseFloat(settingModel.get('social_insurance')) + parseFloat(settingModel.get('health_insurance')) +
                                        parseFloat(settingModel.get('unemployment_insurance'));
            var $netSalaryBeforePITPer100 = 0;
            if($netSalaryBeforePITVal > $maxRange){
                $netSalaryBeforePITPer100 = $maxRange / 100;
            }else{
                $netSalaryBeforePITPer100 = $netSalaryBeforePITVal / (100 - totalInsurancePer);
            }

            // Social Insurance
            var $grossSocialInsurance = $("#netSocialInsurance"),
                $grossSocialInsuranceVal = $netSalaryBeforePITPer100 * settingModel.get('social_insurance');
            this.pasteValue($grossSocialInsurance, $grossSocialInsuranceVal, 'number');

            // Heath Insurance
            var $healthInsurance = $("#netHealthInsurance"),
                $grossHealthInsuranceVal = $netSalaryBeforePITPer100 * settingModel.get('health_insurance');
            this.pasteValue($healthInsurance, $grossHealthInsuranceVal, 'number');

            // Unemployment Insurance
            var $unemploymentInsurance = $("#netUnemploymentInsurance"),
                $unemploymentInsuranceVal = 0;
            if($includeUnemploymentInsurance){
                $unemploymentInsuranceVal = $netSalaryBeforePITPer100 * settingModel.get('unemployment_insurance');
            }            
            this.pasteValue($unemploymentInsurance, $unemploymentInsuranceVal, 'number');

            // Total Insurance
            var $totalInsuranceVal = $grossSocialInsuranceVal + $grossHealthInsuranceVal + $unemploymentInsuranceVal;
            this.pasteValue($("#netTotalInsurance"), $totalInsuranceVal, 'number');

            // Gross Salary
            var $grossSalary = $("#netGrossSalary");
            var $grossSalaryVal = $netSalary + $totalInsuranceVal + $netPitVal;

            this.pasteValue($grossSalary, $grossSalaryVal, 'number');

            // For company
            // Social Insurance
            var $grossSocialInsuranceCompany = $("#netSocialInsuranceCompany"),
                $grossSocialInsuranceCompanyVal = $netSalaryBeforePITPer100 * settingModel.get('social_insurance_company');
            this.pasteValue($grossSocialInsuranceCompany, $grossSocialInsuranceCompanyVal, 'number');

            // Heath Insurance
            var $healthInsuranceCompany = $("#netHealthInsuranceCompany"),
                $grossHealthInsuranceCompanyVal = $netSalaryBeforePITPer100 * settingModel.get('health_insurance_company');
            this.pasteValue($healthInsuranceCompany, $grossHealthInsuranceCompanyVal, 'number');

            // Unemployment Insurance
            var $unemploymentInsuranceCompany = $("#netUnemploymentInsuranceCompany"),
                $unemploymentInsuranceCompanyVal = 0;
            if($includeUnemploymentInsurance){
                $unemploymentInsuranceCompanyVal = $netSalaryBeforePITPer100 * settingModel.get('unemployment_insurance_company');
            }
            this.pasteValue($unemploymentInsuranceCompany, $unemploymentInsuranceCompanyVal, 'number');

            // Total Insurance
            var $totalInsuranceCompanyVal = $grossSocialInsuranceCompanyVal + $grossHealthInsuranceCompanyVal + $unemploymentInsuranceCompanyVal;
            this.pasteValue($("#netInsuranceTotal"), $totalInsuranceCompanyVal, 'number');

            return $grossSalary;
        },
        pasteValue: function(obj, val, type){
            var toFormat = _.string.numberFormat(val, 2);
            obj.text(toFormat);
        }
    });

})();
