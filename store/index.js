import Vuex from 'vuex'
import axios from 'cachios';

const prefix = process.env.NODE_ENV === 'development' ? 'http://10.0.0.44:9000' : '/.netlify/functions'

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
        store.commit('setVideo', video)
        store.commit('setVideoID', videoID)
        return video
      },
      async getCaptions(store, {videoID, lang}) {
        const {data: captions} = await axios.get(`${prefix}/captions?v=${videoID}&l=${lang}`)
        store.commit('setCaptions', captions)
        store.commit('setLang', lang)
        this.$router.replace({
          query: {
            ...this.$router.currentRoute.query,
            i: 0,
            l: lang
          }
        })
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
      setIndex (state, index) {
        this.$router.replace({
          query: {
            ...this.$router.currentRoute.query,
            i: index
          }
        })
        state.commit('setIndex', index)
      }
    }
  })
}

export default createStore
