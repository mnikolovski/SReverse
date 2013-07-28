using System.IO;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace YouTubeStream
{
    [ServiceContract]
    public interface IVideo
    {
        /// <summary>
        /// Load the youtube video mp4 stream for the requested video
        /// </summary>
        /// <param name="v">Video id of the video we want to stream</param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(UriTemplate = "Stream/{v}", Method = "GET")]
        Stream Stream(string v);
    }
}
