<template>
  <main>
    <img src="~assets/logo.svg" alt="logo">

    <h1>
      zootrope
    </h1>
    <h2>
      Turn Youtube videos into <br> scrollable caption-based slideshows
    </h2>

    <form action="watch" method="GET" @submit.prevent="submit">
      <input type="text" name="v" placeholder="oavMtUWDBTM" value="https://www.youtube.com/watch?v=oavMtUWDBTM" autofocus required>
      <button type="submit">
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
      </button>
    </form>
  </main>
</template>

<script>
import getYouTubeID from 'get-youtube-id'

export default {
  methods: {
    submit(e) {
      const form = e.target
      const path = form.attributes.action.value
      const value = form.querySelector('[name="v"]').value
      const videoID = getYouTubeID(value)
      this.$router.push({
        path,
        query: {
          v: videoID
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;

    &:before {
      content: '';
      flex: .5;
    }

    > * {
      animation: appear 350ms both;
    }
  }

  img {
    width: 6em;
    margin-bottom: 1em;
  }

  h1 {
    color: #f9183d;
    font-size: 4em;
    margin-top: 0;
    margin-bottom: 0;
    animation-delay: 100ms;
  }

  h2 {
    font-weight: normal;
    color: rgba(black,.5);
    animation-delay: 200ms;
  }

  form {
    display: flex;
    align-items: center;
    width: 20em;
    max-width: 100%;
    appearance: none;
    border: 1px solid rgba(black,.1);
    border-radius: 3px;
    margin-top: 1em;
    background: white;
    animation-delay: 300ms;

    &:focus-within {
      border-color: #f9183d;

      button {
        color: #f9183d;
      }
    }
  }

  input {
    flex: 1;
    appearance: none;
    border: none;
    background: none;
    padding: 1em;
    padding-right: 0;
    outline: none;
  }

  button {
    appearance: none;
    border: none;
    background: none;
    flex: 0 0 auto;
    padding: 1em;
    outline: none;
    cursor: pointer;
    color: rgba(black,.6);

    svg {
      width: 1em;
      height: 1em;
    }
  }
</style>

