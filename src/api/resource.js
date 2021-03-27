import request from '@/utils/request'

const resourceApi = {
  Resource: '/resource'
}

export function resource (parameter) {
  return request({
    url: resourceApi.Resource,
    method: 'get',
    data: parameter
  })
}
