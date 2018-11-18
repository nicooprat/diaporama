<template>
  <Video :captions="captions" :videoID="videoID" :video="video"/>
</template>

<script>
import axios from 'axios';
import Video from '~/components/Video';

export default {
  components: {
    Video,
  },
  data() {
    return {
      videoID: this.$route.query.v,
      video: '',
      captions: ''
    }
  },
  async asyncData(context) {
    const prefix = process.env.NODE_ENV === 'development' ? 'http://10.0.0.44:9000' : '/.netlify/functions'
    const videoID = context.route.query.v
    const lang = context.route.query.l || ''
    const video = await axios.get(`${prefix}/video?v=${videoID}&l=${lang}`)
    const captions = await axios.get(`${prefix}/captions?v=${videoID}&l=${lang}`)
    return {
      video: video.data,
      captions: captions.data
    }
  }
}
</script>

<style>

</style>

