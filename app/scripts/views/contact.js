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
            var data = this.$el.find('form').serializeObject();
            this.model.set(data);
            var isValid = this.model.isValid(true);
            if(isValid){
                this.$('.alert-success').fadeIn();
            }
            else {
                this.$('.alert-danger').fadeIn();
            }
            return false;
        }
    });

})();
