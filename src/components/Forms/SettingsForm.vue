<template>
  <a-modal
    :visible="visible"
    :title="$t('resource.form.setting')"
    centered
    @ok="close"
    @cancel="close"
    width="800px"
  >
    <a-row :gutter="[24,16]">
      <a-spin :spinning="loading">
        <a-col v-if="storeForm === null">
          <a-alert :message="$t('resource.forms.setting.warning.empty_form_structure')" type="warning" show-icon/>
        </a-col>
      </a-spin>
    </a-row>
  </a-modal>
</template>

<script>
import { Tree } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { get } from '../../api/service'

export default {
  name: 'SettingsForm',
  props: {
    alias: {
      type: String,
      default: () => ''
    }
  },
  components: {
    'a-tree': Tree
  },
  computed: {
    ...mapGetters({
      visible: 'GET_SETTING_FORM'
    })
  },
  data () {
    return {
      loading: false,
      storeForm: []
    }
  },
  watch: {
    visible: function (v) {
      if (v) {
        this.loadFields()
      }
    }
  },
  methods: {
    loadFields () {
      this.storeForm = this.$store.getters['GET_FIELDS_FORM'](this.alias)

      get('resource/fields', {
        alias: this.alias
      }).then((response) => {
        console.log(response)
      })
    },
    close () {
      this.$store.dispatch('ACTION_SET_CLOSE_SETTING_FORM')
    }
  }
}
</script>

<style scoped>

</style>
