/*global pit, $*/

var dataConst = [];
var demoPits = [];

demoPits.push({
	title: 'Jan',
	gross: 0,
	bonus: 0,
	insurance_paid: 0,
	dependants: 0,
	pit_paid: 0,
	deduction_of_taxpayer: 4000000
});
demoPits.push({
	title: 'Feb',
	gross: 0,
	bonus: 0,
	insurance_paid: 0,
	dependants: 0,
	pit_paid: 0,
	deduction_of_taxpayer: 4000000
});
demoPits.push({
	title: 'Mar',
	gross: 0,
	bonus: 0,
	insurance_paid: 0,
	dependants: 0,
	pit_paid: 0,
	deduction_of_taxpayer: 4000000
});
demoPits.push({
	title: 'Apr',
	gross: 0,
	bonus: 0,
	insurance_paid: 0,
	dependants: 0,
	pit_paid: 0,
	deduction_of_taxpayer: 4000000
});
demoPits.push({
	title: 'May',
	bonus: 150000,
	gross: 10000000,
	insurance_paid: 0,
	dependants: 0,
	pit_paid: 1599457,
	deduction_of_taxpayer: 4000000
});
demoPits.push({
	title: 'Jun',
	gross: 10000000,
	bonus: 150000,
	insurance_paid: 0,
	dependants: 0,
	pit_paid: 3580000,
	deduction_of_taxpayer: 4000000
});
demoPits.push({
	title: 'Jul',
	gross: 10000000,
	bonus: 150000,
	insurance_paid: 300000,
	dependants: 0,
	pit_paid: 1899098,
	deduction_of_taxpayer: 9000000
});
demoPits.push({
	title: 'Aug',
	gross: 10000000,
	bonus: 150000,
	insurance_paid: 300000,
	dependants: 0,
	pit_paid: 2143000,
	deduction_of_taxpayer: 9000000
});
demoPits.push({
	title: 'Sep',
	gross: 10000000,
	bonus: 150000,
	insurance_paid: 300000,
	dependants: 0,
	pit_paid: 2143000,
	deduction_of_taxpayer: 9000000
});
demoPits.push({
	title: 'Oct',
	gross: 10000000,
	bonus: 300000,
	insurance_paid: 3000000,
	dependants: 0,
	pit_paid: 3000000,
	deduction_of_taxpayer: 9000000
});
demoPits.push({
	title: 'Nov',
	gross: 10000000,
	bonus: 150000,
	insurance_paid: 300000,
	dependants: 0,
	pit_paid: 300000,
	deduction_of_taxpayer: 9000000
});
demoPits.push({
	title: 'Dec',
	gross: 10000000,
	bonus: 150000,
	insurance_paid: 300000,
	dependants: 0,
	pit_paid: 3000000,
	deduction_of_taxpayer: 9000000
});
var supportPlatform = [
    {
        dimension: 280,
        text: 'Desktop',
        percent: '95',
        info: '12 Apr, 2014',
        colorfg : "#35C5EF"
    },
    {
        dimension: 280,
        text: 'Tablet',
        percent: '80',
        info: '25 Apr, 2014',
        colorfg : "#F53477"
    },
    {
        dimension: 280,
        text: 'Smart-phone',
        percent: '60',
        info: '05 May, 2014',
        colorfg : "#89C137"
    }
];
var AppRouter = null;
window.pit = {
    CurrentUSDRate: '',
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    SingletonModel: {},
    init: function () {
        'use strict';
		this.SingletonModel.settingModel = new this.Models.SettingModel();
        var navMainHeight = $("#navbar-main").height(),
            $this = this;

        AppRouter = Backbone.Router.extend({
            initialize: function (){
                $(".nav a.link-view", "#navbar-main").add(".nav a.link-view", ".footer").on("click", function(e){
                    e.preventDefault();
                    // Remove all class active
                    $("a.link-view", "#navbar-main").removeClass("active");
                    $(this).addClass("active");
                    var hrefLink = e.target.getAttribute('href');
                    Backbone.history.navigate(hrefLink, {trigger:true});
                    //Cancel the regular event handling so that we won't actual change URLs
                    //We are letting Backbone handle routing
                    return false;
                });
            },
            routes: {
                "/": "home",
                "gross_salary": "gross_salary",
                "net_salary": "net_salary",
                "setting": "setting",
                "pit": "pit",
                "extra/:article": "extra",
                "news" : "news",
                "news/:type" : "news",
                "about" : "about",
                "contact" : "contact"
            },
            home : function(){

            },
            gross_salary : function(actions){
                $("section.full-page", "body").hide();
                // Gross View
                var eleId = "#gross-2-net-section";
                if($(eleId).is(':empty'))
                    new $this.Views.GrossView({el : eleId, model: new $this.Models.GrossModel({gross_salary: 20000000, allowances: 0, dependants: 0})});
                $(eleId).show();
                var topPosition = $(eleId).offset().top - navMainHeight;
                $('html, body').animate({scrollTop: topPosition}, 'slow');
                $("[data-toggle='popover']", eleId).popover();
            },
            net_salary : function(actions){
                $("section.full-page", "body").hide();
                // Net View
                var eleId = "#net-2-gross-section";
                if($(eleId).is(':empty'))
                    new $this.Views.NetView({el : eleId,model: new $this.Models.NetModel({net_salary: 20000000, allowances: 0, dependants: 0})});
                $(eleId).show();
                var topPosition = $(eleId).offset().top - navMainHeight;
                $('html, body').animate({scrollTop:topPosition}, 'slow');
                $("[data-toggle='popover']", eleId).popover();
            },
            pit : function(actions){
                $("section.full-page", "body").hide();
                // PIT View
                var eleId = "#pit-section";
                if($(eleId).is(':empty'))
                    new $this.Views.PitsView({el : eleId,collection: dataConst.pits});
                $(eleId).show();
                var topPosition = $(eleId).offset().top - navMainHeight;
                $('html, body').animate({scrollTop:topPosition}, 'slow');
            },
            extra : function(article){
                $("section.full-page", "body").hide();
                var eleId = "#extra-section";
                if($(eleId).is(':empty'))
                    new $this.Views.ExtraView({el : eleId, model: new $this.Models.ExtraModel()});

                $("[data-toggle='popover']", eleId).popover();
                $(eleId).show('horizontal', function(){
                    if(article!=""){
                        eleId = "#extra-" + article;
                    }
                    var topPosition = $(eleId).offset().top - navMainHeight;
                    $('html, body').animate({scrollTop:topPosition}, 'slow');
                });
            },
            setting : function(actions){
                $("section.full-page", "body").hide();
                // Go to Setting
                var eleId = "#setting-section";
                if($(eleId).is(':empty'))
                    new $this.Views.SettingView({el : eleId, model: $this.SingletonModel.settingModel});
                $(eleId).show();

                var topPosition = $(eleId).offset().top - navMainHeight;
                $('html, body').animate({scrollTop:topPosition}, 'slow');
                $("[data-toggle='popover']", eleId).popover({html : true});
            },
            news : function(type){
                // Hide all part page
                $("section.part-page, section.full-page", "body").hide();
                var eleId = "#news-section";
                if($(eleId).is(':empty'))
                    new $this.Views.NewsView({el : eleId});
                $(eleId).show();
            },
            about : function(){
                $("section.part-page, section.full-page", "body").hide();
                var eleId = "#about-section";
                if($(eleId).is(':empty'))
                    new $this.Views.AboutView({el : eleId});
                $(eleId).show();
            },
            contact : function(){
                $("section.part-page, section.full-page", "body").hide();
                var eleId = "#contact-section";
                if($(eleId).is(':empty'))
                    new $this.Views.ContactView({el : eleId, model: new $this.Models.ContactModel()});
                $(eleId).show();
            }
        });
        // Initiate the router
        var app_router = new AppRouter();
        // Start the Backbone push navigation
        Backbone.history.start({
            root: '#',
            pushState: true
        });
        var hash = location.hash;
        if(hash!=""||hash!="#"){
            hash = hash.replace(/#\//g, "#");
            app_router.navigate(hash, true);
        }
        $(".scroll2Top").click(function(){
            pit.scrollToTop();
            return false;
        });
        //$("#addthis-toolbox").myAddThis({url:location.href, title: "Taxable", description: "Support calculate Gross, Net, PITs"});
        // Check browser device by width
        if(!this.isMobile())
            $this.followScroll("#navbar-main");

        $(document).on("click touchstart", function (e) {
            var $popover = $('[data-toggle=popover]').popover({html: true});
            var $target = $(e.target),
                isPopover = $(e.target).is('[data-toggle=popover]'),
                inPopover = $(e.target).closest('.popover').length > 0

            //hide only if clicked on button or inside popover
            if (!isPopover && !inPopover) $popover.popover('hide');
        });

        // Circliful
        /*var templateCirc = _.template('<div class="route-map-item pull-left" data-dimension="<%= dimension %>" data-text="<%= text %>" data-info="<%= info %>" data-width="10" data-fontsize="20" data-percent="<%= percent %>" data-fgcolor="<%= colorfg %>" data-bgcolor="#EDF2F3" data-fill="#fff"></div>');
        _.each(supportPlatform, function(item){
            $("#route-map").append(templateCirc(item));
        });
        $("#route-map .route-map-item").circliful();*/
    },
    pasteAndFormatValue: function(obj, val, type){
        var toFormat = _.string.numberFormat(val, 2);
        if(obj.is("input")){
            obj.val(toFormat);
        }else{
            obj.text(toFormat);
        }
    },
    exchangeRate: function(currency_from, currency_to, currency_input){
        var defer = $.Deferred();
        if(window.pit.CurrentUSDRate == 0){
            var httpGet = function(theUrl){
                var xmlHttp = null;
                xmlHttp = new XMLHttpRequest();
                xmlHttp.open( "GET", theUrl, false );
                xmlHttp.send( null );
                return xmlHttp.responseText;
            }
            var yql_base_url = "https://query.yahooapis.com/v1/public/yql";
            var yql_query = 'select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20("'+currency_from+currency_to+'")';
            var yql_query_url = yql_base_url + "?q=" + yql_query + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
            var http_response = httpGet(yql_query_url);
            var http_response_json = JSON.parse(http_response);
            window.pit.CurrentUSDRate = http_response_json.query.results.rate.Rate;
        }
        setTimeout(function(){
            //console.log(http_response_json.query.results.rate.Rate);
            defer.resolve(parseFloat(window.pit.CurrentUSDRate) * currency_input);
        }, 1000);
        /*var apiExchangeKey = "080767f274fc88ed323295eeeeaa5036a93bfce4";
        var url = "http://currency-api.appspot.com/api/%s/%s.json?key=%s";
        $.ajax({
            dataType: "jsonp",
            type: "GET",
            url: _.str.sprintf(url, from, to, apiExchangeKey),
            async : false
        }).done(function(responseData){
            defer.resolve(responseData.rate);
        });
        $.ajax({
            dataType: "jsonp",
            type: "GET",
            url: "http://rate-exchange.appspot.com/currency",
            data: { from: from, to: to, q: parseInt(inputVal)},
            async : false
        }).done(function(responseData){
            defer.resolve(responseData.v);
        });*/
        return defer.promise();
    },
    // Scroll to top
    scrollToTop: function(){
        $('html, body').animate({scrollTop:0}, 'slow');
    },
    followScroll: function(ele){
        var top = $(ele).offset().top - parseFloat($(ele).css('marginTop').replace(/auto/, 0));
        $(window).scroll(function (event) {
            // what the y position of the scroll is
            var y = $(this).scrollTop();
            // whether that's below the form
            if (y >= top) {
              // if so, ad the fixed class
              $(ele).addClass('isStuck');
            } else {
                // otherwise remove it
                $(ele).removeClass('isStuck');
            }
        });
    },
    dialogModal: function(title, content){
        var taxableModalEle = JST['app/scripts/templates/modal.ejs'];

        if(!$("#taxableModal").length){
            $("body").append(taxableModalEle);
        }
        var taxableModal = $("#taxableModal");
        taxableModal.find('.modal-title').text(title);
        taxableModal.find('.modal-body').html(content);
        taxableModal.modal('show');
    },
    isMobile : function(){
        return (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    }
};

(function (a) {
    function g(b, c) {
        var addthis_share = {
            'url': c.url,
            'title': c.title,
            'description': c.description
        };

        var toolbox = $(b);
        var buttons = {linkedin: 'LinkedIn', facebook: 'Facebook', twitter: 'Tweet', email: 'Email', expanded: 'More'};
        var htmlButtons = "";
        for (var b in buttons) {
            htmlButtons += '<a class="addthis_button_'+ b +' at300b"></a>';
        }
        toolbox.html(htmlButtons);
        addthis.toolbox(b, {}, addthis_share);
    }
    var b = "__addthis__",
        c = "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-533cfacd5b6fba4d" ,
        d = !1,
        e = a(document);
    window[b] = function () {
        d = !0, e.trigger("addthisloaded")
    }, a.getScript(c, function(){
        __addthis__();
    });
    $.fn.serializeArrayAsNumber = function() {
        var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i;
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) && this.checked ;
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).asNumber();
			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val };
		}).get();
	}
    $.fn.serializeObjectAsNumber = function() {
        var o = {};
        var a = this.serializeArrayAsNumber();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    a.fn.myAddThis = function (b) {
        var c = a.extend({}, b),h = this;
        d ? g(h, c) : e.bind("addthisloaded", function () {
            g(h, c)
        });
        return this;
    }
})(jQuery);

