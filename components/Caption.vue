<template>
  <li class="caption" :data-start="caption.start">
    <span :style="{animationDelay: i*50+'ms'}">{{caption.text}}</span>
  </li>
</template>

<script>
export default {
  props: ['i', 'caption'],
  mounted() {
    if(process.browser) {
      if(this.$props.i == this.$store.state.currentIndex) {
        this.$emit('go', this.$el.offsetTop - (window.innerHeight * .75) + 1)
      }
    }
  }
}
</script>

<style>

  li {
    margin: 1px 0 0 0;
    position: relative;
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

  span {
    display: block;
    padding: 2.5vh .5em;
    animation: appear 250ms both;
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
