import request from '@/utils/request'

export function get (url, params) {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}

export function post (url, params) {
  return request({
    url: url,
    method: 'post',
    params: params
  })
}
