// state
import {
  GET_UI_SIZE, GET_UI_DRAWER_PLACEMENT,
  GET_UI_HEADER_INFO, GET_UI_APP_KEY
} from '../getters-types'
import { UI_SET_SIZE, UI_SET_APP_KEY } from '../mutation-types'
import { ACTION_UI_SET_SIZE } from '../action-types'
import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)

export const state = {
  size: 'default', // large, default, small
  theme: 'app-theme-dark',
  key: Math.random()
}

export const getters = {
  [GET_UI_SIZE]: (state) => {
    return state.size
  },
  [GET_UI_HEADER_INFO]: () => {
    return Vue.localStorage.get('settings/ui.header.user_info')
  },
  [GET_UI_DRAWER_PLACEMENT]: () => {
    const placement = parseInt(Vue.localStorage.get('settings/ui.drawer.placement'))
    switch (placement) {
      case 1:
        return 'left'
      case 2:
        return 'right'
      default:
        return 'left'
    }
  },
  [GET_UI_APP_KEY]: () => state.key
}

export const mutations = {
  [UI_SET_SIZE] (state, size) {
    state.size = size
  },
  [UI_SET_APP_KEY] (state) {
    state.key = Math.random()
  }
}

export const actions = {
  [ACTION_UI_SET_SIZE] (context) {
    if ((window.outerWidth / 2) < 500) {
      context.commit(UI_SET_SIZE, 'small')
    }
  },
  [UI_SET_APP_KEY] (context) {
    context.commit('UI_SET_APP_KEY')
  }
}