(function (a) {
    function g(b, c) {
        var d = new google.maps.Geocoder;
        d.geocode({
            address: c.address
        }, function (d, e) {
            if (e == google.maps.GeocoderStatus.OK) {
                var f = d[0].geometry.location;
                a.each(b, function (a, b) {
                    var d = new google.maps.Map(b, {
                        zoom: c.zoom,
                        center: f,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scrollwheel: c.scrollwheel,
                        mapTypeControl: c.mapTypeControl
                    }), e = new google.maps.Marker({
                            map: d,
                            position: f
                        })
                })
            }
        })
    }
    var b = "__jquerygmaps__",
        c = "http://maps.google.com/maps/api/js?v=3.3&sensor=false&callback=" + b,
        d = !1,
        e = a(document);
    window[b] = function () {
        d = !0, e.trigger("gmapsloaded")
    }, a.getScript(c);
    var f = {
        zoom: 13,
        scrollwheel: !1,
        mapTypeControl: !1
    };
    a.fn.gmaps = function (b) {
        var c = a.extend({}, f, b), h = this;
        d ?
        g(h, c) : e.bind("gmapsloaded", function () {
            g(h, c)
        });
        return this;
    }
})(jQuery);

(function (a) {
    a.fn.serializeObject = function(){
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

$(document).ready(function () {
    'use strict';
    dataConst.pits = new pit.Collections.PitsCollection();
    _.each(demoPits, function(item){
        dataConst.pits.push(new pit.Models.PitModel(item));
    });

    pit.init();
});
