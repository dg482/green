import Mock from 'mockjs2'
import { builder } from '../util'

const resource = () => {
  return builder({
    'success': true,
    'result': {}
  })
}

Mock.mock(/\/resource/, 'get', resource)
