/**
 * Register a bootstrap object in a namespace:
 * 
 * <script>app.bootstraps.register(object, 'namespace');</script>
 *
 * Execute objects within a namespace:
 * 
 * <script>app.bootstraps.init(['namespace1', 'namespace2']);</script>
 */

/*
 | Namespace
 */
var app = window.App = { bootstraps: { global: {} }, utils: {} };

(function($) {
    "use strict";

    /*
     | Set the base url.
     */
    app.setBaseUrl = function(url) {
        app.url = url;
    };

    /*
     | Get the base url.
     */
    app.getBaseUrl = function(url) {
        return app.url;
    };

    /*
     | Method to register bootstraps.
     */
    app.bootstraps.register = function(callables, namespace) {
        if (namespace && ! app.bootstraps[namespace]) {
            app.bootstraps[namespace] = {};
        } else {
            namespace = 'global';
        }

        $.extend(app.bootstraps[namespace], callables);
    };

    /*
     | Method to call bootstraps
     */
    app.bootstraps.init = function(namespaces) {
        $(function() {
            for (var namespace in namespaces) {
                for (var callable in app.bootstraps[namespaces[namespace]]) {
                    app.bootstraps[namespaces[namespace]][callable]();
                }
            }
        });
    };

    /*
     | Are we at the page bottom?
     */
    app.utils.isPageBottom = function() {
        var pageBottom = $('.content').height() - $(window).height() - 50;
        return $(window).scrollTop() > pageBottom;
    };

}(jQuery));

app.utils.isIOS = function() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

/*
 | Function call throttler
 */
app.utils.throttle = function(fn, threshhold, scope) {
    var last;
    var deferTimer;

    if (! threshhold) {
        threshhold = 250;
    }

    return function () {
        var context = scope || this;
        var now = +new Date();
        var args = arguments;

        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
app.utils.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Read, Write & Erase Cookies
app.utils.cookies = {
    set: function(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    },
    get: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
    destroy: function(name) {
        createCookie(name,"",-1);
    }
};

// Format currecy
Number.prototype.toCurrency = function(c, d, t){
var n = this, s, i, j;
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? "." : d;
    t = t === undefined ? "," : t; 
    s = n < 0 ? "-" : "";
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "";
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };