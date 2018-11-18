<template>
  <main>
    <div class="video" v-show="$data.duration > 0">
      <video :src="stream" muted playsinline autoplay v-on:loadeddata="init" v-on:progress="progress"></video>
      <div class="loaded" :style="{transform: 'scaleX('+ $data.loaded / $data.duration +')'}"></div>
      <div class="progress" :style="{transform: 'scaleX('+ $data.currentTime / $data.duration +')'}"></div>
      <div v-if="$data.loaded" class="currentTime">{{formatTime($data.currentTime)}}</div>
      <div v-if="$data.loaded" class="duration">{{formatTime($data.duration)}}</div>
    </div>

    <ul v-show="$data.duration > 0 && captions">
      <li
        class="step"
        v-for="(subtitle,i) in captions"
        v-text="subtitle.text"
        :key="i"
        :data-start="subtitle.start"
        :style="{animationDelay: i*50+'ms'}"
        :data-active="i == $data.index"
        :data-loaded="subtitle.start <= $data.loaded">
      </li>
    </ul>
  </main>
</template>

<script>
if(process.browser) {
  require('intersection-observer')
  var scrollama = require('scrollama')
}

export default {
  props: ['videoID', 'video', 'captions'],
  data() {
    return {
      index: 0,
      loaded: 0,
      duration: 0,
      durationFormatted: 0,
      currentTime: 0,
      currentTimeFormatted: 0
    }
  },
  watch: {
    captions: {
      handler(captions) {
        if(captions && scrollama) {
          this.$nextTick(() => {
            scrollama()
            .setup({
              offset: .7,
              step: '.step'
            })
            .onStepEnter(({element, index, direction}) => {
              this.$data.index = index
            })
          })
        }
      },
      immediate: true
    },
    index(i) {
      this.seek(this.$props.captions[i].start)
    },
  },
  methods: {
    stepEnterHandler({element, index, direction}) {
      this.$data.index = index
    },
    formatTime(s) {
      const minutes = Math.floor(s/60)
      const seconds = Math.floor(s%60)
      return [minutes < 10 ? '0'+minutes : minutes, seconds < 10 ? '0'+seconds : seconds].join(':')
    },
    seek(time) {
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
    stream() {
      const stream = this.$props.video.streams.filter(i => i.itag == '18')
      return stream && stream[0].url
    }
  }
}
</script>

<style>
  main {
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
    top: 0; left: 0; right: 0;
    z-index: 1;
    max-width: 45rem;
    margin-left: auto;
    margin-right: auto;
    border: 5vh solid white;
    background-color: white;
    animation: fade 250ms both;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .video:before {
    content: '';
    position: absolute;
    width: 100vw;
    left: 50%;
    margin-left: -50vw;
    top: -5vh; bottom: -5vh;
    z-index: -1;
    background-color: white;
  }

  .video:after {
    content: '';
    width: 100vw;
    left: 50%;
    margin-left: -50vw;
    top: 100%;
    height: 10vh;
    pointer-events: none;
    border-top: 10vh solid white;
    position: absolute;
    background-image: linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0));
  }

  video {
    display: block;
    max-width: 100%;
    height: auto;
    background-color: rgba(0,0,0,.05);
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

  .currentTime {
    left: 0;
  }

  .duration {
    right: 0;
  }

  ul {
    max-width: 45rem;
    list-style-type: none;
    padding: 0 5vh;
    margin: 15vh auto 25vh;
  }

  li {
    margin: 1px 0 0 0;
    padding: 2.5vh .5em;
    position: relative;
    animation: appear 250ms both;
  }

  li[data-active] {
    background-color: rgba(0,0,0,.05);
  }

  li:not([data-loaded]):after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: white;
    opacity: .75;
  }

  @keyframes appear {
    from {
      opacity: 0;
      transform: translateY(5vh);
    }
    to {
      opacity: 1;
    }
  }
</style>
