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
    </section>

    <ul v-if="captions">
      <Caption
        @go="initScrollorama"
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
import debounce from 'lodash/debounce'

if(process.browser) {
  require('intersection-observer')
  var scrollama = require('scrollama')
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
      itag: process.browser ? (window.innerWidth > 520 ? '22' : '18') : '18'
    }
  },
  created() {
    if(process.browser) {
      window.addEventListener('resize', this.switchVideoFormat)
    }
  },
  beforeDestroy() {
    if(process.browser) {
      window.removeEventListener('resize', this.switchVideoFormat)
    }
  },
  watch: {
    currentIndex(index) {
      this.seek(this.$props.captions[index].start)
    },
  },
  methods: {
    initScrollorama(currentCaption) {
      const firstCaption = this.$children.filter(c => c._name === '<Caption>')[0].$el
      const offset = (firstCaption.offsetTop + firstCaption.clientHeight) / window.innerHeight - 0.01
      const top = currentCaption.offsetTop - (window.innerHeight * offset) + 1
      window.scrollTo(0,top)
      this.scrolledDown = true
      scrollama()
      .setup({
        offset,
        step: '.caption',
      })
      .onStepEnter(debounce(({element, index, progress}) => {
        this.$store.dispatch('setIndex', index)
      }, 50, {leading: false, trailing: true}))
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
    stream() {
      const stream = this.$props.video.streams.filter(i => i.itag == this.$data.itag)
      return stream && stream[0]
    }
  }
}
</script>

<style>
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
    background-image: linear-gradient(to bottom, #f8fafd, transparent);
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
  }

  video[data-loaded] {
    opacity: 1;
  }

  .progress,
  .loaded {
    height: 1vh;
    position: absolute;
    z-index: 2;
    left: 0; bottom: 0; right: 0;
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

  ul {
    list-style-type: none;
    padding: 0 5vh;
    margin: 25vh auto 25vh;
  }

  @media (min-width: 520px) {

    ul {
      margin-top: 15vh;
    }
  }
</style>
