<template>
  <main>
    <Video v-if="video" @loaded="setLoaded"/>

    <ul v-if="captions">
      <Caption
        v-for="(caption,index) in captions"
        @addScene="addScene"
        @removeScene="removeScene"
        @scrollToIndex="scrollToIndex"
        :caption="caption"
        :index="index"
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
      loaded: 0,
      scrolledDown: false,
      controller: null,
      scenes: [],
    }
  },
  created() {
    if(!process.browser) return
    this.controller = new ScrollMagic.Controller()
  },
  mounted() {
    window.addEventListener('resize', this.switchVideoFormat)
    // When store dispatch
    this.$bus.$on('resetScroll', e => this.controller.scrollTo(0))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.switchVideoFormat)
    this.controller && this.controller.destroy(true)
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
    }
  },
  computed: mapState(['video', 'captions', 'currentIndex']),
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
  }

  ul {
    list-style-type: none;
    padding: 0 5vh;
    margin: 25vh auto;

    @media (min-width: 520px) {
      margin-top: 20vh;
    }
  }
</style>
