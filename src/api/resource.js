import { get } from './service'

const resourceApi = {
  Resource: '/resource'
}

export function resource (parameter) {
  return get(resourceApi.Resource, parameter)
}
