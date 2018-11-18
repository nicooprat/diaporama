var yt = require('youtube.get-video-info')

exports.handler = function(event, context, callback) {
  const videoID = event.queryStringParameters.v

  if(!videoID) {
    callback('Video ID is required', {statusCode: 500})
    return
  }

  yt.retrieve(videoID, function(err, res) {
    if (err) {
      callback(err, {statusCode: 500})
      return
    } else if (res.status === 'fail') {
      callback(res.reason, {statusCode: 500})
      return
    } else {
      const captions = JSON.parse(res.player_response).captions.playerCaptionsTracklistRenderer.captionTracks
      const streams = res.url_encoded_fmt_stream_map

      callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
        body: JSON.stringify({
          captions,
          streams
        })
      })
    }
  })
}


