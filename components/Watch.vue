<template>
  <main>
    <section class="video" :style="{'--ratio': stream.height / stream.width}">
      <video
        :src="stream.url"
        :width="stream.width"
        :height="stream.height" muted playsinline autoplay v-on:loadeddata="init"
        :data-loaded="loaded > 0"
        v-on:progress="progress">
      </video>
      <div class="loaded" :style="{transform: 'scaleX('+ loaded / duration +')'}"></div>
      <div class="progress" :style="{transform: 'scaleX('+ currentTime / duration +')'}"></div>
      <div v-if="loaded" class="currentTime">{{formatTime(currentTime)}}</div>
      <div v-if="loaded" class="duration">{{formatTime(duration)}}</div>
      <input v-if="loaded" type="range" class="handle" step="0.1" @input="drag" :value="percentSeek">
    </section>

    <ul v-if="captions">
      <Caption
        v-for="(caption,i) in captions"
        :caption="caption"
        :i="i"
        :data-ready="scrolledDown"
        :data-active="i == $store.state.currentIndex"
        :data-loaded="caption.start < loaded"
        :key="i"/>
    </ul>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import Caption from './Caption'

if(process.browser) {
  var ScrollMagic = require('scrollmagic/scrollmagic/uncompressed/ScrollMagic')
}

export default {
  components: {
    Caption
  },
  props: ['videoID', 'video', 'captions'],
  data() {
    return {
      scrollama: null,
      loaded: 0,
      duration: 0,
      currentTime: 0,
      scrolledDown: false,
      controller: null,
      scenes: [],
      itag: process.browser ? (window.innerWidth > 520 ? '22' : '18') : '18'
    }
  },
  mounted() {
    if(process.browser) {
      window.addEventListener('resize', this.switchVideoFormat)
    }

    this.controller = new ScrollMagic.Controller()

    const children = this.$children.filter(c => c._name === '<Caption>')
    const offset = (children[0].$el.offsetTop + children[0].$el.clientHeight) / window.innerHeight

    this.scenes = children.map((child, index) => {
      return new ScrollMagic.Scene({
        triggerElement: child.$el,
        duration: child.$el.clientHeight,
        triggerHook: offset,
      })
      .on('enter', e => e.state === 'DURING' && this.$store.dispatch('setIndex', index))
      .addTo(this.controller)
    })

    this.controller.scrollTo(this.scenes[this.$store.state.currentIndex])
    this.scrolledDown = true
  },
  beforeDestroy() {
    if(process.browser) {
      window.removeEventListener('resize', this.switchVideoFormat)
      this.controller.destroy(true)
    }
  },
  watch: {
    currentIndex(index) {
      this.seek(this.$props.captions[index].start)
    },
  },
  methods: {
    drag(e) {
      const percent = e.target.value
      const newTime = this.duration * percent/100
      const newIndex = this.captions.reduce((previous, caption, index) => {
        return caption.start < newTime ? index : previous
      }, 0)
      this.seek(newTime)
      this.$store.dispatch('setIndex', newIndex)
      this.controller.scrollTo(this.scenes[newIndex])
    },
    switchVideoFormat(e) {
      this.$data.itag = window.innerWidth > 520 ? '22' : '18'
    },
    formatTime(s) {
      const minutes = Math.floor(s/60)
      const seconds = Math.floor(s%60)
      return [minutes < 10 ? '0'+minutes : minutes, seconds < 10 ? '0'+seconds : seconds].join(':')
    },
    seek(time) {
      if(!this.$el) return
      const video = this.$el.querySelector('video')
      video.currentTime = parseFloat(time)
      this.$data.currentTime = parseInt(time)
    },
    init(e) {
      e.target.pause() // Autoplay then pause immediately, fix iOS bug
      this.$data.duration = parseInt(e.target.duration)
    },
    progress(e) {
      const buffered = e.target.buffered
      this.$data.loaded = buffered.end(buffered.length-1)
    },
  },
  computed: {
    ...mapState(['currentIndex']),
    percentSeek() {
      return parseFloat(this.currentTime / this.duration * 100)
    },
    stream() {
      const stream = this.$props.video.streams.filter(i => i.itag == this.$data.itag)
      return stream && stream[0]
    }
  }
}
</script>

<style lang="scss">
  main {
    max-width: 45rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    color: #2c3e50;
    font-size: calc(.5em + 2vmax);
  }

  @media (min-width: 1200px) {

    main {
      font-size: 2em;
    }
  }

  .video {
    position: sticky;
    padding-bottom: calc(var(--ratio) * 100%);
    top: 0; left: 0; right: 0;
    z-index: 1;
    background-color: #f8fafd;
  }

  @media (min-width: 45rem) {

    .video {
      border-top: 5vh solid #f8fafd;
    }
  }

  .video:after {
    content: '';
    width: 100vw;
    left: 50%;
    margin-left: -50vw;
    top: 100%;
    height: 10vh;
    pointer-events: none;
    border-top: 10vh solid #f8fafd;
    position: absolute;
    background-image: linear-gradient(to bottom, #f8fafd, rgba(#f8fafd,0));
  }

  video {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    background-color: rgba(0,0,0,.05);
    opacity: 0;
    transition: opacity 250ms;

    // Hide play button on iOS
    &::-webkit-media-controls-start-playback-button {
      display: none!important;
      -webkit-appearance: none;
    }
  }

  video[data-loaded] {
    opacity: 1;
  }

  .progress,
  .loaded {
    height: 1vh;
    position: absolute;
    z-index: 2;
    width: 99.9%; // Fix iOS bug
    left: 0; bottom: 0;
    transform: scaleX(0);
    transform-origin: left;
  }

  .progress {
    background-color: #ff002c;
  }

  .loaded {
    background-color: rgba(255,255,255,.5);
  }

  .currentTime,
  .duration {
    position: absolute;
    top: 100%;
    z-index: 2;
    font-size: .8em;
    padding: .5em 0;
    opacity: .5;
  }

  @media (max-width: 45rem) {

    .currentTime,
    .duration {
      padding: .5em;
    }
  }

  .currentTime {
    left: 0;
  }

  .duration {
    right: 0;
  }

  .handle {
    appearance: none;
    width: 100%;
    height: 5vh;
    position: absolute;
    bottom: -2vh; left: 0;
    z-index: 3;
    background: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .handle::-webkit-slider-runnable-track {
    appearance: none;
    background: transparent;
  }

  .handle::-webkit-slider-thumb {
    appearance: none;
    width: 2vh;
    height: 2vh;
    border-radius: 100%;
    background: #ff002c;
    border: none;
    cursor: pointer;
  }

  ul {
    list-style-type: none;
    padding: 0 5vh;
    margin: 25vh auto;
  }

  @media (min-width: 520px) {

    ul {
      margin-top: 20vh;
    }
  }
</style>
