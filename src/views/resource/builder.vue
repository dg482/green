<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="[24,16]">
      <a-col :md="24" :lg="24">
        <page-header-wrapper :title="false"/>
      </a-col>
    </a-row>
    <a-row :gutter="[24,16]">
      <Resource />
    </a-row>
  </div>
</template>

<script>
import Resource from '@/components/Resource'

export default {
  name: 'Builder',
  components: {
    Resource
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
