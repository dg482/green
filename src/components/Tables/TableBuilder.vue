<template>
  <div>
    <a-card v-if="exception!==null">
      <exception v-if="$store.getters['exception']"/>
    </a-card>
    <a-card
      :loading="!table"
      v-if="exception === null"
      :class="{'table':table}">
      <a-page-header
        slot="title"
        :title="(table) ? table.title : $t('resource.table.loading') "
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
              {{ $t('resource.table.update') }}
            </a-menu-item>
            <a-menu-item key="setting">
              <a-icon type="setting"/>
              {{ $t('resource.table.setting') }}
            </a-menu-item>
          </a-menu>
          <a-button> {{ $t('resource.table.actions') }}
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </template>
      <a-table
        v-if="table"
        :locale="{emptyText: $t('resource.table.filters.emptyText'), filterConfirm: $t('resource.table.filters.search') }"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="getColumns()"
        :data-source="tbl().data"
        :size="size"
        :rowKey="'id'"
        :loading="loading"
        :pagination="tbl().pagination"
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
              @confirm="() => runAction(action, record)"
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
        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          :style="{
            padding: ['date','datetime'].includes(column.type) ? '0' : '8px',
            width: (['date','datetime'].includes(column.type) && column.filterMultiple === false) ? '280px' :
              (['date','datetime'].includes(column.type) && column.filterMultiple === true) ? '560px' : 'auto',
            height: ['date','datetime'].includes(column.type) ? '386px' : 'auto',
          }"
        >
          <a-input
            v-if="column.type === 'string'"
            v-ant-ref="c => (searchInput = c)"
            :placeholder="$t('resource.table.filters.search')"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block;"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-range-picker
            :locale="locale"
            v-if="['date','datetime'].includes(column.type) && column.filterMultiple === true"
            dropdownClassName="filter-calendar"
            @change="(moment, range) => setSelectedKeys(range)"
            :open="openDate"/>
          <a-date-picker
            :locale="locale"
            v-if="['date','datetime'].includes(column.type) && column.filterMultiple === false"
            dropdownClassName="filter-calendar"
            @change="(moment, string) => setSelectedKeys(string ? [string] : [])"
            :open="openDate"
          />
          <div
            class="ant-table-filter-dropdown-btns"
            :style="{
              marginTop: ['date','datetime'].includes(column.type) ? '310px' : 0,
            }">
            <a
              class="ant-table-filter-dropdown-link confirm"
              @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)">{{ $t('resource.table.filters.search') }}</a>
            <a
              class="ant-table-filter-dropdown-link clear"
              @click="() => handleReset(clearFilters)">{{ $t('resource.table.filters.reset') }}</a>
          </div>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </a-table>
      <FormBuilder
        :id="formId"
        :use-drawer="true"
        :isVisible="formIsVisible"
        :form="formLoad"
        :onCloseDrawer="formOnClose"
      />
    </a-card>
    <setting
      v-if="table"
      :columns="tbl().columns"
      :alias="tableParams.alias"
    />
  </div>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/ru_RU'
import request from '@/utils/request'
import FormBuilder from '../Forms/FormBuilder'
import Exception from '@/components/Exception'
import { mapGetters } from 'vuex'
import SettingsTable from './SettingsTable'

export default {
  name: 'TableBuilder',
  props: {
    table: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: () => 'default'
    },
    buttonSize: {
      type: String,
      default: () => 'default'
    },
    url: {
      type: String,
      default: () => ''
    },
    params: {
      type: Object,
      default: () => {}
    },
    relation: {
      type: String,
      default: () => ''
    }
  },
  components: {
    FormBuilder,
    Exception,
    'file-cell': () => import('./Cells/FileCell'),
    'setting': SettingsTable
  },
  computed: {
    ...mapGetters({
      exception: 'exception'
    })
  },
  data () {
    return {
      formId: 'default',
      formLoad: null,
      searchInput: null,
      loading: false,
      openDate: false,
      locale: locale,
      formIsVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      tbl: () => (this.table_update) ? this.table_update : this.table,
      table_update: null,
      tableKey: Math.random().toString(36),
      scrollY: ((window.innerHeight - 355) < 350) ? 350 : (window.innerHeight - 355),
      tableParams: {
        alias: this.params.resource
      }
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
        this.tableParams = {
          alias: this.params.resource,
          results: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          filters: { ...filters }
        }
        this.updateTableData()
      }
    },
    updateTableData () {
      const loading = (loading) => { this.loading = loading }
      loading(true)
      return request({
        url: this.url,
        method: 'get',
        params: this.tableParams
      }).then((response) => {
        loading(false)
        this.updateTable(response)
      }).catch(() => { loading(false) })
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
      const open = (state) => { this.openDate = state }
      const focus = () => { this.searchInput.focus() }
      const storeColumns = this.$store.getters['GET_COLUMNS_TABLE'](this.tableParams.alias)
      const columns = this.tbl().columns.map(function (column) {
        if (['string'].includes(column.type)) {
          column.onFilterDropdownVisibleChange = visible => {
            if (visible) {
              setTimeout(() => {
                focus()
              }, 0)
            }
          }
        }
        if (['date', 'datetime'].includes(column.type)) {
          column.onFilterDropdownVisibleChange = visible => {
            open(visible)
          }
        }
        return column
      })

      if (storeColumns) {
        return storeColumns.map((item) => {
          const col = columns.filter((column) => {
            return column.dataIndex === item.key
          })
          return col[0]
        })
      }
      return columns
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
    updateTable (response) {
      this.table_update = (this.relation) ? response.form.values[this.relation] : response.table
      this.tableKey = Math.random().toString(36)
      return response
    },
    runAction (action, record) {
      const load = (set) => {
        this.loading = set
      }
      const update = (response) => {
        load(false)
        this.updateTable(response)
        return response
      }
      const setForm = (form) => {
        this.formId = form
      }
      const setFormLoad = () => {
        this.formLoad = this.$store.getters['GET_FORM'](this.formId)
        console.log('--->>> form load', this.formId, this.formLoad)
      }
      console.log('action', action)
      setForm(action.form)

      switch (action.id) {
        case 'update':
        case 'create':
          this.formIsVisible = true
          this.$store.dispatch('ACTION_FORM_GET', {
            form: action.form,
            id: (action.id === 'update') ? record.id : 0
          }).then(function (response) {
            setFormLoad()
            return response
          })
          break
        case 'reload':
          this.updateTableData()
          break
        case 'delete':
          load(true)
          request({
            url: this.url,
            method: 'delete',
            params: {
              alias: this.params.resource,
              id: record.id
            }
          }).then(function (response) {
            return update(response)
          }).catch(function (error) {
            load(false)
            return error
          })
          break
        case 'setting':
          this.$store.dispatch('ACTION_SET_OPEN_SETTING_TABLE')
          break
      }
    },
    onSelectChange (selectedRowKeys, rows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, rows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = rows
    },
    handleSearch (selectedKeys, confirm, dataIndex) {
      this.loading = true
      confirm()
      // this.searchText = selectedKeys[0]
      // this.searchedColumn = dataIndex
    },
    handleReset (clearFilters) {
      clearFilters()
      // this.searchText = ''
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

.mr-1 {
  margin-right: 2px;
}

.ant-table-filter-dropdown-link {
  margin: 5px;
}

.filter-calendar, .filter-calendar .ant-calendar {
  box-shadow: none !important;
}
</style>
