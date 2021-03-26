<template>
  <div>
    <a-card v-if="exception!==null">
      <exception v-if="$store.getters['service/exception']"/>
    </a-card>
    <a-card
      :loading="!table"
      v-if="exception === null"
      :class="{'table':table}">
      <a-page-header
        slot="title"
        :title="(table) ? table.title : 'Загрузка данных ...'"
        style="padding: 0 !important;"
        @back="() => $router.go(-1)"
      >
      </a-page-header>
      <template slot="extra">
        <a-dropdown v-if="table && table.actions">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item
              v-for="action in table.actions"
              :key="action.id"
              :disabled="getActionActive(action)">
              <a-icon :type="action.icon"/>
              {{ action.text }}
            </a-menu-item>
            <a-menu-divider/>
            <a-menu-item key="reload">
              <a-icon type="reload"/>
              Обновить данные
            </a-menu-item>
            <a-menu-item key="setting">
              <a-icon type="setting"/>
              Настройки таблицы
            </a-menu-item>
          </a-menu>
          <a-button> Действия
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </template>
      <a-table
        v-if="table"
        :locale="{emptyText: 'Нет данных для отображения'}"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="tbl().columns"
        :data-source="tbl().data"
        :size="size"
        :rowKey="'_id'"
        :loading="loading"
        :pagination="tbl.pagination"
        :scroll="{y:scrollY,x:((table.columns.length - 2) * 200) + 150}"
        :class="classTable()"
        :customRow="(record) => {
          return {
            on:{
              dblclick: (event) => {
                runAction(getActionById('update'), record)
              }
            }
          }
        }"
        @change="handleTableChange">
        <span slot="file" slot-scope="value, record">
          <file-cell :record="record" :value="value"/>
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-for="action in table.rowActions">
            <a-popconfirm
              v-if="action.confirm"
              @confirm="() => runAction(action.id, record)"
              :okType="action.confirm.okType"
              :okText="action.confirm.okText"
              :cancelText="action.confirm.cancelText"
              :key="action.id">
              <template slot="title">
                <h6>{{ action.confirm.title }}</h6>
                <p>{{ action.confirm.message }}</p>
              </template>
              <a-icon
                slot="icon"
                v-if="action.confirm.icon"
                :type="action.confirm.icon"/>
              <a-button
                :size="buttonSize"
                :key="action.id"
                :class="'mr-1'">
                <a-icon :type="action.icon"/>
              </a-button>
            </a-popconfirm>
            <a-button
              v-else
              :size="buttonSize"
              @click="(e)=>handleButtonClick(e, action, record)"
              :key="action.id"
              :class="'mr-1'">
              <a-icon :type="action.icon"/>
            </a-button>
          </template>
        </span>
      </a-table>
      <FormBuilder
        :id="formId"
        :use-drawer="true"
        :isVisible="formIsVisible"
        :form="formLoad"
        :onCloseDrawer="formOnClose"
      />
    </a-card>
  </div>
</template>

<script>
import request from '@/utils/request'
import FormBuilder from '../Forms/FormBuilder'
import Exception from '@/components/Exception'
import { mapGetters } from 'vuex'

export default {
  name: 'TableBuilder',
  props: ['table', 'size', 'buttonSize', 'url', 'params', 'relation'],
  components: {
    FormBuilder,
    Exception,
    'file-cell': () => import('./Cells/FileCell')
  },
  computed: {
    ...mapGetters({
      exception: 'service/exception'
    })
  },
  data () {
    return {
      formId: 'default',
      formLoad: null,
      loading: false,
      formIsVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      tbl: () => (this.table_update) ? this.table_update : this.table,
      table_update: null,
      tableKey: Math.random().toString(36),
      scrollY: ((window.innerHeight - 355) < 350) ? 350 : (window.innerHeight - 355)
      // scrollX: (this.table.column && this.table.column.length) ? ((this.table.column.length - 2) * 200) + 150 : 0
    }
  },
  methods: {
    classTable () {
      let cls = ''
      const table = (this.table_update) ? this.table_update : this.table
      if (table.columns) {
        table.columns.map(function (column) {
          switch (column.type) {
            case 'file':
              cls += ' with-files '
              break
            default:
              break
          }
        })
      }

      return cls
    },
    handleTableChange (pagination, filters, sorter) {
      if (this.size !== 'small') {
        const pager = { ...this.tbl.pagination }
        pager.current = pagination.current
        this.pagination = pager

        request({
          url: this.url,
          method: 'get',
          params: {
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters
          }
        })
      }
    },
    formOnClose (success) {
      this.formIsVisible = false
      this.formLoad = null
      if (success === true) {
        this.runAction({ id: 'reload' })
      }
    },
    getRowActions () {
      return this.table.rowActions
    },
    getActions () {
      return this.table.actions
    },
    getActionActive (action) {
      switch (action.id) {
        case 'create':
          return this.selectedRowKeys.length > 0
        case 'update':
          return this.selectedRowKeys.length !== 1
        case 'delete':
          return this.selectedRowKeys.length === 0
        default:
          return false
      }
    },
    getColumns () {
      return this.table.columns
    },
    getSelectedRow () {
      return this.selectedRows.length > 0 ? this.selectedRows[0] : {
        id: 0
      }
    },
    getActionById (id) {
      const action = this.getActions().filter(function (action) {
        return action.id === id
      })
      return action.length > 0 ? action[0] : { id: id, form: '' }
    },
    handleMenuClick (e) {
      this.runAction(this.getActionById(e.key), this.getSelectedRow())
    },
    handleButtonClick (e, action, record) {
      this.runAction(action, record)
    },
    runAction (action, record) {
      const load = (set) => {
        this.loading = set
      }
      const update = (response) => {
        load(false)
        if (response.data.success) {
          this.table_update = (this.relation) ? response.data.form.values[this.relation] : response.data.table
          this.tableKey = Math.random().toString(36)
        }
        return response
      }
      const setForm = (form) => {
        this.formId = form
      }
      const setFormLoad = () => {
        this.formLoad = this.$store.getters['service/GET_FORM'](this.formId)
      }

      setForm(action.form)

      switch (action.id) {
        case 'update':
          this.formIsVisible = true
          this.$store.dispatch('service/ACTION_FORM_GET', {
            form: action.form,
            id: record.id
          }).then(function (response) {
            setFormLoad()
            return response
          })
          break
        case 'create':
          break
        case 'reload':
          load(true)
          console.log(this.url, this.params)
          request({
            url: this.url,
            method: 'get',
            params: this.params
          }).then(function (response) {
            return update(response)
          }).catch(function (error) {
            load(false)
            return error
          })
          break
      }
    },
    onSelectChange (selectedRowKeys, rows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, rows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = rows
    }
  }
}
</script>

<style>
.with-files .ant-table-tbody tr td {
  height: 90px !important;
}

.table .ant-card-body {
  padding: 0 !important;
}

.table .ant-pagination {
  margin-right: 20px;
}

.table .ant-upload-list-picture-card .ant-upload-list-item {
  width: 50px !important;
  height: 50px !important;
  margin: 0 !important;
  padding: 2px !important;
}

.ant-upload-list-picture-card-container {
  height: 50px !important;
  margin: 0 !important;
}
</style>