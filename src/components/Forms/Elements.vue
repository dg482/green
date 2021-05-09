<template>
  <div>
    <template v-if="!element.items || (element.items && element.items.length === 0)">
      <a-form-model-item
        v-if="element.type !== 'hidden'"
        :label="element.name"
        v-model="form.values"
        :key="element.id"
        :ref="element.field"
        :prop="element.field"
        :labelCol="['table'].indexOf(element.type) !== -1 ?{span:24}:null"
        :wrapperCol="['table'].indexOf(element.type) !== -1 ?{span:24}:null">
        <div class="ant-editor-quill" v-if="element.type === 'text'">
          <quill-editor
            v-model="form.values[element.field]"
            ref="myQuillEditor"
            :options="editorOption">
          </quill-editor>
        </div>
        <a-date-picker
          :locale="locale"
          :mode="'date'"
          :format="'YYYY-MM-DD'"
          v-model="form.values[element.field]"
          v-if="element.type === 'date'"
        />
        <div v-if="element.type === 'file'">
          <a-spin :spinning="uploadSpin">
            <a-upload
              :action="element.action"
              :multiple="element.multiple"
              list-type="picture"
              :headers="headers"
              :withCredentials="true"
              :data="element.data"
              :before-upload="beforeUpload"
              @change="handleChange"
              :default-file-list="getFileList()"
            >
              <a-button icon="upload">
                {{ 'Загрузить' }}
              </a-button>
            </a-upload>
          </a-spin>
        </div>
        <a-input
          v-if="['string'].includes(element.type)"
          v-model="form.values[element.field]"
          :disabled="element.disabled"/>
        <a-input-password
          v-if="element.type === 'password'"
          v-model="form.values[element.field]"
          :disabled="element.disabled"/>
        <a-input-number
          v-if="['smallint','int','bigint','float'].includes(element.type)"
          v-model="form.values[element.field]"
          :precision="getPrecision(element)"
          :disabled="element.disabled"/>
        <a-switch
          v-if="element.type === 'switch'"
          v-model="form.values[element.field]"
          @change="() => onChangeSwitch(element)"
          :disabled="element.disabled"/>
        <a-select
          v-if="element.type === 'select'"
          v-model="form.values[element.field]"
          :placeholder="element.placeholder">
          <a-select-option
            v-for="(option, index) in element.variant"
            :key="(index + 9).toString(36) + option.id"
            :value="option.id">
            {{ option.value }}
          </a-select-option>
        </a-select>
        <template v-if="element.type === 'table'">
          <table-builder
            :size="'small'"
            :url="'api/form'"
            :button-size="'small'"
            :relation="element.field"
            :params="{id:form.values.id, form: form.form}"
            :table="form.values[element.field]"/>
        </template>
        <badge :element="element"></badge>
        <div v-if="element.type === 'display'" v-html="element.value.value" :style="element.style"/>
      </a-form-model-item>
    </template>
    <template>
      <fieldset
        v-if="element.type === 'fieldset'"
        :key="element.id"
        class="border p-2"
        :class="(element.attributes.fieldset)?element.attributes.fieldset.class:''">
        <legend
          class="w-auto"
          :class="(element.attributes.legend)?element.attributes.legend.class:''">{{ element.name }}
        </legend>
        <elements
          v-for="child in element.items"
          :element="child"
          :form="form"
          :key="child.id"/>
      </fieldset>
    </template>
    <template>
      <a-tabs
        v-if="element.type === 'tabs'"
        :key="element.id">
        <a-tab-pane
          v-for="child in element.items"
          :key="child.id"
          :tab="child.name">
          <elements
            v-for="_child in child.items"
            :element="_child"
            :form="form"
            :key="_child.id"/>
        </a-tab-pane>
      </a-tabs>
    </template>
  </div>
</template>

<script>
// import theme style
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Badge from './Badge'
import Cookies from 'js-cookie'
import locale from 'ant-design-vue/es/date-picker/locale/ru_RU'
import FormItem from 'ant-design-vue/es/form-model/FormItem'
import { post } from '../../api/service'
import { quillEditor } from 'vue-quill-editor'
import { deleteFile } from '../../api/form'
import notification from 'ant-design-vue/lib/notification'
import { i18nRender } from '@/locales'

export default {
  name: 'Elements',
  // props: ['element', 'form', 'errors'],
  props: {
    element: {
      type: Object,
      default: () => null
    },
    form: {
      type: Object,
      default: () => null
    },
    errors: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'table-builder': () => import('../Tables/TableBuilder'),
    'badge': Badge,
    'a-form-model-item': FormItem,
    quillEditor
  },
  computed: {},
  data () {
    return {
      editorOption: {
        theme: 'snow'
      },
      locale,
      previewVisible: false,
      previewImage: '',
      headers: {
        Authorization: 'Bearer ' + Cookies.get('fdb_wb_token')
      },
      params: {
        alias: this.$route.meta.resource
      },
      uploadSpin: false
    }
  },
  methods: {
    getFileList () {
      let value = this.form.values[this.element.field]
      if (value === undefined) {
        this.form.values[this.element.field] = []
        return []
      }
      if (!Array.isArray(value)) {
        value = Object.values(value)
      }
      value = value.filter(function (item) {
        return item.value !== undefined
      }).map(function (item) {
        return {
          uid: item.id,
          name: item.value,
          url: process.env.VUE_APP_BASE_URL + item.value
        }
      })
      return value
    },
    onChangeSwitch (element) {
      console.log(this.form)
      if (element.action) {
        post('resource/switch-action', {
          form: this.form.form,
          action: element.action,
          checked: this.form.values[element.field],
          values: this.form.values
        }).then((response) => {
          console.log(response)
        })
      }
    },
    getPrecision (element) {
      return (element.type === 'float') ? 2 : 0
    },
    handleChange ({ file }) {
      const { element, form } = this
      const spin = (state) => {
        this.uploadSpin = state
      }
      if (file.status !== 'uploading') {
        switch (file.status) {
          case 'removed':
            spin(true)
            deleteFile(file, this.params).then(function (response) {
              notification.success({
                message: i18nRender('resource.delete.success.title'),
                description: i18nRender('resource.file.delete.success.description')
              })
              spin(false)
            }).catch(function (error) {
              spin(false)
              notification.error({
                message: i18nRender('resource.delete.error.title'),
                description: i18nRender('resource.file.delete.error.description')
              })
              return error
            })
            if (element.multiple === false) {
              form.values[element.field] = []
            }
            break
          default:
            break
        }
      }
    },
    beforeUpload (file) {
      const { element, form } = this
      if (!Array.isArray(form.values[element.field])) {
        form.values[element.field] = []
      }
      form.values[element.field].push(file)
      return false
    }
  }
}
</script>

<style lang="less">
@import url('../index.less');

/* 覆盖 quill 默认边框圆角为 ant 默认圆角，用于统一 ant 组件风格 */
.ant-editor-quill {
  line-height: initial;

  /deep/ .ql-toolbar.ql-snow {
    border-radius: @border-radius-base @border-radius-base 0 0;
  }
  /deep/ .ql-container.ql-snow {
    border-radius: 0 0 @border-radius-base @border-radius-base;
  }
}

.quill-editor {
  .ql-container {
    min-height: 30vh;
  }
}

.editor {
  width: 100%;
  height: 100vh;
  .flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
}
</style>
