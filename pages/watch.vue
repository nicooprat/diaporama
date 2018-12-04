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
  watchQuery: ['v', 'l'],
  async mounted() {
    // Avoid replacing current state if reload or prev/next button
    if( !this.$route.query.i ) {
      this.$store.dispatch('resetState')
    }

    if(!this.$route.query.v) {
      return this.$nuxt.error({
        statusCode: 500,
        message: 'Please enter a valid Youtube video URL'
      })
    }

    if(!this.$route.query.v.match(/[a-zA-Z0-9_-]{6,11}/)) {
      return this.$nuxt.error({
        statusCode: 500,
        message: 'This doesn\'t look like a Youtube video'
      })
    }

    let video, captions

    try {
      video = await this.$store.dispatch('getVideo', this.$route.query.v)
    } catch(e) {
      return this.$nuxt.error({
        statusCode: 500,
        message: 'This video is unavailable'
      })
    }

    if(!video.captions) {
      return this.$nuxt.error({
        statusCode: 500,
        message: 'No caption for this video'
      })
    }

    try {
      captions = await this.$store.dispatch('getCaptions', {
        videoID: this.$route.query.v,
        lang: this.$store.state.lang || video.captions[0].languageCode
      })
    } catch(e) {
      return this.$nuxt.error({
        statusCode: 500,
        message: 'Can\'t load captions'
      })
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

