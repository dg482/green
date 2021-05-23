<template>
  <a-drawer
    v-if="useDrawer"
    :visible="isVisible"
    :title="(form) ? form.title : '' "
    :placement="placement()"
    :closable="true"
    @close="onClose"
    :afterVisibleChange="afterVisibleChange"
    :width="width()">
    <div style="padding-top: 250px; text-align: center" v-if="!form">
      <a-spin tip=" Выполнение команды..." size="large">
        <a-icon slot="indicator" type="loading" style="font-size: 24px"/>
      </a-spin>
    </div>
    {{ notification }}
    <transition name="slide-fade">
      <div style="padding-bottom: 55px; padding-top: 55px">
        <a-form-model
          v-if="form"
          ref="ruleForm"
          :model="form.values"
          :rules="form.validator"
          v-bind="formItemLayout">
          <VuePerfectScrollbar class="app-sidebar-scroll">
            <template v-for="element in form.items">
              <elements :element="element" :errors="errors" :form="form" :key="element.id"/>
            </template>
          </VuePerfectScrollbar>
          <div class="bottom-buttons">
            <a-button style="float: left" icon="setting" type="dashed" @click.prevent="openSetting">
              {{ $t('resource.form.buttons.setting') }}
            </a-button>
            <template v-for="(button, idx) in form.actions">
              <a-button
                style="margin-right: 8px"
                :key="idx"
                :type="errors.length > 0?'danger':button.type"
                :icon="button.icon"
                :loading="button.load"
                :disabled="button.disabled"
                :size="size"
                @click="onAction(button)">
                {{ button.text }}
              </a-button>
            </template>
          </div>
        </a-form-model>
      </div>
    </transition>
    <setting :alias="$route.meta.resource"/>
  </a-drawer>
  <div v-else>
    <transition name="slide-fade">
      <div>
        <a-form-model
          v-if="form"
          ref="ruleForm"
          :model="form.values"
          :rules="form.validator"
          v-bind="formItemLayout">
          <template v-for="element in form.items">
            <elements :element="element" :form="form" :key="element.id"/>
          </template>
        </a-form-model>
        <div class="buttons">
          <a-button style="float: left" icon="setting" type="dashed" @click.prevent="openSetting">
            {{ $t('resource.form.buttons.setting') }}
          </a-button>
          <template v-for="(button, idx) in form.actions">
            <a-button
              style="margin-right: 8px"
              :key="idx"
              :type="errors.length > 0?'danger':button.type"
              :icon="button.icon"
              :loading="button.load"
              :disabled="button.disabled"
              :size="size"
              @click="onAction(button)">
              {{ button.text }}
            </a-button>
          </template>
        </div>
      </div>
    </transition>
    <setting :alias="$route.meta.resource"/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Elements from './Elements'
import moment from 'moment'
import { FormModel } from 'ant-design-vue'
import SettingsForm from './SettingsForm'
import { post } from '../../api/service'

