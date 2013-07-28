using System.IO;
using System.Linq;
using System.Net;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using YoutubeExtractor;

namespace YouTubeStream
{
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class Video : IVideo
    {
        /// <summary>
        /// Load the youtube video mp4 stream for the requested video
        /// </summary>
        /// <param name="v">Video id of the video we want to stream</param>
        /// <returns></returns>
        public Stream Stream(string v)
        {
            // configure the response format
            if (WebOperationContext.Current == null) return null;
            WebOperationContext.Current.OutgoingResponse.ContentType = "video/mp4";

            // decode the stream urls
            var videoUrl = DecodeVideoUrl(v);
            if (string.IsNullOrEmpty(videoUrl)) return null;

            // create the web request to communicate with the back-end site
            var request = CreateYoutubeRequest(videoUrl);

            // stream to the client
            var videoStream = GetYouTubeVideoStream(request);

            return videoStream;
        }

        /// <summary>
        /// Return raw url where a mp4 video stream could be found
        /// </summary>
        /// <param name="videoId"></param>
        /// <returns></returns>
        private string DecodeVideoUrl(string videoId)
        {
            var youtubeUrl = string.Format(@"http://www.youtube.com/watch?v={0}", videoId);
            var videoInfos = DownloadUrlResolver.GetDownloadUrls(youtubeUrl);
            var videoUrl = videoInfos.Where(x => x.VideoType == VideoType.Mp4).Select(x => x.DownloadUrl).FirstOrDefault();
            return videoUrl;
        }

        /// <summary>
        /// Create valid request sto we can get the video stream
        /// </summary>
        /// <param name="videoUrl"></param>
        /// <returns></returns>
        private HttpWebRequest CreateYoutubeRequest(string videoUrl)
        {
            var request = (HttpWebRequest) WebRequest.Create(videoUrl);
            request.AllowAutoRedirect = true;
            request.Method = @"GET";
            request.ContentType = WebOperationContext.Current.IncomingRequest.ContentType;
            request.UserAgent = @"Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405";

            // the Remote-User header is non-ideal; included for compatibility
            foreach (string each in WebOperationContext.Current.IncomingRequest.Headers)
            {
                if (WebHeaderCollection.IsRestricted(each) || each == "Remote-User") continue;
                request.Headers.Add(each, WebOperationContext.Current.IncomingRequest.Headers.Get(each));
            }

            return request;
        }

        /// <summary>
        /// Retrieve the video response
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private Stream GetYouTubeVideoStream(HttpWebRequest request)
        {
            try
            {
                var response = (HttpWebResponse)request.GetResponse();
                WebOperationContext.Current.OutgoingResponse.ContentType = response.ContentType;
                WebOperationContext.Current.OutgoingResponse.ContentLength = response.ContentLength;
                return response.GetResponseStream();
            }
            catch (System.Net.WebException we)
            {
            }

            return null;          
        }

    }
}
