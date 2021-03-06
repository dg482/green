import Mock from 'mockjs2'
import { builder } from '../util'

const resource = () => {
  return builder({
    'success': true,
    'table': {
      'title': 'Пользователи',
      'columns': [
        {
          'id': 0,
          'key': 'id',
          'name': 'id',
          'type': 'int',
          'dataIndex': 'id',
          'ellipsis': true,
          'width': 80,
          'title': '#'
        },
        {
          'id': 0,
          'key': 'email',
          'name': 'email',
          'type': 'string',
          'dataIndex': 'email',
          'ellipsis': true,
          // 'width': 200,
          'title': 'Email'
        },
        {
          'id': 0,
          'key': 'action',
          'fixed': 'right',
          'ellipsis': true,
          'width': 100,
          'scopedSlots': {
            'customRender': 'action'
          }
        }
      ],
      'data': [
        { 'id': 1, 'email': 'example1@test.com' },
        { 'id': 2, 'email': 'example1@test.com' },
        { 'id': 3, 'email': 'example1@test.com' },
        { 'id': 4, 'email': 'example1@test.com' },
        { 'id': 5, 'email': 'example1@test.com' },
        { 'id': 6, 'email': 'example1@test.com' },
        { 'id': 7, 'email': 'example1@test.com' },
        { 'id': 8, 'email': 'example1@test.com' },
        { 'id': 9, 'email': 'example1@test.com' },
        { 'id': 10, 'email': 'example1@test.com' },
        { 'id': 11, 'email': 'example1@test.com' },
        { 'id': 12, 'email': 'example1@test.com' },
        { 'id': 13, 'email': 'example1@test.com' },
        { 'id': 14, 'email': 'example1@test.com' },
        { 'id': 15, 'email': 'example1@test.com' },
        { 'id': 16, 'email': 'example1@test.com' },
        { 'id': 17, 'email': 'example1@test.com' },
        { 'id': 18, 'email': 'example1@test.com' },
        { 'id': 19, 'email': 'example1@test.com' }
      ],
      'actions': [{
        'id': 'update',
        'text': 'Редактировать',
        'icon': 'edit',
        'form': 'user'
      }],
      'rowActions': [{
        'id': 'update',
        'text': 'Редактировать',
        'icon': 'edit',
        'form': 'user'
      }, {
        'id': 'delete',
        'text': 'Удалить',
        'icon': 'delete',
        'form': 'user',
        'confirm': {
          'title': 'Требуется подтверждение действия',
          'message': 'Вы уверены что следует продолжать?)',
          'icon': 'exclamation-circle',
          'okText': 'Да',
          'okType': 'primary',
          'cancelText': 'Нет'
        }
      }],
      'pagination': {
        'showSizeChanger': true,
        'total': 19,
        'currentPage': 1,
        'perPage': 10,
        'last': 2
      }
    }
  })
}

Mock.mock(/\/resource/, 'get', resource)
