import Vue from 'vue'
import { GET_FORM, GET_MENU, GET_DRAWER, GET_NOTIFICATION } from '../getters-types'
import {
  FORM_SET, FORM_CLEAR, DRAWER_SET, SET_ERROR, SET_DEBUG,
  SET_EXCEPTION
  , NOTIFICATION_SET
} from '../mutation-types'

import {
  ACTION_FORM_GET, ACTION_FORM_CLEAR, ACTION_FORM_REFRESH, ACTION_FORM_SAVE,
  ACTION_SET_EXCEPTION,
  ACTION_SET_NOTIFICATION
} from '../action-types'

import VueLocalStorage from 'vue-localstorage'
import { get, post } from '@/api/service'

Vue.use(VueLocalStorage)

const localGet = (id, def) => {
  const value = Vue.localStorage.get(id)

  return (value) ? JSON.parse(value) : def
}

const localSet = (id, value) => {
  Vue.localStorage.set(id, JSON.stringify(value))
}

const service = {
  state: {
    loadData: false,
    menu: [],
    form: {},
    drawer: false,
    localStorageFields: [],
    notification: null,
    error: false,
    exception: null,
    debug: {
      scope: '',
      code: 0,
      message: ''
    }
  },
  mutations: {
    [SET_EXCEPTION] (state, exception) {
      state.exception = exception
    },
    localStorageField (state, payload) {
      const me = this
      const id = payload.form.form
      const form = state.form[id]

      if (!Array.isArray(payload.items)) {
        payload.items = Object.values(payload.items)
      }

      payload.items.map(function (item) {
        if (item.storage === 'client') {
          form.values[item.field] = localGet(id + '.' + item.field)
          state.localStorageFields.push(item.field)
        }

        // state[id + '.' + item.field] = form.values[item.field];

        if (item.items) {
          me.commit('service/localStorageField', { form: payload.form, items: item.items })
        }
      })
    },
    [FORM_SET] (state, form) {
      state.form[form.form] = form
      if (form) {
        this.commit('service/localStorageField', { form: form, items: form.items })
      }
    },
    [FORM_CLEAR] (state, id) {
      state.form[id] = null
    },
    [DRAWER_SET] (state, status) {
      state.drawer = status
    },
    [NOTIFICATION_SET] (state, notification) {
      state.notification = notification
    },
    [SET_ERROR] (state, error) {
      state.error = error
    },
    [SET_DEBUG] (state, error) {
      state.debug = error
    }
  },
  getters: {
    [GET_MENU]: () => service.state.menu,
    [GET_FORM]: (state) => (id) => (id && state.form[id]) ? state.form[id] : null,
    [GET_DRAWER]: () => service.state.drawer,
    [GET_NOTIFICATION]: () => service.state.notification,
    localStorageFields: () => service.state.localStorageFields,
    getLocalStorageValue: (state) => (id) => {
      if (state[id] === undefined) {
        state[id] = localGet(id)
      }
      return state[id]
    },
    error: () => service.state.error,
    debug: () => service.state.debug,
    exception: () => service.state.exception
  },
  actions: {
    [ACTION_SET_NOTIFICATION] (context, payload) {
      context.commit(NOTIFICATION_SET, {
        type: (payload.type) ? payload.type : 'info',
        message: (payload.message) ? payload.message : null,
        description: (payload.description) ? payload.description : null
      })
    },
    async get (context, payload) {
      return get(payload.url, payload.data)
        .catch(function (error) {
          context.commit(NOTIFICATION_SET, {
            type: 'error',
            message: error.message,
            description: error.response.data.message
          })
          context.commit(DRAWER_SET, false)
          context.commit(SET_ERROR, true)
          context.commit(SET_DEBUG, {
            scope: 'server side',
            code: error.response.status,
            message: error.message + '\n' +
              error.response.data.message
          })

          return error
        })
    },
    async [ACTION_FORM_GET] (context, payload) {
      context.commit(DRAWER_SET, true)

      return context.dispatch('get', {
        url: '/api/form',
        data: payload
      }).then(function (response) {
        console.log(response)
        switch (response.status) {
          case 200:
            if (response.data.success) {
              context.commit(FORM_SET, response.data.form)
            }
            break
          default:
            break
        }
        return response
      })
    },
    async [ACTION_FORM_REFRESH] (context) {
      return context.dispatch(ACTION_FORM_GET)
    },
    async [ACTION_FORM_SAVE] (context, payload) {
      const localStorageField = context.getters.localStorageFields

      if (localStorageField.length > 0) {
        localStorageField.map(function (item) {
          if (payload.values[item] !== undefined) {
            localSet(payload.form + '.' + item, payload.values[item])
          }
        })
      }

      return post('/api/form', payload).then(function (response) {
        if (response.data.success) {
          context.commit(FORM_SET, response.data.form)
        }
        return response
      })
    },
    [ACTION_FORM_CLEAR] (context, payload) {
      context.commit(DRAWER_SET, false)
      context.commit(FORM_CLEAR, payload.id)
      console.log(payload)
    },
    [ACTION_SET_EXCEPTION] (context, payload) {
      context.commit(SET_EXCEPTION, payload)
    }
  }
}

export default service
