<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="[24,16]">
      <a-col :md="24" :lg="24">
        <page-header-wrapper/>
      </a-col>
    </a-row>
    <a-row :gutter="[24,16]">
      <FormBuilder
        :id="formId"
        :use-drawer="true"
        :isVisible="formIsVisible"
        :form="formLoad"
        :onCloseDrawer="formOnClose"/>
    </a-row>
  </div>
</template>

<script>
import FormBuilder from '@/components/Forms/FormBuilder'

export default {
  name: 'Builder',
  components: {
    FormBuilder
  },
  data () {
    return {
      formId: 'default',
      formLoad: null,
      loading: false,
      formIsVisible: false
    }
  },
  methods: {
    formOnClose (success) {
      this.formIsVisible = false
      this.formLoad = null
      // if (success === true) {
      //   this.runAction({ id: 'reload' })
      // }
    }
  }
}
</script>
