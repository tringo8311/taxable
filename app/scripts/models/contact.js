/*global pit, Backbone*/

pit.Models = pit.Models || {};

(function () {
    'use strict';

    pit.Models.ContactModel = Backbone.Model.extend({

        url: '',

        initialize: function() {
            this.on("invalid",function(model,error){
                alert(error);
            });
        },

        defaults: {
            fullname: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        },
        validation: {
            fullname: {
              required: true,
              msg: 'Please provide your full name'
            },            
            email: [{
                required: true,
                msg: 'Please provide your email'
                },{
                pattern: 'email',
                msg: 'Email provided is not correct'
            }],
            phone: [
                {
                    pattern: /\s*((\d{3})-(\d{3})-(\d{4}))|\d{9,10}\s*/g,
                    msg: 'Phone provided is not correct'
                }
            ],
            subject: {
                required: true,
                msg: 'Please provide your subject'
            },
            message: {
                required: true,
                msg: 'Please provide your message'
            }
        },
        /*validate: function(attrs, options) {
            var errors = this.errors = {};
            if(attrs.name != null) {
            if (!attrs.name) {
                errors.name = 'Name is required';
                console.log('first name isEmpty validation called');
            }
            else if(!this.validators.minLength(attrs.name, 2))
                errors.name = 'Name is too short';
            else if(!this.validators.maxLength(attrs.name, 15))
                errors.name = 'Name is too large';
            else if(this.validators.hasSpecialCharacter(attrs.name))
                errors.name = 'Name cannot contain special characters';
            }
            if(attrs.email != null) {
                if (!attrs.email) {
                    errors.email = 'Email is required';
                    console.log('Email isEmpty validation called');
                }
            }
        },*/

        parse: function(response, options)  {
            return response;
        }
    });

})();
