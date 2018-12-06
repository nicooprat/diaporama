<template>
  <li class="caption" :data-start="caption.start" :style="{animationDelay: Math.min(500,Math.max(0,(index-$store.state.currentIndex)))*50+'ms'}">
    {{caption.text}}
  </li>
</template>

<script>
if(process.browser) {
  var ScrollMagic = require('scrollmagic/scrollmagic/uncompressed/ScrollMagic')
}

export default {
  props: ['index', 'caption'],
  data() {
    return {
      scene: null
    }
  },
  mounted() {
    if(!process.browser) return
    const firstSibling = this.$el.parentNode.firstElementChild
    const offset = firstSibling.offsetTop / window.innerHeight
    this.scene = new ScrollMagic.Scene({
      triggerElement: this.$el,
      duration: this.$el.clientHeight,
      triggerHook: offset,
    })
    .on('enter', e => e.state === 'DURING' && this.$store.dispatch('setIndex', this.$props.index))
    this.$emit('addScene', {
      scene: this.scene,
      index: this.$props.index
    })

    if(this.$store.state.currentIndex === this.$props.index) {
      this.$emit('scrollToIndex', this.$props.index)
    }
  },
  destroyed() {
    this.$emit('removeScene', {
      scene: this.scene,
      index: this.$props.index
    })
  }
}
</script>

<style lang="scss" scoped>
  li {
    margin: 1px 0 0 0;
    position: relative;
    padding: 2.5vh .5em;
    animation: appear 250ms both paused;
  }

  li[data-ready] {
    animation-play-state: running;
  }

  li[data-active] {
    background-color: rgba(0,0,0,.05);
  }

  li:not([data-loaded]):after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #f8fafd;
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
