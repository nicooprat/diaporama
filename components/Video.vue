<template>
  <section
    class="video"
    :style="{'--ratio': stream.height / stream.width}">
    <div
      class="inner"
      @mousemove="scrub"
      @mouseleave="endScrub"
      @touchstart="touch"
      @touchmove="touch"
      @touchend="touch">
      <video
        :src="stream.url"
        :width="stream.width"
        :height="stream.height" muted playsinline autoplay v-on:loadeddata="init"
        :data-loaded="loaded > 0"
        @progress="progress">
      </video>
      <div class="loading" v-if="currentTime > loaded"></div>
      <div v-if="loaded" class="loaded" :style="{width: loaded / duration * 100 +'%'}"></div>
      <div v-if="loaded" class="progress" :style="{width: currentTime / duration * 100 +'%'}"></div>
      <div v-if="loaded" class="currentTime">{{formatTime(Math.min(duration, currentTime))}}</div>
      <div v-if="loaded" class="duration">{{formatTime(duration)}}</div>
      <div v-if="loaded && currentScrub > 0" class="scrub" :style="{left: currentScrub / duration * 100 + '%'}"></div>
      <input v-if="loaded" type="range" class="thumb" min="0" max="100" step="0.1" :value="currentTime ? currentTime / duration * 100 : 0">
      <input v-if="loaded" type="range" class="handle" min="0" max="100" step="0.1" @input="handle" :value="currentTime ? currentTime / duration * 100 : 0">
    </div>
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
    touch(e) {
      e.preventDefault() // Prevent scroll
      e.type === 'touchend' ? this.endScrub() : this.scrub(e)
      this.drag(e)
    },
    scrub(e) {
      const percent = this.getPercentX(e)
      const time = this.duration * percent
      this.currentScrub = time
    },
    endScrub(e) {
      this.currentScrub = false
      this.seekToTime(this.currentTime)
    },
    drag(e) {
      const percent = this.getPercentX(e)
      this.setNewIndexFromTime(this.duration * percent)
    },
    handle(e) {
      const percent = e.currentTarget.value
      this.setNewIndexFromTime(this.duration * percent/100)
    },
    getPercentX(e) {
      const coeff = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.clientWidth
      return Math.max(0, Math.min(1, coeff))
    },
    setNewIndexFromTime(newTime) {
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
      if(!currentCaption) return
      const time = currentCaption.start + currentCaption.dur / 2
      this.currentTime = time
    },
    seekToTime(time) {
      const video = this.$el.querySelector('video')
      video.currentTime = time
    },
    init(e) {
      e.currentTarget.pause() // Autoplay then pause immediately, fix iOS bug
      this.$data.duration = parseInt(e.currentTarget.duration)
    },
    progress(e) {
      const buffered = e.currentTarget.buffered
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
    top: 0; left: 0; right: 0;
    z-index: 1;

    @media (min-width: 90rem) {
      width: calc(50% - 10vh);
      flex: 0 0 auto;
      padding: 0 5vh;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: transparent;
    }
  }

  .inner {
    background-color: #f8fafd;
    position: relative;
    padding-bottom: calc(var(--ratio) * 100%);
    cursor: col-resize;

    @media (min-width: 45rem) {
      border-top: 5vh solid #f8fafd;
    }

    @media (min-width: 90rem) {
      padding-bottom: 0;
    }

    @media (max-width: 89.9rem) {

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
      display: none !important;
      -webkit-appearance: none;
    }

    &[data-loaded] {
      opacity: 1;
    }

    @media (min-width: 90rem) {
      position: static;
      height: auto;
    }
  }

  .loading {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(black,.05);
    animation: fadeIn 200ms both;
    overflow: hidden;

    @keyframes fadeIn {
      from { opacity: 0; }
    }

    &:after {
      content: '';
      position: absolute;
      top: 0; bottom: 0; left: 0;
      width: 20%;
      background: linear-gradient(to right, rgba(black,0), ease-in-out, rgba(black,1));
      opacity: .05;
      animation: loading 2s infinite both linear;

      @keyframes loading {
        from {
          transform: translateX(-500%);
        }
        to {
          transform: translateX(500%);
        }
      }
    }
  }

  .progress,
  .loaded,
  .thumb {
    height: 1vh;
    position: absolute;
    z-index: 2;
    left: 0; bottom: 0;
    max-width: 100%;
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

  // Invisible, but draggable
  .handle {
    appearance: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    user-select: none;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
    cursor: col-resize;
  }

  // Visible, but not draggable
  .thumb {
    appearance: none;
    width: 100%;
    height: 1vh;
    position: absolute;
    bottom: 0; left: 0;
    z-index: 3;
    background: none;
    outline: none;
    cursor: pointer;
    pointer-events: none;
  }

  @mixin track {
    display: flex;
    height: 100%;
    background: transparent;
    appearance: none;
    position: relative;
  }

  .thumb::-webkit-slider-runnable-track { @include track(); }
  .thumb::-moz-range-track { @include track(); }
  .thumb::-ms-track { @include track(); }

  @mixin thumb {
    appearance: none;
    width: 2vh;
    height: 2vh;
    position: absolute;
    bottom: 0;
    margin-bottom: -.5vh;
    border-radius: 100%;
    background: #f9183d;
    border: none;
  }

  .thumb::-webkit-slider-thumb { @include thumb(); }
  .thumb::-moz-range-thumb { @include thumb(); }
  .thumb::-ms-thumb { @include thumb(); }
</style>
