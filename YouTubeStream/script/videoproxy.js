var videoproxy = function($, utl) {
    var me = {};

    /************************
    * VARS
    ************************/

    var myPlayer;
    var youtubeSearchApiUrl = "https://gdata.youtube.com/feeds/api/videos?alt=json&max-results=10&prettyprint=true&fields=entry(id),entry(title),entry(content),entry(link),entry(media:group(media:thumbnail(@url)))&";
    var youtubeSearchRelatedApiUrl = "http://gdata.youtube.com/feeds/api/videos/{0}/related?v=2&alt=json&max-results=5&prettyprint=true&fields=entry(id),entry(title),entry(content),entry(link),entry(media:group(media:thumbnail(@url)))";
    var proxyUrl = 'Video.svc/Stream/';
    
    /************************
    * GENERAL
    ************************/
    
    /*
    * @desc configure the ajax requests for cors
    */
    function configureRequests() {
        $.support.cors = true;
    }

    /*
    * @desc configure the video player
    */
    function configureVideoProxy() {
        if (!videojs) return;
        _V_.options.techOrder = ["html5"];
        _V_.options.flash.swf = "script/video-js/video-js.swf";
        myPlayer = videojs("flowplayer", { "controls": true, "autoplay": true, "preload": "auto", playerFallbackOrder: ["flash", "html5", "links"] });
    };

    /*
    * @desc attach page events
    */
    function attachEvents() {
        $('body').on('click', '.related-entry', onRelatedVideoSelectedValueChange);
    };

    /************************
    * AUTOCOMPLETE REGION
    ************************/

    /*
    * @desc initialize the autocomplete dialog
    */
    function initAutocomplete() {
        var ac = $("#search").autocomplete(youtubeSearchApiUrl, {
            width: 660,
            max: 4,
            highlight: false,
            scroll: true,
            scrollHeight: 300,
            formatItem: autocompleteFormatItem,
            formatResult: autocompleteFormatResult
        });
        ac.result(onAutocompleteSelectedValueChange);
    };
    
    /*
    * @desc format the displayed autocomplete data
    */
    function autocompleteFormatItem(data) {
        var title = data.title.$t;
        var content = data.content.$t;
        var thumbUrl = data.media$group.media$thumbnail[1].url;
        
        var res = "<table border='0' width='100%' cellpadding='3' cellspacing='3'><tr><td rowspan='2' style='width:120px; height:90px;padding: 5px;'>" + "<img src='" + thumbUrl + "' width=120 height=90/></td>" + "<td style='border-bottom:1px solid #e5e5e5'>" + title + "</td></tr><tr><td style='vertical-align: top;'>" + content + "</td></tr></table>";
        return res;
    }

    /*
    * @desc format the selected video result in the input search
    */
    function autocompleteFormatResult(data) {
        return data.title.$t;
    }

    /*
    * @desc event fired when the user picks a video from the autocomplete
    */
    function onAutocompleteSelectedValueChange(e, data) {
        loadVideo(data);
        loadRelated(data);
    }

    /*
    * @desc event fired when the user picks a video from the related videos list
    */
    function onRelatedVideoSelectedValueChange() {
        var videTitle = utils.htmlUnescape($(this).attr('title'));
        var videUrl = $(this).attr('href');

        var data = {};
        data.title = {};
        data.title.$t = videTitle;
        data.link = [];
        data.link.push({ href: videUrl });

        loadVideo(data);
        loadRelated(data);
    }

    /************************
    * VIDEO REGION
    ************************/
    
    /*
    * @desc load the video into the player
    * @typeof(youtube data object) data - youtube search data
    */
    function loadVideo(data) {
        renderVideoInfo(data);
        
        // load the url in the player
        var videoId = utl.getQueryStringParameter(data.link[0].href, 'v');
        var videoUrl = proxyUrl + videoId;
        myPlayer.src({ type: "video/webm", src: videoUrl });
        myPlayer.play();
    };

    /*
    * @desc load related video content next to the current video
    * @typeof(youtube data object) data - youtube search data
    */
    function loadRelated(data) {
        var videoId = utl.getQueryStringParameter(data.link[0].href, 'v');
        var relatedUrl = youtubeSearchRelatedApiUrl.replace("{0}", videoId);
        $.get(relatedUrl, renderRelated);
    };

    /*
    * @desc render the video title, clears the search
    * @typeof(youtube data object) data - youtube search data
    */
    function renderVideoInfo(data) {
        // clear the search result
        $('#search').val('');
        $('#currentTitle').text(data.title.$t);
    }

    /*
    * @desc render the related data
    * @typeof(youtube data object) data - youtube related search data
    */
    function renderRelated(data) {
        var relatedData = data.feed.entry;
        var render = "<table border='0' width='100%' cellpadding='3' cellspacing='3'>";
        for (var i = 0; i < relatedData.length; i++) {
            var entry = relatedData[i];
            var entryVideoId = entry.link[0].href;
            var entryTitle = entry.title.$t;
            var escapedEntryTitle = utils.htmlEscape(entryTitle);

            render = render + "<tr class='related-entry' style='cursor: pointer;' href='" + entryVideoId + "' title='" + escapedEntryTitle + "'><td rowspan='2' style='width:120px; height:90px;padding: 5px;'>" + "<img src='" + entry.media$group.media$thumbnail[1].url + "' width=120 height=90/></td>" + "<td style='font-size:11px; font-weight:bold; position: absolute; width: 120px;'>" + entryTitle + "</td></tr><tr><td style='vertical-align: top;'></td></tr>";
        }
        render = render + '</table>';
        $("#related").html(render);
    }

    me.init = function () {
        configureRequests();
        configureVideoProxy();
        attachEvents();
        initAutocomplete();
    };
    
    return me;
}(jQuery, utils);