import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import map from '@/store/modules/map'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		user,
		map
	},
	getters
})

export default store