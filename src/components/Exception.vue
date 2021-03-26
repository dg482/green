<template>
  <div v-if="exception">
    <a-row>
      <a-col v-bind="layoutLeft" class="text-center">
        <a-icon type="bug" style="font-size: 15em; color:#EE0023"/>
      </a-col>
      <a-col v-bind="layoutRight">
        <h5>Ошибка выполнения запроса</h5>
        <p>
          Технический отчет уже отправлен в службу поддержки. Попробуйте обновить страницу или повторить действие
          позднее.
        </p>
      </a-col>
    </a-row>
    <FormBuilder
      :id="formId"
      :use-drawer="true"
      :isVisible="formIsVisible"
      :form="formLoad"
      :onCloseDrawer="formOnClose"
      v-if="formLoad"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormBuilder from './Forms/FormBuilder'

export default {
  name: 'Exception',
  props: ['type'],
  components: {
    FormBuilder
  },
  computed: {
    ...mapGetters({
      exception: 'service/exception'
    })
  },
  data () {
    return {
      process: process,
      formId: '',
      formIsVisible: false,
      formLoad: false,
      layoutLeft: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { spam: 12 },
        lg: { span: 8 }
      },
      layoutRight: {
        xs: { span: 24 },
        sm: { span: 26 },
        md: { spam: 12 },
        lg: { span: 16 }
      }
    }
  },
  methods: {
    createCompany () {
      const setForm = (form) => {
        this.formId = form
      }
      const setFormLoad = () => {
        this.formLoad = this.$store.getters['service/GET_FORM'](this.formId)
      }
      this.formIsVisible = true
      setForm('company/identity')
      this.$store.dispatch('service/ACTION_FORM_GET', {
        form: this.formId,
        id: 0
      }).then(function (response) {
        setFormLoad()
        return response
      })
    },
    formOnClose () {
      this.formIsVisible = false
      this.formLoad = null
    }
  }
}
</script>

<style scoped>

</style>
