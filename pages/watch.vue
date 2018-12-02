<template>
  <article v-if="video">
    <Watch/>

    <select v-on:change="switchLang">
      <option v-for="caption in video.captions" v-bind:key="caption.vssId" :value="caption.languageCode" :selected="lang === caption.languageCode" v-if="caption.kind !== 'asr'">
        {{caption.name.simpleText.replace(/\+/g, ' ')}}
      </option>
    </select>
  </article>

  <p v-else>Loading...</p>
</template>

<script>
import { mapState } from 'vuex'
import Watch from '~/components/Watch';

export default {
  components: {
    Watch,
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
  methods: {
    async switchLang(e) {
      await this.$store.dispatch('switchCaptions', {
        videoID: this.$store.state.videoID,
        lang: e.target.value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  select {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>

