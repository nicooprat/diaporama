<template>
  <section
    class="video"
    :style="{'--ratio': stream.height / stream.width}"
    @mousemove="scrub"
    @mouseleave="endScrub">
    <video
      :src="stream.url"
      :width="stream.width"
      :height="stream.height" muted playsinline autoplay v-on:loadeddata="init"
      :data-loaded="loaded > 0"
      @progress="progress">
    </video>
    <div v-if="loaded" class="loaded" :style="{transform: 'scaleX('+ loaded / duration +')'}"></div>
    <div v-if="loaded" class="progress" :style="{transform: 'scaleX('+ currentTime / duration +')'}"></div>
    <div v-if="loaded" class="currentTime">{{formatTime(currentTime)}}</div>
    <div v-if="loaded" class="duration">{{formatTime(duration)}}</div>
    <div v-if="loaded && currentScrub > 0" class="scrub" :style="{left: currentScrub / duration * 100 + '%'}"></div>
    <input v-if="loaded" type="range" class="handle" step="0.1" @input="drag" :value="currentTime / duration * 100">
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: this.video.details.title.replace(/\+/g, ' '),
    }
  },
  data() {
    return {
      loaded: 0,
      duration: 0,
      currentTime: 0,
      currentScrub: 0,
      itag: process.browser ? (window.innerWidth > 520 ? '22' : '18') : '18'
    }
  },
  watch: {
    currentIndex(index) {
      this.captions && this.seekToIndex(index)
    },
    captions(captions) {
      // When captions loaded, seek to current one
      // Avoid video stuck on first frame
      if(!captions) return
      this.seekToIndex(this.currentIndex)
    },
    currentScrub(time) {
      if(!time) return
      this.seekToTime(time)
    },
    currentTime(time) {
      this.seekToTime(time)
    }
  },
  methods: {
    scrub(e) {
      const percent = (e.pageX - e.target.getBoundingClientRect().left) / e.target.clientWidth
      const time = this.duration * percent
      this.currentScrub = time
    },
    endScrub(e) {
      this.currentScrub = false
      this.seekToTime(this.currentTime)
    },
    drag(e) {
      const percent = e.target.value
      const newTime = this.duration * percent/100
      const newIndex = this.captions.reduce((previous, caption, index) => {
        return caption.start < newTime ? index : previous
      }, 0)
      this.$store.dispatch('setIndex', newIndex)
      this.$emit('scrollToIndex', newIndex)
    },
    switchVideoFormat(e) {
      this.$data.itag = window.innerWidth > 520 ? '22' : '18'
    },
    formatTime(s) {
      const minutes = Math.floor(s/60)
      const seconds = Math.floor(s%60)
      return [minutes < 10 ? '0'+minutes : minutes, seconds < 10 ? '0'+seconds : seconds].join(':')
    },
    seekToIndex(index) {
      if(!this.$el) return
      if(!this.captions) return
      const currentCaption = this.captions[index]
      const time = currentCaption.start + currentCaption.dur / 2
      this.currentTime = time
    },
    seekToTime(time) {
      const video = this.$el.querySelector('video')
      video.currentTime = time
    },
    init(e) {
      e.target.pause() // Autoplay then pause immediately, fix iOS bug
      this.$data.duration = parseInt(e.target.duration)
    },
    progress(e) {
      const buffered = e.target.buffered
      const loaded = buffered.end(buffered.length-1)
      this.$data.loaded = loaded
      this.$emit('loaded', loaded)
    },
  },
  computed: {
    ...mapState(['video', 'captions', 'currentIndex']),
    percentSeek() {
      return this.seekToIndex() / this.duration * 100
    },
    stream() {
      const stream = this.video.streams.filter(i => i.itag == this.$data.itag)
      return stream && stream[0]
    }
  }
}
</script>

<style lang="scss" scoped>
  .video {
    position: sticky;
    padding-bottom: calc(var(--ratio) * 100%);
    top: 0; left: 0; right: 0;
    z-index: 1;
    background-color: #f8fafd;

    @media (min-width: 45rem) {
      border-top: 5vh solid #f8fafd;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(black,.05);
    }

    &:after {
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
  }

  video {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
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
    background-color: #f9183d;
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

  .scrub {
    position: absolute;
    top: 0; bottom: 0;
    border-left: 1px solid rgba(white,.5);
  }

  .handle {
    appearance: none;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0; left: 0;
    z-index: 3;
    background: none;
    outline: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .handle::-webkit-slider-runnable-track {
    display: flex;
    height: 100%;
    background: transparent;
    appearance: none;
  }

  .handle::-webkit-slider-thumb {
    appearance: none;
    width: 2vh;
    height: 2vh;
    margin-top: auto;
    margin-bottom: -.5vh;
    border-radius: 100%;
    background: #f9183d;
    border: none;
  }
</style>
