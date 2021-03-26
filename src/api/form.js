import request from '@/utils/request'

const api = {
  resource: '/resource'
}

export function getResource (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}
