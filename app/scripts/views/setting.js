/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.SettingView = Backbone.View.extend({
        template: JST['app/scripts/templates/setting.ejs'],
        events: {
			'change input.currency': 'modify',
            'change input.numeric': 'modify',
			'submit form': 'save'
		},
        initialize: function(){
            this.render();
        },
        render: function () {
            var $this = this;
			this.$el.html(this.template(this.model.toNumberFormat()));
            if(pit.isMobile()){
                this.$el.find('input.currency').on("blur", function(){
                    $(this).formatCurrency({
                        colorize:true,
                        symbol: "",
                        decimalSymbol: pit.SingletonModel.settingModel.format.decimalSymbol,
                        digitGroupSymbol: pit.SingletonModel.settingModel.format.digitGroupSymbol
                    });
                });
            }else{
                this.$el.find('input.currency').formatCurrencyLive({
                    colorize:true,
                    symbol: "",
                    decimalSymbol: pit.SingletonModel.settingModel.format.decimalSymbol,
                    digitGroupSymbol: pit.SingletonModel.settingModel.format.digitGroupSymbol
                });
            }
            this.$el.find('.action-pit-rate').popover({
                trigger : 'click',
                html : true,
                content : function(){
                    var result = $("<ul class='list-group'/>");
                    var template = _.template("<li class='list-group-item clearfix'><%= label %><span class='badge badge-success'><%= rate %>%</span></li>");
                    _.each(pit.SingletonModel.settingModel.pit_rates(null), function(item){
                        result.append(template(item));
                    });
                    return result.html();
                }
            }).on('show.bs.popover', function(){
                //console.log($(this).data('popover'));
                //$(this).data('popover').css({"width" : 450});
            }).on('hidden.bs.popover', function () {
                $(this).next().remove();
            });
			return this;
		},
        modify: function(e){
            var self = this, valRaw = null;
            valRaw = $.trim(e.target.value);
            if(valRaw!=""){
                valRaw = $(e.target).asNumber();
            }
            self.model.set(e.target.name, valRaw);
        }
    });

})();
