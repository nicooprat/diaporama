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
      const playerResponse = JSON.parse(res.player_response)
      const captions = playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks.filter(c => c.kind !== 'asr')
      const streams = playerResponse.streamingData.formats
      const details = playerResponse.videoDetails

      const headers = process.env.npm_lifecycle_event === 'start:lambda' ? {
        'Access-Control-Allow-Origin': '*'
      } : {}

      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          captions,
          streams,
          details: {
            title: details.title,
            author: details.author,
            videoId: details.videoId,
          }
        })
      })
    }
  })
}


