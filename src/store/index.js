import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        rightsList: JSON.parse(sessionStorage.getItem('rightsList')||'[]'),
        user: sessionStorage.getItem('user') || '',
        icon:sessionStorage.getItem('icon') || ''
    },
    mutations: {
        setRightsList(state,rightsList) {
            state.rightsList = rightsList
            window.sessionStorage.setItem('rightsList',JSON.stringify(rightsList))
        },
        setUser(state, user) {
            state.user = user
            window.sessionStorage.setItem('user',user)
        },
        setIcon(state, icon) {
            state.icon = icon
            window.sessionStorage.setItem('icon',icon)
        }
    }
})

export default store