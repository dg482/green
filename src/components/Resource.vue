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
import request from '@/utils/request'

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
        this.table = response.data.table
      }
      const setException = (exception) => this.$store.dispatch('service/ACTION_SET_EXCEPTION', exception)

      update({ data: { table: null } })

      request({
        url: '/resource',
        method: 'get',
        params: this.params
      }).then(function (response) {
        if (response.data.success) {
          update(response)
        } else {
          console.log(response.data)
          if (response.data.exception) {
            setException(response.data.exception)
          }

          update({
            data: {
              table: {
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
