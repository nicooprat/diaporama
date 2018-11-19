import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      currentIndex: 0
    }),
    mutations: {
      setIndex (state, index) {
        state.currentIndex = index
      }
    },
    actions: {
      nuxtServerInit (state, context) {
        state.commit('setIndex', context.route.query.i || 0)
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
