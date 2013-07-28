var utils = function($) {
    var me = {};
    
    /*
    * @desc retrieve query string value from url
    * @typeof(string) url - url from which we extract the query string param
    * @typeof(string) name - name of the query string param we want to retrieve
    * @typeof(string) return - value of the query string param
    */
    me.getQueryStringParameter = function (url, name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(url);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    /*
    * @desc encode html string
    * @typeof(string) str - string we want to encode for safety
    * @typeof(string) return - encoded string
    */
    me.htmlEscape = function(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    /*
    * @desc decode html string
    * @typeof(string) str - encoded string we want to decode
    * @typeof(string) return - decoded string
    */
    me.htmlUnescape = function(value) {
        return String(value)
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    };

    return me;

}(jQuery);