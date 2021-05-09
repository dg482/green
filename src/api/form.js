import { get, post } from './service'
import request from '../utils/request'

const api = {
  form: '/resource/form',
  deleteAssets: '/resource/assets'
}

export function getForm (parameter) {
  const form = parameter.form.split('/')
  return get(api.form, {
    alias: form[0],
    form: form[1],
    id: parameter.id
  })
}

export function postForm (parameters) {
  return post(api.form, parameters)
}

export function deleteFile (record, params) {
  return request({
    url: api.deleteAssets,
    method: 'delete',
    params: {
      alias: params.alias,
      id: record.uid
    }
  })
}
