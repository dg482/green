<template>
  <div>
    <table-builder
      :key="key"
      :size="'default'"
      :button-size="'small'"
      :url="'api/resource'"
      :params="params"
      :table="table"/>
  </div>
</template>

<script>
import TableBuilder from '@/components/Tables/TableBuilder'
import { resource } from '@/api/resource'

export default {
  name: 'Resource',
  components: {
    'table-builder': TableBuilder
  },
  data () {
    return {
      table: null,
      key: 'default',
      params: {
        resource: this.$route.meta.resource
      }
    }
  },
  watch: {
    $route (to) {
      if (to.meta.resource) {
        this.key = this.params.resource = to.meta.resource

        this.load()
      }
    }
  },
  methods: {
    load () {
      const update = (response) => {
        this.table = response.result.result
      }
      const setException = (exception) => this.$store.dispatch('service/ACTION_SET_EXCEPTION', exception)

      update({ result: { result: null } })

      resource(this.params)
        .then(function (response) {
          if (response.result.success) {
            update(response)
          } else {
            console.log(response.data)
            if (response.data.exception) {
              setException(response.data.exception)
            }

            update({
              result: {
                result: {
                  title: 'Ошибка загрузки данных',
                  columns: [],
                  data: []
                }
              }
            })
          }
          return response
        })
    }
  },
  mounted () {
    this.load()
  }
}
</script>

<style scoped>

</style>
