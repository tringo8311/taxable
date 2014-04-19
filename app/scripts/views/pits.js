/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.PitsView = Backbone.View.extend({
        template: JST['app/scripts/templates/pits.ejs'],
        events: {
			'click a#pitCalculate': 'calculate',
			'click a#pitExport': 'export2CSV'
		},
        initialize: function () {
			this.render();

			this.listenTo(this.collection, 'add', this.addPITItem);
			this.listenTo(this.collection, 'reset', this.addAllPITItems);
            this.listenTo(this.collection, "change:income_paid_tax", this.doChangeResult);

			this.collection.fetch();
		},
        render: function () {
			this.$el.html(this.template());
            this.$el.find("table tbody").append(this.collection.map(function (item) {
                return new pit.Views.PitView({model: item}).render().$el;
            }));
			return this;
		},
        calculate: function(evt){
            this.doChangeResult(null, null, null);
            return false;
        },
        export2CSV: function(evt){
            var d = this;
            var characters = d.collection;
            var keys = _.chain(characters.first().attributes).keys().value();
            var cols = [], csv = keys.join(',')+'\n';

            csv += characters.map(function(item) {
                cols = [];
                _.each(keys, function(key) {
                    cols.push(item.get(key))
                });
                return cols.join(',');
            }).join('\n');

            // Render total row
            csv += "\n";
            cols = [];
            _.each(keys, function(key) {
                cols.push(d.collection.totalModel.get(key));
            });
            csv += cols.join(',');
            // Data URI
            var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
            $(evt.target).attr({'download': "pit_export.csv", 'href': csvData, 'target': '_blank'});

            return true;
        },
        reset: function(evt){

        },
        doChangeResult: function(model, value, options){
            var settingModel = pit.SingletonModel.settingModel;
            var totalGross = 0,totalBonus = 0, totalInsurancePaidTotal = 0, totalDependantsPaid = 0, totalPITPaid = 0, totalDeductionOfTaxPayerTotal = 0, totalIncomePaidTaxTotal = 0, totalTaxPITTotal = 0;
            var totalPaidPIT = 0, totalIncomePIT = 0, totalPIT = 0, d = new Date();
            //console.dir(this.collection);
            this.collection.forEach(function(item){
                totalGross += item.get('gross');
                totalBonus += item.get('bonus');
                totalInsurancePaidTotal += item.get('insurance_paid');
                totalDependantsPaid += item.get('dependants');
                totalPITPaid += item.get('pit_paid');
                totalDeductionOfTaxPayerTotal += item.get('deduction_of_taxpayer');
                totalIncomePaidTaxTotal += item.get('income_paid_tax');
                //totalIncomePIT += item.get('income_paid_tax');
                totalTaxPITTotal +=  item.get('tax_pit');
                //totalPIT += item.get('tax_pit');
            });
            totalPIT = totalIncomePaidTaxTotal / 12;
            totalPIT = settingModel.process_pit_rate(totalPIT, d.getFullYear());
            totalPIT = totalPIT * 12;

            pit.pasteAndFormatValue(this.$el.find('#tax-pit-paid-total'), totalPITPaid);
            pit.pasteAndFormatValue(this.$el.find('#tax-pit-total'), totalPIT);
            if((totalPITPaid - totalPIT) > 0){
                this.$el.find('#tax-pit-result').removeClass('badge-warning').addClass('badge-success');
            }else{
                this.$el.find('#tax-pit-result').removeClass('badge-success').addClass('badge-warning');
            }
            pit.pasteAndFormatValue(this.$el.find('#tax-pit-result'), totalPITPaid - totalPIT);

            // Total PIT
            this.collection.totalModel.set('gross', totalGross);
            pit.pasteAndFormatValue(this.$el.find('#pit-gross-total'), totalGross);
            this.collection.totalModel.set('bonus', totalBonus);
            pit.pasteAndFormatValue(this.$el.find('#pit-bonus-total'), totalBonus);
            this.collection.totalModel.set('insurance_paid', totalInsurancePaidTotal);
            pit.pasteAndFormatValue(this.$el.find('#pit-insurance-paid-total'), totalInsurancePaidTotal);
            this.collection.totalModel.set('dependants', totalDependantsPaid);
            pit.pasteAndFormatValue(this.$el.find('#pit-dependants-total'), totalDependantsPaid);
            this.collection.totalModel.set('pit_paid', totalPITPaid);
            pit.pasteAndFormatValue(this.$el.find('#pit-pit-paid-total'), totalPITPaid);
            this.collection.totalModel.set('deduction_of_taxpayer', totalDeductionOfTaxPayerTotal);
            pit.pasteAndFormatValue(this.$el.find('#pit-deduction-of-taxpayer-total'), totalDeductionOfTaxPayerTotal);
            this.collection.totalModel.set('income_paid_tax', totalIncomePaidTaxTotal);
            pit.pasteAndFormatValue(this.$el.find('#pit-income-paid-tax-total'), totalIncomePaidTaxTotal);
            this.collection.totalModel.set('tax_pit', totalTaxPITTotal);
            pit.pasteAndFormatValue(this.$el.find('#pit-tax-pit-total'), totalTaxPITTotal);

            return false;
        },
        addPITItem: function (item) {
			var view = new pit.Views.PitView({ model: item });
			this.$('table tbody').append(view.render().el);
		},

		addAllPITItems: function () {
			this.collection.each(this.addPITItem, this);
		}
    });

})();
