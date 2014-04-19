/*global beforeEach, describe, it, assert, expect  */
(function () {
	'use strict';

	describe('SettingModel::', function () {
        var settingModel = new pit.Models.SettingModel();
	    beforeEach(function () {
	        //this.SettingModel = new .Models.Setting();
	    });

	    it('#defaultValueJson', function(){    	
	    	//expect(settingModel.get("social_insurance")).to.equal("8");
	    	
	    	var defaultValueJs = {
                social_insurance : '8',
                health_insurance : '1.5',
                unemployment_insurance : '1',
                max_range : '23000000',
                deduction : '9000000',
                deduction_each_dependant : '3600000'
            }            
	    	expect(settingModel.get("social_insurance")).to.equal(defaultValueJs.social_insurance);
	    })

	    it('#toNumberFormat()', function(){
	    	var defaultValueNumberFormat = {
                social_insurance : '8.0',
                health_insurance : '1.5',
                unemployment_insurance : '1.0',
                max_range : '23,000,000.0',
                deduction : '9,000,000.0',
                deduction_each_dependant : '3,600,000.0'
            }
    		expect(settingModel.toNumberFormat().max_range).to.equal(defaultValueNumberFormat.max_range);
	    });

        describe('PitRate::', function () {
            it('Process PitRate with 5.000.000, 10.000.000, 15.000.000, 20.000.000, 30.000.000', function(){
                expect(settingModel.process_pit_rate(5000000,2014)).to.equal(250000);
                expect(settingModel.process_pit_rate(10000000,2014)).to.equal(750000);
                expect(settingModel.process_pit_rate(15000000,2014)).to.equal(1500000);
                expect(settingModel.process_pit_rate(20000000,2014)).to.equal(2350000);
                expect(settingModel.process_pit_rate(30000000,2014)).to.equal(4350000);
            })
            it('Revert PitRate with with 4.750.000, 9.250.000, 13.500.000, 17.650.000, 25.650.000', function(){
                expect(settingModel.process_revert_pit_rate(4750000,2014)).to.equal(250000);
                expect(settingModel.process_revert_pit_rate(9250000,2014)).to.equal(750000);
                expect(settingModel.process_revert_pit_rate(13500000,2014)).to.equal(1500000);
                expect(settingModel.process_revert_pit_rate(17650000,2014)).to.equal(2350000);
                expect(settingModel.process_revert_pit_rate(25650000,2014)).to.equal(4350000);
            })
        });
	});
})();

