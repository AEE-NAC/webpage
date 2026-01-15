(function() {
    function getURLParams() {
        var params = {};
        window.location.search.substring(1).split('&').forEach(function(param) {
            var pair = param.split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        });
        return params;
    }

    function performAction(params) {
        if (params.rel) {
            var div = document.getElementById(params.rel);
            //scroll on them  
            var top = div.offsetTop;
            window.scrollTo(0, top);
        }
        if (params.action) {
            var fn = window[params.action];
            if (typeof fn === 'function') {
                console.log('Performing action: ' + params.action);
                var fnParams = params.fnParams ? JSON.parse(params.fnParams) :null;
                fn(fnParams);
            }
        }
    }

    window.addEventListener('DOMContentLoaded', function() {
        var params = getURLParams();
        performAction(params);
    });

    window.launchEvent = function(baseURL, rel, action, fnParams) {
        var url = baseURL || window.location.origin + window.location.pathname;
        var params = [];
        if (rel) params.push('rel=' + encodeURIComponent(rel));
        if (action) params.push('action=' + encodeURIComponent(action));
        if (fnParams) params.push('fnParams=' + encodeURIComponent(JSON.stringify(fnParams)));
        return url + '?' + params.join('&');
    };
})();