<template>
  <a-modal
    :visible="visible"
    :title="$t('resource.table.setting')"
    centered
    @ok="save"
    @cancel="close"
    width="800px"
  >
    <a-row :gutter="[24,16]">
      {{ storeColumns }}
      <a-col v-if="storeColumns === null">
        <a-alert :message="$t('resource.table.setting.warning.empty_store_columns')" type="warning" show-icon/>
      </a-col>
      <a-col>
        <a-transfer
          class="table-setting"
          :data-source="dataSource"
          :titles="['Source', 'Target']"
          :selected-keys="selectedColumns"
          :target-keys="targetColumns"
          :render="item => item.title"
          @change="handleChange"
          @selectChange="handleSelectChange"
        >
          <template
            slot="children"
            slot-scope="{ props: { direction, selectedKeys }, on: { itemSelect } }">
            <a-tree
              v-if="direction === 'right'"
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              :titles="[$t('resource.table.setting.source'), $t('resource.table.setting.target')]"
              :draggable="true"
              :checkedKeys="[...treeSelectColumn]"
              :treeData="treeSource"
              @dragenter="onDragEnter"
              @drop="onDrop"
              default-expand-all
              @check="(_, props) => { onChecked(_, props, [...treeSelectColumn], itemSelect); }"
              @select="(_, props) => { onChecked(_, props, [...treeSelectColumn], itemSelect);}"/>
          </template>
        </a-transfer>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>

import { Transfer, Tree } from 'ant-design-vue'
import { mapGetters } from 'vuex'
// import { get } from '../../api/service'

export default {
  name: 'SettingsTable',
  props: {
    alias: {
      type: String,
      default: () => ''
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'a-transfer': Transfer,
    'a-tree': Tree
  },
  computed: {
    ...mapGetters({
      visible: 'GET_SETTING_TABLE'
    })
  },
  data () {
    return {
      loading: true,
      storeColumns: [],
      treeSource: [],
      dataSource: [],
      targetColumns: [],
      selectedColumns: [],
      treeSelectColumn: [],
      toTree: false
    }
  },
  watch: {
    visible: function (v) {
      if (v) {
        this.loadFields()
      }
    }
  },
  mounted () {
    this.dataSource = this.columns.filter((item) => {
      return item.dataIndex !== 'id' && item.key !== 'action'
    }).map((column) => {
      // this.targetColumns.push(column.dataIndex)
      return {
        key: column.dataIndex,
        title: column.title
      }
    })
  },
  methods: {
    loadFields () {
      this.storeColumns = this.$store.getters['GET_COLUMNS_TABLE'](this.alias)
      if (this.storeColumns) {
        this.treeSource = this.storeColumns
        const keys = this.treeSource.map((column) => { return column.key })
        this.dataSource = this.dataSource.filter((item) => {
          return !keys.includes(item.key)
        })
      }
    },
    itemSelect (e, c) {
      // console.log(e, c)
    },
    handleChange (nextTargetKeys, direction, moveKeys) {
      this.targetColumns = nextTargetKeys

      this.treeSource = this.dataSource.filter((col) => {
        return nextTargetKeys.includes(col.key)
      })
      if (direction === 'right') {
        this.treeSelectColumn = []
      }
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.treeSelectColumn = [...sourceSelectedKeys, ...targetSelectedKeys]
      this.selectedColumns = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    onChange (targetKeys) {
      this.targetColumns = targetKeys
    },
    isChecked (selectedKeys, eventKey) {
      return selectedKeys.indexOf(eventKey) !== -1
    },
    onChecked (_, e, checkedKeys, itemSelect) {
      const { eventKey } = e.node
      this.toTree = true
      itemSelect(eventKey, !this.isChecked(checkedKeys, eventKey))
    },
    close () {
      this.$store.dispatch('ACTION_SET_CLOSE_SETTING_TABLE')
      this.clean()
    },
    save () {
      this.$store.dispatch('SET_COLUMNS_TABLE', {
        id: this.alias,
        columns: this.treeSource
      })
      this.close()
    },
    clean () {
      this.treeSelectColumn = []
      this.targetColumns = []
      this.selectedColumns = []
      this.treeSource = []
    },
    onDragEnter (info) {
    },
    onDrop (info) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.treeSource]

      // Find dragObject
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj)
        })
      } else {
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.treeSource = data
    }
  }
}
</script>

<style>
.table-setting .ant-transfer-list {
  width: 47%;
  flex: none;
}

.table-setting .ant-tree li span.ant-tree-switcher.ant-tree-switcher-noop {
  display: none;
}
</style>
