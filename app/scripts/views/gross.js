/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.GrossView = Backbone.View.extend({
        template: JST['app/scripts/templates/gross.ejs'],
        events: {
			'change input.currency': 'modify',
            'change input.numeric' : 'modify',
            'change input.conditional-type' : 'modify',
            'submit form' : 'onSubmit'/*,            
			'click #grossCalculate': 'calculate'*/
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
            if(pit.isMobile()){
                this.$el.find('input.currency').on("blur", function(){
                    $(this).formatCurrency({
                        colorize:true,
                        symbol: "",
                        decimalSymbol: pit.SingletonModel.settingModel.format.decimalSymbol,
                        digitGroupSymbol: pit.SingletonModel.settingModel.format.digitGroupSymbol,
                        roundToDecimalPlace: pit.SingletonModel.settingModel.format.roundToDecimalPlace
                    });
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
            this.renderRating();
			return this;
		},
        renderRating: function(model, value, options){
            var self = this, val = 0, rateArr = [
                ['social_insurance', '#grossSocialInsuranceRate'],
                ['health_insurance', '#grossHealthInsuranceRate'],
                ['unemployment_insurance', '#grossUnemploymentInsuranceRate'],
                ['social_insurance_company', '#grossSocialInsuranceRateCompany'],
                ['health_insurance_company', '#grossHealthInsuranceRateCompany'],
                ['unemployment_insurance_company', '#grossUnemploymentInsuranceRateCompany'],
            ];
            _.map(rateArr, function(a){
                val = pit.SingletonModel.settingModel.get(a[0]);
                self.$el.find(a[1]).html(val+"%");
            });            
        },
        doChangeSetting: function(model, value, options){
            this.calculate(options);
            this.renderRating();
        },
        modify: function(e){
            var self = this, valRaw = null;
            valRaw = $.trim(e.target.value);

            if(e.target.type == 'checkbox'){
                valRaw = jQuery(e.target).is(":checked") ? 1 : 0;                
            }else if(valRaw != ""){                
                valRaw = $(e.target).asNumber();
            }
            self.model.set(e.target.name, valRaw);
            self.calculate(e);
        },
        onSubmit: function(e){
            var self = this;
            e.preventDefault();
            // In case mobile refill data from form
            if(pit.isMobile()){
                var data = JSON.stringify(self.$el.find('form').serializeObjectAsNumber());
                self.model.set(data);
            }
            self.calculate(e);
            return false;  
        },
        calculate: function(e){
            var settingModel = pit.SingletonModel.settingModel;
            var $grossSalary = parseInt(this.model.get('gross_salary')),
                $taxableSalary = parseInt(this.model.get('taxable_salary')),
                $bonus = parseInt(this.model.get('bonus')),
                $workingDays = parseInt(this.model.get('working_days')),
                $noPayDays = parseFloat(this.model.get('no_pay_leave')),
                $allowances = parseInt(this.model.get('allowances')),
                $dependants = parseInt(this.model.get('dependants')),
                $maxRange = parseInt(settingModel.get('max_range')),
                $includeUnemploymentInsurance = this.model.get('include_unemployment_insurance'),
                $salaryValid = 0;

            if($taxableSalary > 0){
                $salaryValid = $taxableSalary;
            }else{
                $salaryValid = $grossSalary;
            }
            $salaryValid = Math.min($salaryValid, $maxRange);

            //console.log("$salaryValid" + grossSalary);
            var $grossSalaryPer100 =  $salaryValid / 100;
            // Social Insurance
            var $grossSocialInsurance = $("#grossSocialInsurance"),
                $grossSocialInsuranceVal = $grossSalaryPer100 * settingModel.get('social_insurance');
            this.pasteValue($grossSocialInsurance, $grossSocialInsuranceVal, 'number');

            // Heath Insurance
            var $healthInsurance = $("#grossHealthInsurance"),
                $grossHealthInsuranceVal = $grossSalaryPer100 * settingModel.get('health_insurance');
            this.pasteValue($healthInsurance, $grossHealthInsuranceVal, 'number');

            // Unemployment Insurance
            var $unemploymentInsurance = $("#grossUnemploymentInsurance"),
                $unemploymentInsuranceVal = 0;
                //console.log($includeUnemploymentInsurance);
            if($includeUnemploymentInsurance){
                $unemploymentInsuranceVal = $grossSalaryPer100 * settingModel.get('unemployment_insurance');
            }            
            this.pasteValue($unemploymentInsurance, $unemploymentInsuranceVal, 'number');

            // Total Insurance
            var $totalInsuranceVal = $grossSocialInsuranceVal + $grossHealthInsuranceVal + $unemploymentInsuranceVal;
            this.pasteValue($("#grossTotalInsurance"), $totalInsuranceVal, 'number');

            var $salaryBeforePit =  $bonus + $allowances - $totalInsuranceVal;
            if($taxableSalary > 0){
                $salaryBeforePit += $taxableSalary;
            }else{
                $salaryBeforePit += $grossSalary;
            }
            // Check working days
            var $noPayDaysAverage = 0;
            if($noPayDays > 0){
                $noPayDaysAverage = $salaryBeforePit / $workingDays;
            }
            $salaryBeforePit -= $noPayDaysAverage * $noPayDays;

            // Net salary before PIT
            var $grossSalaryBeforePIT = $("#grossSalaryBeforePIT");
            this.pasteValue($grossSalaryBeforePIT, $salaryBeforePit, 'number');
            // PIT
            var d = new Date();
            var $pit = $("#grossPIT"), $pitVal = 0, $deductionVal = 0;
            $deductionVal = parseInt(settingModel.get("deduction"));
            if($dependants > 0){
                $deductionVal += $dependants * parseInt(settingModel.get('deduction_each_dependant'));
            }
            if($salaryBeforePit > $deductionVal){
                $pitVal = settingModel.process_pit_rate($salaryBeforePit - $deductionVal, d.getFullYear());
            }
            this.pasteValue($pit, $pitVal, 'number');

            // Net Salary
            var $netSalary = $("#grossNetSalary");
            var $netSalaryVal = 0;
            $netSalaryVal =  $salaryBeforePit - $pitVal;

            this.pasteValue($netSalary, $netSalaryVal, 'number');

            // For Company
            var $grossSocialInsuranceCompany = $("#grossSocialInsuranceCompany"),
                $grossSocialInsuranceCompanyVal = $grossSalaryPer100 * settingModel.get('social_insurance_company');
            this.pasteValue($grossSocialInsuranceCompany, $grossSocialInsuranceCompanyVal, 'number');

            // Heath Insurance
            var $healthInsuranceCompany = $("#grossHealthInsuranceCompany"),
                $grossHealthInsuranceCompanyVal = $grossSalaryPer100 * settingModel.get('health_insurance_company');
            this.pasteValue($healthInsuranceCompany, $grossHealthInsuranceCompanyVal, 'number');

            // Unemployment Insurance
            var $unemploymentInsuranceCompany = $("#grossUnemploymentInsuranceCompany"),
                $unemploymentInsuranceCompanyVal = 0;
            if($includeUnemploymentInsurance){
                $unemploymentInsuranceCompanyVal = $grossSalaryPer100 * settingModel.get('unemployment_insurance_company');        
            }            
            this.pasteValue($unemploymentInsuranceCompany, $unemploymentInsuranceCompanyVal, 'number');

            // Total Insurance
            this.pasteValue($("#grossInsuranceTotal"), $grossSocialInsuranceCompanyVal + $grossHealthInsuranceCompanyVal + $unemploymentInsuranceCompanyVal, 'number');            

            return $netSalaryVal;
        },
        pasteValue: function(obj, val, type){
            var toFormat = _.string.numberFormat(val, 2);
            obj.text(toFormat);
        }
    });
})();
