<template>
  <li class="caption" :data-start="caption.start" :style="{animationDelay: Math.min(500,Math.max(0,(i-$store.state.currentIndex)))*50+'ms'}">
    {{caption.text}}
  </li>
</template>

<script>
export default {
  props: ['i', 'caption'],
}
</script>

<style>

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
