import Vue from 'vue'
import Vuex from 'vuex'
import { stationStore } from './station.store.js'
import { playerStore } from './player.store.js'
import { userStore } from './user.store.js'
Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    modules: {
        stationStore,
        playerStore,
        userStore
    },
});