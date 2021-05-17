// state
import {
  GET_UI_SIZE, GET_UI_DRAWER_PLACEMENT,
  GET_UI_HEADER_INFO, GET_UI_APP_KEY,
  GET_COLUMNS_TABLE
} from '../getters-types'
import { UI_SET_SIZE, UI_SET_APP_KEY, SET_COLUMNS_TABLE } from '../mutation-types'
import { ACTION_UI_SET_SIZE } from '../action-types'
import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)

const localGet = (id, def) => {
  const value = Vue.localStorage.get(id)

  return (value) ? JSON.parse(value) : def
}

const localSet = (id, value) => {
  Vue.localStorage.set(id, JSON.stringify(value))
}

const ui = {
  state: {
    size: 'default', // large, default, small
    theme: 'app-theme-dark',
    key: Math.random()
  },
  getters: {
    [GET_UI_SIZE]: (state) => {
      return state.size
    },
    [GET_COLUMNS_TABLE]: () => (id) => {
      return localGet('settings/ui.table.columns/' + id, null)
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
    [GET_UI_APP_KEY]: () => ui.state.key
  },
  mutations: {
    [UI_SET_SIZE] (state, size) {
      state.size = size
    },
    [UI_SET_APP_KEY] (state) {
      state.key = Math.random()
    },
    [SET_COLUMNS_TABLE] (state, payload) {
      localSet('settings/ui.table.columns/' + payload.id, payload.columns)
    }
  },
  actions: {
    [ACTION_UI_SET_SIZE] (context) {
      if ((window.outerWidth / 2) < 500) {
        context.commit(UI_SET_SIZE, 'small')
      }
    },
    [UI_SET_APP_KEY] (context) {
      context.commit('UI_SET_APP_KEY')
    },
    [SET_COLUMNS_TABLE] (context, payload) {
      context.commit('SET_COLUMNS_TABLE', payload)
    }
  }
}

export default ui
