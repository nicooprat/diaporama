<template>
  <header>
    <nuxt-link class="back" to="/" title="Back home">
      <svg width="24" height="24" viewBox="0 0 24 24"><path transform="rotate(180) translate(-24,-24)" fill="currentColor" d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
    </nuxt-link>
    <a class="title" :href="`//youtu.be/${video.details.videoId}`">
      <small>{{video.details.author.replace(/\+/g, ' ')}}</small>
      <strong>{{video.details.title.replace(/\+/g, ' ')}}</strong>
    </a>
    <label for="switchLang">
      <strong>{{lang}}</strong>
      <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>
      <select v-on:change="switchLang" id="switchLang">
        <option v-for="caption in video.captions" v-bind:key="caption.vssId" :value="caption.languageCode" :selected="lang === caption.languageCode" v-if="caption.kind !== 'asr'">
          {{caption.name.simpleText.replace(/\+/g, ' ')}}
        </option>
      </select>
    </label>
  </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['video', 'lang']),
  methods: {
    async switchLang(e) {
      await this.$store.dispatch('switchCaptions', {
        videoID: this.$store.state.videoID,
        lang: e.target.value
      })
      this.$bus.$emit('resetScroll')
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    width: 100%;
    max-width: 45rem;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    position: fixed;
    justify-content: space-between;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    background: #f8fafd;
    border-top: 1px solid rgba(black,.1);
    animation: detailsAppear 500ms;
  }

  @keyframes detailsAppear {
    from {
      transform: translateY(100%);
    }
  }

  .back {
    display: flex;
    padding: 1em;
    color: inherit;
    outline: none;

    &:hover,
    &:focus {
      color: #ff002c;
    }

    svg {
      margin: auto;
      width: 1em;
      height: 1em;
    }
  }

  .title {
    font-size: 1em;
    font-weight: normal;
    margin: 0;
    color: inherit;
    text-decoration: none;
    padding: 1em;
    overflow: hidden;
    outline: none;

    &:hover,
    &:focus {
      color: #ff002c;
    }

    strong, small {
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  small {
    font-size: 1em;
    opacity: .5;
  }

  label {
    flex: 0 1 auto;
    max-width: 3em;
    display: flex;
    align-items: baseline;
    width: 100%;
    padding: 1em;
    cursor: pointer;
    position: relative;
    outline: none;

    &:hover,
    &:focus {
      color: #ff002c;
    }

    strong {
      text-transform: uppercase;
      letter-spacing: .05em;
    }

    svg {
      width: 0.8em;
      height: 0.8em;
      margin-left: .5em;
      opacity: .5;
    }
  }

  select {
    position: absolute;
    opacity: 0;
    top: 0; left: 0;
    width: 100%; height: 100%;
  }
</style>
