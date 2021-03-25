import axios from 'axios'
import Cookies from 'js-cookie'

export const _axios = () => {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('fdb_wb_token')
  return axios
}
export const get = async (url, params) => {
  return _axios().get(url, { params: params }).then(function (response) {
    return response
  })
}

export const post = async (url, data) => {
  return _axios().post(url, data)
}
