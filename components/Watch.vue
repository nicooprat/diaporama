<template>
  <main>
    <Video v-if="video" @loaded="setLoaded" @scrollToIndex="scrollToIndex"/>

    <ul v-if="captions">
      <Caption
        v-for="(caption,index) in captions"
        @addScene="addScene"
        @removeScene="removeScene"
        @scrollToIndex="scrollToIndex"
        :controller="controller"
        :caption="caption"
        :index="index"
        :initialIndex="initialIndex"
        :data-space="index > 0 && captionHasSpace({current: caption, previous: captions[index-1]})"
        :data-ready="scrolledDown"
        :data-active="index == currentIndex"
        :data-loaded="caption.start < loaded"
        :key="index"/>
    </ul>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import Video from './Video'
import Caption from './Caption'

if(process.browser) {
  var ScrollMagic = require('scrollmagic/scrollmagic/uncompressed/ScrollMagic')
}

export default {
  components: {
    Video,
    Caption,
  },
  data() {
    return {
      initialIndex: 0,
      loaded: 0,
      scrolledDown: false,
      controller: null,
      scenes: [],
    }
  },
  created() {
    if(!process.browser) return
    this.initialIndex = this.currentIndex
    this.controller = new ScrollMagic.Controller()
  },
  mounted() {
    window.addEventListener('resize', this.switchVideoFormat)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.switchVideoFormat)
    this.controller && this.controller.destroy(true)
  },
  watch: {
    lang(lang) {
      this.controller.scrollTo(0)
    }
  },
  methods: {
    addScene({triggerElement, duration, triggerHook, index}) {
      const scene = new ScrollMagic.Scene({
        triggerElement,
        duration,
        triggerHook,
      })
      .on('enter', e => e.state === 'DURING' && this.$store.dispatch('setIndex', index))
      this.controller.addScene(scene)
      this.scenes[index] = scene
    },
    removeScene(index) {
      const scene = this.scenes[index]
      this.controller.removeScene(scene)
      delete this.scenes[index]
    },
    scrollToIndex(index) {
      this.controller.scrollTo(this.scenes[index])
      this.scrolledDown = true
    },
    setLoaded(loaded) {
      this.loaded = loaded
    },
    captionHasSpace({current, previous}) {
      // Display space if > 1s between current & previous caption
      return previous && current.start - (previous.start + previous.dur) > 1
    },
  },
  computed: mapState(['video', 'captions', 'currentIndex', 'lang']),
}
</script>

<style lang="scss" scoped>
  main {
    max-width: 45rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    color: #2c3e50;
    font-size: calc(.5em + 2vmax);

    @media (min-width: 1200px) {
      font-size: 2em;
    }

    @media (min-width: 90rem) {
      display: flex;
      max-width: none;
    }
  }

  ul {
    list-style-type: none;
    padding: 0 5vh;
    margin: 25vh auto;

    @media (min-width: 520px) {
      margin-top: 20vh;
    }

    @media (min-width: 90rem) {
      width: calc(50% - 10vh);
      flex: 0 0 auto;
      margin: 60vh 0;
    }
  }
</style>
