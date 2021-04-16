import { get } from './service'

const api = {
  form: '/resource/form'
}

export function getForm (parameter) {
  const form = parameter.form.split('/')
  return get(api.form, {
    alias: form[0],
    form: form[1],
    id: parameter.id
  })
}
