<template>
  <nuxt/>
</template>

<style lang="scss">
  @import "normalize.css/normalize.css";

  html, body, #__nuxt, #__layout {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  body {
    font-family: "Avenir", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    font-size: 16px;
    background-color: #f8fafd;
    color: #484849;
  }

  // Fix weird bug on transition to error page
  #__layout > :first-child:not(:only-child) {
    display: none;
  }

  @keyframes appear {
    from {
      opacity: 0;
      transform: translateY(10vh);
    }
  }
</style>

