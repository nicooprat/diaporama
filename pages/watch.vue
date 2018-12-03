<template>
  <article v-if="video">
    <Watch/>
    <Details/>
  </article>
</template>

<script>
import { mapState } from 'vuex'
import Watch from '~/components/Watch';
import Details from '~/components/Details';

export default {
  components: {
    Watch,
    Details,
  },
  computed: mapState(['video', 'captions', 'lang']),
  watchQuery: ['page'],
  head() {
    return {
      title: this.video.details.title.replace(/\+/g, ' '),
    }
  },
  async fetch({route, store, redirect, error}) {
    if(!route.query.v)  {
      return error({
        statusCode: 500,
        message: 'This doesn\'t look like a Youtube video'
      })
    }

    let video, captions

    try {
      video = await store.dispatch('getVideo', route.query.v)
    } catch(e) {
      return error({
        statusCode: 500,
        message: 'This video is unavailable'
      })
    }

    if(!video.captions) {
      return error({
        statusCode: 500,
        message: 'No caption for this video'
      })
    }

    try {
      captions = await store.dispatch('getCaptions', {
        videoID: route.query.v,
        lang: store.state.lang || video.captions[0].languageCode
      })
    } catch(e) {
      return error({
        statusCode: 500,
        message: 'Can\'t load captions'
      })
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

