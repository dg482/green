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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Elements from './Elements'
import moment from 'moment'
import { FormModel } from 'ant-design-vue'

export default {
  name: 'FormBuilder',
  components: {
    VuePerfectScrollbar,
    'elements': Elements,
    'a-form-model': FormModel
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
      size: 'GET_UI_SIZE'
    })
  },
  watch: {},
  data () {
    return {
      // form: null,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 10 },
          md: { spam: 10 },
          lg: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
          md: { span: 14 },
          lg: { span: 16 }
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

      const formData = new FormData()

      switch (button.action) {
        case 'action_save':
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              button.load = true
              formData.append('form', this.form.form)

              for (var name in this.form.values) {
                const value = this.form.values[name]
                switch (name) {
                  case 'id':
                    formData.append('id', getValue(value))
                    formData.append('values[' + name + ']', getValue(value))
                    break
                  default:
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
              this.$store.dispatch('ACTION_FORM_SAVE', formData).then(function (response) {
                if (response.data.success) {
                  switch (response.data.form.form) {
                    case 'settings/ui':
                      me.$store.dispatch('UI_SET_APP_KEY')
                      break
                  }
                  setNotification({ type: 'success', message: 'Команда выполнена успешно' })
                  me.errors = []
                  me.onClose(true)
                } else if (response.data.errors) {
                  setErrors(response.data.errors)
                }
                return response
              }).catch(function (error) {
                console.log(error)
                if (error.response.data.errors) {
                  setErrors(error.response.data.errors)
                }
              })
            } else {
              return false
            }
          })

          break
        case 'action_cancel':
        default:
          this.$store.dispatch('ACTION_FORM_CLEAR')
          break
      }
      setTimeout(function () {
        button.load = false
      }, 1000)
    },
    afterVisibleChange () {

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

.anticon {
  vertical-align: 0 !important;
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
