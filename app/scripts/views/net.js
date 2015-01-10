/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.NetView = Backbone.View.extend({
        template: JST['app/scripts/templates/net.ejs'],
        events: {
			'change input.currency': 'modify',
            'change input.numeric': 'modify',
            'change input.conditional-type' : 'modify',
            'click #netForeignSalaryPlay' :  'doConvertForeignSalary',
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
                this.$el.find('input.currency').keyup(function(e) {
                    var e = window.event || e;
                    var keyUnicode = e.charCode || e.keyCode;
                    if (e !== undefined) {
                        switch (keyUnicode) {
                            case 16: break; // Shift
                            case 17: break; // Ctrl
                            case 18: break; // Alt
                            case 27: this.value = ''; break; // Esc: clear entry
                            case 35: break; // End
                            case 36: break; // Home
                            case 37: break; // cursor left
                            case 38: break; // cursor up
                            case 39: break; // cursor right
                            case 40: break; // cursor down
                            case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
                            case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
                            case 190: break; // .
                            default:
                                $(this).formatCurrency({
                                    symbol: "",
                                    decimalSymbol: pit.SingletonModel.settingModel.format.decimalSymbol,
                                    digitGroupSymbol: pit.SingletonModel.settingModel.format.digitGroupSymbol,
                                    roundToDecimalPlace: pit.SingletonModel.settingModel.format.roundToDecimalPlace
                                });
                        }
                    }
                });
            }
            this.renderRating();
			return this;
		},
        renderRating: function(model, value, options){
            var self = this, val = 0, rateArr = [
                ['social_insurance', '#netSocialInsuranceRate'],
                ['health_insurance', '#netHealthInsuranceRate'],
                ['unemployment_insurance', '#netUnemploymentInsuranceRate'],
                ['social_insurance_company', '#netSocialInsuranceRateCompany'],
                ['health_insurance_company', '#netHealthInsuranceRateCompany'],
                ['unemployment_insurance_company', '#netUnemploymentInsuranceRateCompany'],
            ];
            _.map(rateArr, function(a){
                val = pit.SingletonModel.settingModel.get(a[0]);
                self.$el.find(a[1]).html(val+"%");
            });
        },
        validate: function() {
            this.model.set(this.name, this.$el.val(), {validate:true});
            this.$msg.text(this.model.errors[this.name] || '');
        },
        doChangeSetting: function(model, value, options){
            this.calculate(options);
            this.renderRating(model, value, options);
        },
        doConvertForeignSalary: function(e){
            var self = this, netForeignSalary = $("#netForeignSalary").asNumber(),
                oldValue = $("#netForeignSalary").prop("old-val");
            if(netForeignSalary > 0 && oldValue != netForeignSalary) {
                $("#netForeignSalary").prop("old-val", netForeignSalary);
                jQuery(e.target).addClass("glyphicon-refresh-animate");
                window.pit.exchangeRate("USD", "VND", netForeignSalary).then(function (resultVal) {
                    window.pit.pasteAndFormatValue($("#netSalary"), resultVal, "number");
                    jQuery(e.target).removeClass("glyphicon-refresh-animate");
                    $("#netSalary").trigger("change");
                });
            }
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
            if(pit.isMobile()){
                var data = JSON.stringify(self.$el.find('form').serializeObjectAsNumber());
                self.model.set(data);
            }
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
                $includeUnemploymentInsurance = this.model.get('include_unemployment_insurance'),
                $socialInsPercent = parseFloat(settingModel.get('social_insurance')),
                $healthInsPercent = parseFloat(settingModel.get('health_insurance')),
                $unEmploymentInsPercent = parseFloat(settingModel.get('unemployment_insurance'));

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

            var totalInsurancePer = $socialInsPercent + $healthInsPercent + $unEmploymentInsPercent,
                $netSalaryBeforePITPer100 = 0,
                $maxRangeAfterInsurance = $maxRange * (totalInsurancePer / 100 );
            if($netSalaryBeforePITVal > $maxRangeAfterInsurance){
                $netSalaryBeforePITPer100 = $maxRange / 100;
            }else{
                $netSalaryBeforePITPer100 = $netSalaryBeforePITVal / (100 - totalInsurancePer);
            }

            // Social Insurance
            var $grossSocialInsurance = $("#netSocialInsurance"),
                $grossSocialInsuranceVal = $netSalaryBeforePITPer100 * $socialInsPercent;
            this.pasteValue($grossSocialInsurance, $grossSocialInsuranceVal, 'number');

            // Heath Insurance
            var $healthInsurance = $("#netHealthInsurance"),
                $grossHealthInsuranceVal = $netSalaryBeforePITPer100 * $healthInsPercent;
            this.pasteValue($healthInsurance, $grossHealthInsuranceVal, 'number');

            // Unemployment Insurance
            var $unemploymentInsurance = $("#netUnemploymentInsurance"),
                $unemploymentInsuranceVal = 0;
            if($includeUnemploymentInsurance){
                $unemploymentInsuranceVal = $netSalaryBeforePITPer100 * $unEmploymentInsPercent;
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
