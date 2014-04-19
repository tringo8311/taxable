/*global beforeEach, describe, it, assert, expect  */
(function () {
	'use strict';

	describe('Gross View', function () {
		var settingModel = new pit.Models.SettingModel();
		var grossModel = new pit.Models.GrossModel();
		var grossView = new pit.Views.GrossView({model : grossModel});

	    beforeEach(function () {
	        //this.GrossView = new .Views.Gross();
	    });

	    describe('Process Result', function () {
	    	grossModel.set("gross_salary", 20000000);
		    it('Check Net Salary', function(){
		    	//console.log(grossView.calculate());
				expect(grossView.calculate(null)).to.equal(1739500);	
			});
		});
	});
})();
