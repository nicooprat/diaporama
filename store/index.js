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
      setIndex (state, index) {
        this.$router.replace({...this.$router.currentRoute, hash: `#${index}`})
        state.commit('setIndex', index)
      }
    }
  })
}

export default createStore
