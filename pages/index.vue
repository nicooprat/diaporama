<template>
  <main>
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
import YouTubeVideoId from 'youtube-video-id'

export default {
  methods: {
    submit(e) {
      const form = e.target
      const path = form.attributes.action.value
      const value = form.querySelector('[name="v"]').value
      const videoID = YouTubeVideoId(value)
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

  h1 {
    color: #ff002c;
    font-size: 4em;
    margin-top: 0;
    margin-bottom: 0;
  }

  h2 {
    opacity: .5;
    font-weight: normal;
    animation-delay: 100ms;
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
    animation-delay: 200ms;

    &:focus-within {
      border-color: #ff002c;

      button {
        color: #ff002c;
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

    svg {
      width: 1em;
      height: 1em;
    }
  }
</style>

