import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex);

new Vue({
    el: '#app',
    render: h => h(App),
    store: new Vuex.Store({
	plugins: [
	    createPersistedState()
	],
	state: {
	    times: []
	},
	mutations: {
	    add ({times}) {
		times.push({id: times.length, time: new Date(), annotations: []});
	    },

	    annotate({times}, {idx, annotation}) {
		times[idx].annotations.unshift({time: new Date(), text: annotation});
	    }
	}
    })
})
