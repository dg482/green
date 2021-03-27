import Mock from 'mockjs2'
import { builder } from '../util'

const info = (options) => {
  console.log('options', options)
  const userInfo = {
    'id': '4291d7da9005377ec9aec4a71ea837f',
    'name': 'Андрей Николаевич М.',
    'username': 'admin',
    'describe': 'Уфа, FastDog',
    'password': '',
    'avatar': '/avatar2.jpg',
    'status': 1,
    'telephone': '',
    'lastLoginIp': '27.154.74.117',
    'lastLoginTime': 1534837621348,
    'creatorId': 'admin',
    'createTime': 1497160610259,
    'merchantCode': 'TLif2btpzg079h15bk',
    'deleted': 0,
    'roleId': 'admin',
    'role': {}
  }
  // role
  const roleObj = {
    'id': 'admin',
    'name': 'Мартынов Андрей Николаевич',
    'describe': 'Уфа, FastDog',
    'status': 1,
    'creatorId': 'system',
    'createTime': 1497160610259,
    'deleted': 0,
    'permissions': [{
      'roleId': 'admin',
      'permissionId': 'dashboard',
      'permissionName': '仪表盘',
      'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      'actionEntitySet': [{
        'action': 'add',
        'describe': '新增',
        'defaultCheck': false
      }, {
        'action': 'query',
        'describe': '查询',
        'defaultCheck': false
      }, {
        'action': 'get',
        'describe': '详情',
        'defaultCheck': false
      }, {
        'action': 'update',
        'describe': '修改',
        'defaultCheck': false
      }, {
        'action': 'delete',
        'describe': '删除',
        'defaultCheck': false
      }],
      'actionList': null,
      'dataAccess': null
    },
      {
        'roleId': 'admin',
        'permissionId': 'user',
        'permissionName': '用户管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        }, {
          'action': 'import',
          'describe': '导入',
          'defaultCheck': false
        }, {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        }, {
          'action': 'update',
          'describe': '修改',
          'defaultCheck': false
        }, {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        }, {
          'action': 'export',
          'describe': '导出',
          'defaultCheck': false
        }],
        'actionList': null,
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'form',
        'permissionName': 'Form',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        }, {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        }, {
          'action': 'update',
          'describe': '修改',
          'defaultCheck': false
        }, {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        }],
        'actionList': null,
        'dataAccess': null
      }
    ]
  }

  roleObj.permissions.push({
    'roleId': 'admin',
    'permissionId': 'support',
    'permissionName': '超级模块',
    'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
    'actionEntitySet': [{
      'action': 'add',
      'describe': '新增',
      'defaultCheck': false
    }, {
      'action': 'import',
      'describe': '导入',
      'defaultCheck': false
    }, {
      'action': 'get',
      'describe': '详情',
      'defaultCheck': false
    }, {
      'action': 'update',
      'describe': '修改',
      'defaultCheck': false
    }, {
      'action': 'delete',
      'describe': '删除',
      'defaultCheck': false
    }, {
      'action': 'export',
      'describe': '导出',
      'defaultCheck': false
    }],
    'actionList': null,
    'dataAccess': null
  })

  userInfo.role = roleObj
  return builder(userInfo)
}

const userNav = (options) => {
  const nav = [
    // dashboard
    {
      'name': 'dashboard',
      'parentId': 0,
      'id': 1,
      'meta': {
        'icon': 'dashboard',
        'title': 'Администрирование',
        'show': true
      },
      'component': 'RouteView',
      'redirect': '/dashboard/workplace'
    },
    {
      'name': 'workplace',
      'parentId': 1,
      'id': 7,
      'meta': {
        'title': 'Рабочий стол',
        'show': true
      },
      'component': 'Workplace'
    },
    // account
    {
      'name': 'account',
      'parentId': 0,
      'id': 10028,
      'meta': {
        'title': 'Персонализация',
        'icon': 'user',
        'show': true
      },
      'redirect': '/account/center',
      'component': 'RouteView'
    },
    {
      'name': 'center',
      'parentId': 10028,
      'id': 10029,
      'meta': {
        'title': 'Профиль',
        'show': true
      },
      'component': 'account/center'
    },
    {
      'name': 'settings',
      'parentId': 10028,
      'id': 10030,
      'meta': {
        'title': 'Настройки',
        'show': true
      },
      'component': 'account/setting'
    },
    {
      'name': 'form',
      'parentId': 0,
      'id': 10100,
      'meta': {
        'icon': 'setting',
        'title': 'Ресурсы',
        'show': true
      },
      'redirect': '/resource/builder',
      'component': 'RouteView'
    },
    {
      'name': 'builder',
      'parentId': 10100,
      'id': 10101,
      'meta': {
        'title': 'Пользователи',
        'icon': 'team',
        'show': true,
        'resource': 'user'
      },
      'component': 'resource/builder'
    }
  ]
  const json = builder(nav)
  console.log('json', json)
  return json
}

Mock.mock(/\/api\/user\/info/, 'get', info)
Mock.mock(/\/api\/user\/nav/, 'get', userNav)
