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
        <a-date-picker
          :locale="locale"
          v-model="form.values[element.field]"
          v-if="element.type === 'date'"
        />
        <div v-if="element.type === 'file'">
          <a-upload
            v-if="!element.multiple"
            :action="element.action"
            :multiple="element.multiple"
            list-type="picture"
            :headers="headers"
            :withCredentials="true"
            :data="element.data"
            :before-upload="beforeUpload"
            @change="handleChange"
            :default-file-list="form.values[element.field]"
          >
            <a-button icon="upload">
              {{ 'Загрузить' }}
            </a-button>
          </a-upload>
        </div>
        <a-input
          v-if="['text','string'].includes(element.type)"
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
        <div v-if="element.type === 'display'" v-html="element.value.value" style="text-align: center; padding-top: 20px"/>
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
import Badge from './Badge'
import Cookies from 'js-cookie'
import locale from 'ant-design-vue/es/date-picker/locale/ru_RU'
import FormItem from 'ant-design-vue/es/form-model/FormItem'

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
      type: Object,
      default: () => null
    }
  },
  components: {
    'table-builder': () => import('../Tables/TableBuilder'),
    'badge': Badge,
    'a-form-model-item': FormItem
  },
  computed: {},
  data () {
    return {
      locale,
      previewVisible: false,
      previewImage: '',
      headers: {
        Authorization: 'Bearer ' + Cookies.get('fdb_wb_token')
      }
    }
  },
  methods: {
    getPrecision (element) {
      return (element.type === 'float') ? 2 : 0
    },
    handleChange ({ file }) {
      const { element, form } = this
      if (file.status !== 'uploading') {
        switch (file.status) {
          case 'removed':
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
      if (element.multiple === false) {
        form.values[element.field] = []
      }
      form.values[element.field].push(file)
      return false
    }
  }
}
</script>

<style scoped lang="scss">

</style>
