<template>
  <article v-if="video">
    <Watch/>
    <Details/>
  </article>

  <p v-else>Loading...</p>
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
  async fetch({route, store, redirect}) {
    if(!route.query.v) {
      redirect('/')
    } else {
      const video = await store.dispatch('getVideo', route.query.v)
      if(video.captions) {
        const captions = await store.dispatch('getCaptions', {
          videoID: route.query.v,
          lang: store.state.lang || video.captions[0].languageCode
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

