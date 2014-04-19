/*global describe, it */
'use strict';
(function () {
    describe('global testing ', function () {

        //var SettingModel = require(models/setting);
        describe('Setting context here', function () {
            //var settingM = new .Models.SettingModel();
            it('should run here few assertions', function () {
                //expect(settingM).to.exist();
            });

            it('Test Setting default\'s value', function(){
               //expect(settingM.social_insurance).toBe(8);
               //var settingM = new .Models.Setting();
               //expect(settingM.social_insurance).toBe(8);               
            });

            it('should be incrementing in value', function(){
                var count = 0;
                count++;
                expect(count).to.equal(2);
            });
        });
    });
})();
