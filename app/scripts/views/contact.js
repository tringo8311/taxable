/*global pit, Backbone, JST*/

pit.Views = pit.Views || {};

(function () {
    'use strict';

    pit.Views.ContactView = Backbone.View.extend({
        template: JST['app/scripts/templates/contact.ejs'],
        events: {
            'submit form' : 'doSubmit'
		},
        initialize: function(){
            //if you put this code inside a view, the view will now listening to its model change event
            this.render();
        },
        render: function () {
            // Format number
            //console.log(this.model.toNumberFormat());
			this.$el.html(this.template(this.model));
            this.$(".map figure").gmaps({
                address: this.$(".address").text()
            });
            Backbone.Validation.bind(this, {
                valid: function(view, attr, selector) {
                    var $el = view.$('[name=' + attr + ']'), 
                        $group = $el.closest('.form-group');
                    
                    $group.removeClass('has-error');
                    $group.find('.help-block').html('').addClass('hidden');
                },
                invalid: function(view, attr, error, selector) {
                    var $el = view.$('[name=' + attr + ']'), 
                        $group = $el.closest('.form-group');
                    
                    $group.addClass('has-error');
                    $group.find('.help-block').html(error).removeClass('hidden');
                }
            });
			return this;
		},
        doSubmit: function(evt){
            evt.preventDefault();
            var self = this;
            var data = self.$el.find('form').serializeObject();
            var actionUrl = self.$el.find('form').attr('action');
            actionUrl += "?time="+new Date().getTime();
            self.model.set(data);
            var isValid = self.model.isValid(true);
            if(isValid){
                this.$('.alert-danger').hide();
                self.$('.alert-success').fadeIn();
                // Send email
                $.post(actionUrl, data, function(response){
                    self.$('.alert-success').hide();
                    //self.$el.find("form").reset();
                    pit.dialogModal("Alert", response.message);
                });
            } else {
                this.$('.alert-success').hide();
                this.$('.alert-danger').fadeIn();
            }
            return false;
        }
    });

})();
