var getSubtitles = require('youtube-captions-scraper').getSubtitles

exports.handler = async function(event, context, callback) {
  try {
    const videoID = event.queryStringParameters.v || null

    if(!videoID) {
      throw 'Video ID is required'
      return
    }

    const lang = event.queryStringParameters.l || 'en'
    const captions = await getSubtitles({
      videoID,
      lang
    })

    if(!captions) {
      throw 'No captions found'
      return
    }

    const headers = process.env.npm_lifecycle_event === 'start:lambda' ? {
      'Access-Control-Allow-Origin': '*'
    } : {}

    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(captions)
    })
  } catch(e) {
    callback(e)
  }
}
