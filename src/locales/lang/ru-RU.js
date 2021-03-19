import antd from 'ant-design-vue/es/locale-provider/ru_RU'
import momentRU from 'moment/locale/ru'
import global from './zh-CN/global'

import menu from './ru-RU/menu'
import setting from './zh-CN/setting'
import user from './ru-RU/user'
import dashboard from './zh-CN/dashboard'
import form from './zh-CN/form'
import result from './zh-CN/result'
import account from './zh-CN/account'

const components = {
  antLocale: antd,
  momentName: 'ru-ru',
  momentLocale: momentRU
}

export default {
  message: '-',

  'layouts.usermenu.dialog.title': 'Сообщение',
  'layouts.usermenu.dialog.content': 'Вы действительно хотите выйти',
  'layouts.userLayout.title': 'Авторизация',
  'layouts.userLayout.description': 'FastDog интерфейс администрирования.',
  ...components,
  ...global,
  ...menu,
  ...setting,
  ...user,
  ...dashboard,
  ...form,
  ...result,
  ...account
}
