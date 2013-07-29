<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="YouTubeStream.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href='http://fonts.googleapis.com/css?family=Roboto:400,900' rel='stylesheet' type='text/css' />
    <link href="content/css/main.css" rel="stylesheet" />
    <link href="script/jquery-autocomplete/jquery.autocomplete.css" rel="stylesheet" />
    <link href="script/video-js/video-js.min.css" rel="stylesheet" />
</head>
<body>
    <div id="top-bar-wrapper">
        <div id="logo"></div>
        <div id="name"><p id="namep">S-Reverse</p></div>
        <div class="light">
            <span>
                <input id="search" type="text" class="search" /></span>
        </div>
    </div>
    <div>
        <h3 id="currentTitle"></h3>
        <video id="flowplayer" class="video-js vjs-default-skin" width="640" height="390" data-setup="{}">
        </video>
        <div id="related"></div>
    </div>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script src="script/jquery-autocomplete/lib/jquery.ajaxQueue.js"></script>
    <script src="script/jquery-autocomplete/lib/thickbox-compressed.js"></script>
    <script src="script/jquery-autocomplete/jquery.autocomplete.js"></script>
    <script src="script/video-js/video.js"></script>
    
    <script src="script/utils.js"></script>    
    <script src="script/videoproxy.js"></script>

    <script>
        $(function() {
            videoproxy.init();
        });
    </script>
</body>
</html>