export default {
  name: 'FormBuilder',
  components: {
    VuePerfectScrollbar,
    'elements': Elements,
    'a-form-model': FormModel,
    'setting': SettingsForm
  },
  props: {
    isVisible: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: String,
      default: () => ''
    },
    record: {
      type: Object,
      default: () => null
    },
    form: {
      type: Object,
      default: () => null
    },
    onLoad: {
      type: Function,
      default: () => null
    },
    onCloseDrawer: {
      type: Function,
      default: () => null
    },
    useDrawer: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapGetters({
      drawer: 'GET_DRAWER',
      size: 'GET_UI_SIZE',
      notification: 'GET_NOTIFICATION'
    })
  },
  watch: {
    notification: function (n) {
      this.$notification.open(n)
    }
  },
  data () {
    return {
      // form: null,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 10 },
          md: { spam: 10 },
          lg: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
          md: { span: 14 },
          lg: { span: 18 }
        }
      },
      errors: []
    }
  },
  mounted () {
    this.$store.dispatch('ACTION_UI_SET_SIZE')
    // this.form = this.formById(this.id);
  },
  methods: {
    placement () {
      switch (parseInt(Vue.localStorage.get('settings/ui.drawer.placement'))) {
        case 1:
          return 'left'
        case 2:
          return 'right'
        default:
          return 'left'
      }
    },
    width: () => {
      const width = (window.outerWidth / 2)
      switch (parseInt(Vue.localStorage.get('settings/ui.drawer.width'))) {
        case 50:
          return window.outerWidth * 50 / 100
        case 40:
          return window.outerWidth * 40 / 100
        case 30:
          return window.outerWidth * 30 / 100
        case 25:
          return window.outerWidth * 25 / 100
        case 0:
          return width < 850 ? window.outerWidth : 850
        default:
          return window.outerWidth * 50 / 100
      }
    },
    onSubmit: () => {

    },
    onClose (success) {
      this.$store.dispatch('ACTION_FORM_CLEAR', {
        id: this.id
      })

      this.onCloseDrawer(success)

      this.errors = []
    },
    onAction (button) {
      const me = this
      const getValue = function (value) {
        if (moment.isMoment(value)) {
          return value.unix()
        }
        if (typeof value === 'object') {
          if (value.type !== undefined) {
            return value// blob
          } else {
            return JSON.stringify(value)
          }
        }
        return value
      }
      const setErrors = (errors) => {
        this.errors = (Array.isArray(errors)) ? errors : Object.values(errors)
        const message = []
        this.errors.map(function (error) {
          message.push(error)
        })
        this.$store.dispatch('ACTION_SET_NOTIFICATION', {
          type: 'error',
          message: 'Ошибка выполнения команды',
          description: message.join('<br />')
        })
      }
      const setNotification = (notification) => {
        this.$store.dispatch('ACTION_SET_NOTIFICATION', notification)
      }
      const loadingButton = (button, state) => {
        if (Array.isArray(me.form.actions)) {
          me.form.actions = me.form.actions.map(function (btn) {
            if (btn.action === button.action) {
              btn.load = state ?? false
            }
            return btn
          })
        }
      }
      const formData = new FormData()
      formData.append('form', this.form.form)

      for (var name in this.form.values) {
        const value = this.form.values[name]
        switch (name) {
          case 'id':
            formData.append('id', getValue(value))
            formData.append('values[' + name + ']', getValue(value))
            break
          default:
            console.log(value)
            if (Array.isArray(value)) {
              if (value.length > 1) {
                for (const i in value) {
                  formData.append('values[' + name + '][]', getValue(value[i]))
                }
              } else {
                if (value[0] && value[0].type !== undefined) {
                  formData.append('values[' + name + ']', getValue(value[0]))
                }
              }
            } else {
              formData.append('values[' + name + ']', getValue(value))
            }
            break
        }
      }

      switch (button.action) {
        case 'action_save':
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              loadingButton(button, true)

              this.$store.dispatch('ACTION_FORM_SAVE', formData).then(function (response) {
                loadingButton(button, false)
                if (response.success) {
                  switch (response.form.form) {
                    case 'settings/ui':
                      me.$store.dispatch('UI_SET_APP_KEY')
                      break
                  }
                  setNotification({ type: 'success', message: 'Команда выполнена успешно' })
                  me.errors = []
                  me.onClose(true)
                } else if (response.errors) {
                  setErrors(response.errors)
                }
                return response
              }).catch(function (error) {
                loadingButton(button, false)
                console.log(error)
              })
            } else {
              return false
            }
          })
          break
        case 'action_cancel':
        default:
          const validate = button.action.includes('validate')
          formData.append('alias', this.$route.meta.resource)
          formData.append('action', button.action)
          const run = () => {
            loadingButton(button, true)
            post('resource/action', formData).then((response) => {
              loadingButton(button, false)
              if (response.success) {
                me.onClose(true)
              } else {
                setNotification({
                  type: 'error',
                  message: 'Ошибка выполнения команды',
                  description: response.message
                })
              }
            }).catch(function (error) {
              loadingButton(button, false)
              console.log('error', error)
            })
          }

          (validate) ? this.$refs.ruleForm.validate((valid) => run()) : run()
          break
      }
      setTimeout(function () {
        button.load = false
      }, 1000)
    },
    afterVisibleChange () {

    },
    openSetting () {
      this.$store.dispatch('ACTION_SET_OPEN_SETTING_FORM')
    }
  }
}
</script>

<style>
.w-auto {
  width: auto !important;
}

fieldset.border {
  border: 1px groove #eeeeee57 !important;
  padding: 0 1.4em 1.4em 1.4em !important;
  /*margin: 0 0 1.5em 0 !important;*/
}

fieldset.text-primary {
  border-color: #1890ff !important;
}

fieldset.text-danger {
  border-color: #EE0023 !important;
}

fieldset.text-warning {
  border-color: #f7b924 !important;
}

fieldset.text-success {
  border-color: #3ac47d !important;
}

fieldset.text-info {
  border-color: #16aaff !important;
}

legend {
  border: none !important;
  margin-bottom: 5px !important;
}

.ant-row.ant-form-item {
  margin-bottom: 2px;
}

.ant-drawer-header {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  background-color: white;
  z-index: 1000;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}

.bottom-buttons {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
}

.buttons {
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding-top: 10px;
  text-align: right;
  background: #fff;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
}
</style>
