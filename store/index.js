import Vuex from 'vuex'
import cachios from 'cachios';

const axios = cachios.create(cachios, {
  ttl: 3600
})

const prefix = process.env.NODE_ENV === 'development' ? 'http://localhost:9000' : '/.netlify/functions'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      currentIndex: 0,
      videoID: null,
      video: null,
      lang: null,
      captions: null
    }),

    mutations: {
      setVideo(state, video) {
        state.video = video
      },
      setVideoID(state, videoID) {
        state.videoID = videoID
      },
      setCaptions(state, captions) {
        state.captions = captions
      },
      setLang(state, lang) {
        state.lang = lang
      },
      setIndex(state, index) {
        state.currentIndex = index
      },
      resetState(state) {
        state.video = null
        state.videoID = null
        state.captions = null
        state.lang = null
        state.currentIndex = 0
      }
    },

    actions: {
      nuxtServerInit (store, context) {
        store.commit('setVideoID',  context.route.query.v || null)
        store.commit('setIndex',  parseInt(context.route.query.i) || 0)
        store.commit('setLang',  context.route.query.l || null)
      },
      async getVideo(store, videoID) {
        const {data: video} = await axios.get(`${prefix}/video?v=${videoID}`)
        video.captions.sort((a,b) => {
          // Sort captions by navigator preferences
          return navigator.languages.includes(a.languageCode) ? -1 : 1
        }).sort((a,b) => {
          // Sort automatic caption after manual ones
          return a.kind === 'asr' ? 1 : 0
        }).sort((a,b) => {
          // Sort last one chosen first
          return a.languageCode === store.state.lang ? 1 : 0
        })
        store.commit('setVideo', video)
        store.commit('setVideoID', videoID)
        return video
      },
      async getCaptions(store, {videoID, lang}) {
        const {data: captions} = await axios.get(`${prefix}/captions?v=${videoID}&l=${lang}`)
        store.commit('setCaptions', captions.map(caption => ({
          start: parseFloat(caption.start),
          dur: parseFloat(caption.dur),
          text: caption.text,
        })))
        store.commit('setLang', lang)
        return captions
      },
      async switchCaptions(store, {videoID, lang}) {
        const captions = await store.dispatch('getCaptions', {
          videoID,
          lang,
        })
        store.commit('setIndex', 0)
        return captions
      },
      setIndex(store, index) {
        store.commit('setIndex', index)
        store.dispatch('updateURL')
      },
      updateURL(store) {
        this.$router.replace({
          ...this.$router.currentRoute,
          query: {
            v: store.state.videoID,
            i: store.state.currentIndex,
            l: store.state.lang
          }
        })
      },
      resetState(store) {
        store.commit('resetState')
      }
    }
  })
}

export default createStore
