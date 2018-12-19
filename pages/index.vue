<template>
  <main>
    <img src="~assets/logo.svg" alt="logo">

    <h1>
      Diaporama
    </h1>
    <h2>
      Turn Youtube videos into <br> scrollable caption-based slideshows
    </h2>

    <form action="watch" method="GET" @submit.prevent="submit">
      <input type="text" name="v" placeholder="https://youtu.be/U51MSK6nSQE" autofocus required>
      <button type="submit">
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
      </button>
    </form>

    <footer>
      <a href="https://github.com/nicooprat/diaporama">Fork, credits & readme</a>
    </footer>
  </main>
</template>

<script>
import getYouTubeID from 'get-youtube-id'

export default {
  mounted() {
    // Set preferred navigator language by default, if not set yet
    if(!this.$store.state.lang) {
      this.$store.dispatch('setLang', navigator.language.split('-')[0])
    }
  },
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

      @for $i from 1 through 10 {
        &:nth-child(#{$i}) {
          animation-delay: ($i - 1) * 100ms;
        }
      }
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
  }

  h2 {
    font-weight: normal;
    color: rgba(black,.5);
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

  footer {
    margin-top: 2em;

    a {
      text-decoration: none;
      border-bottom: 1px solid;
      color: inherit;
      opacity: .5;

      &:hover,
      &:focus {
        opacity: 1;
      }
    }
  }
</style>

