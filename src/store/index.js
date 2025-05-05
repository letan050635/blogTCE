/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuex from 'vuex'
import authService from '../services/authService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('auth_user')) || null,
    token: localStorage.getItem('auth_token') || null
  },
  getters: {
    isLoggedIn: state => !!state.token,
    currentUser: state => state.user
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setToken(state, token) {
      state.token = token
    },
    clearAuth(state) {
      state.user = null
      state.token = null
    }
  },
  actions: {
    login({ commit }, { token, user }) {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
      commit('setToken', token)
      commit('setUser', user)
    },
    logout({ commit }) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      commit('clearAuth')
    }
  }
})