<template>
  <li
    class="step"
    v-text="caption.text"
    :data-start="caption.start"
    :style="{animationDelay: i*50+'ms'}">
  </li>
</template>

<script>
export default {
  props: ['i', 'caption'],
  mounted() {
    if(process.browser) {
      if(this.$props.i == this.$store.state.currentIndex) {
        window.scrollTo(0,this.$el.offsetTop - window.innerHeight * .7)
      }
    }
  }
}
</script>

<style>

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
