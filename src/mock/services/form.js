import Mock from 'mockjs2'
import { builder } from '../util'

const form = () => {
  return builder({
    'success': true,
    'result': {
      'title': 'forms',
      'form': 'ui',
      'items': [
        {
          'id': 1616556595,
          'name': '',
          'type': 'hidden',
          'field': 'id',
          'disabled': false,
          'attributes': [],
          'validators': [],
          'value': {
            'id': 0,
            'value': ''
          }
        },
        {
          'id': 1616532180,
          'name': '',
          'type': 'string',
          'field': 'email',
          'disabled': false,
          'attributes': [],
          'validators': [
            {
              'idx': 'required',
              'rule': 'required',
              'trigger': [
                'blur',
                'change'
              ],
              'message': 'validation.required',
              'type': 'string',
              'required': true
            },
            {
              'idx': 'email',
              'rule': 'email',
              'trigger': [
                'blur',
                'change'
              ],
              'message': '\u041f\u043e\u043b\u0435 Email \u0437\u0430\u043f\u043e\u043b\u043d\u0435\u043d\u043d\u043e \u043d\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e!',
              'type': 'any'
            },
            {
              'idx': 'required',
              'rule': 'required',
              'trigger': [
                'blur',
                'change'
              ],
              'message': 'validation.required',
              'type': 'string',
              'required': true
            },
            {
              'idx': 'email',
              'rule': 'email',
              'trigger': [
                'blur',
                'change'
              ],
              'message': '\u041f\u043e\u043b\u0435 Email \u0437\u0430\u043f\u043e\u043b\u043d\u0435\u043d\u043d\u043e \u043d\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e!',
              'type': 'any'
            }
          ],
          'value': {
            'id': 0,
            'value': ''
          }
        },
        {
          'id': 1616558255,
          'name': 'Name',
          'type': 'string',
          'field': 'name',
          'disabled': false,
          'attributes': [],
          'validators': [
            {
              'idx': 'required',
              'rule': 'required',
              'trigger': [
                'blur',
                'change'
              ],
              'message': 'validation.required',
              'type': 'string',
              'required': true
            },
            {
              'idx': 'max',
              'rule': 'max:60',
              'trigger': [
                'blur',
                'change'
              ],
              'message': 'validation.max',
              'type': 'string',
              'max': 60,
              'length': 60
            }
          ],
          'value': {
            'id': 0,
            'value': ''
          }
        },
        {
          'id': 1616562505,
          'name': 'Password',
          'type': 'string',
          'field': 'password',
          'disabled': false,
          'attributes': [],
          'validators': [
            {
              'idx': 'required',
              'rule': 'required',
              'trigger': [
                'blur',
                'change'
              ],
              'message': 'validation.required',
              'type': 'string',
              'required': true
            },
            {
              'idx': 'min',
              'rule': 'min:6',
              'trigger': [
                'blur',
                'change'
              ],
              'message': 'validation.min',
              'type': 'string',
              'min': 6,
              'length': 6
            }
          ],
          'value': {
            'id': 0,
            'value': ''
          }
        },
        {
          'id': 1616595326,
          'name': '',
          'type': 'smallint',
          'field': 'age',
          'disabled': false,
          'attributes': [],
          'validators': [],
          'value': {
            'id': 0,
            'value': '0'
          }
        },
        {
          'id': 1616571484,
          'name': '',
          'type': 'float',
          'field': 'balance',
          'disabled': false,
          'attributes': [],
          'validators': [],
          'value': {
            'id': 0,
            'value': '0'
          }
        },
        {
          'id': 1616582772,
          'name': '',
          'type': 'bigint',
          'field': 'total',
          'disabled': false,
          'attributes': [],
          'validators': [],
          'value': {
            'id': 0,
            'value': '0'
          }
        }
      ],
      'actions': [
        {
          'text': '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c',
          'type': 'primary',
          'action': 'action_save',
          'icon': 'check',
          'shape': '',
          'isBlock': false,
          'isLoad': false
        },
        {
          'text': '\u041a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c',
          'type': 'default',
          'action': 'action_replicate',
          'icon': 'copy',
          'shape': '',
          'isBlock': false,
          'isLoad': false
        },
        {
          'text': '\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c',
          'type': 'danger',
          'action': 'action_cancel',
          'icon': 'close',
          'shape': '',
          'isBlock': false,
          'isLoad': false
        }
      ],
      'values': [],
      'validator': {
        'email': [
          'required',
          'email'
        ],
        'name': [
          'required',
          'max:60'
        ],
        'password': [
          'required',
          'min:6'
        ]
      },
      'context': 'Dg482\\Red\\Resource\\Resource'
    }
  })
}

Mock.mock(/\/form/, 'get', form)
