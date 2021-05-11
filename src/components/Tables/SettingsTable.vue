<template>
  <a-modal
    :visible="visible"
    :title="$t('resource.table.setting')"
    centered
    @ok="close"
    @cancel="close"
    width="600px"
  >
    <a-spin :spinning="loading">
      <a-transfer
        class="tree-transfer"
        :data-source="dataSource"
        :target-keys="[]"
        :render="item => item.title"
        :show-select-all="false"
      >
        <template
          slot="children"
          slot-scope="{ props: { direction, selectedKeys }, on: { } }"
        >
          <a-tree
            v-if="direction === 'left'"
            blockNode
            checkable
            checkStrictly
            defaultExpandAll
            :checkedKeys="[...selectedKeys, ...targetColumns]"
            :treeData="treeData"
          />
        </template>
      </a-transfer>
    </a-spin>
  </a-modal>
</template>

<script>

import { Transfer, Tree } from 'ant-design-vue'
import { mapGetters } from 'vuex'

export default {
  name: 'SettingsTable',
  props: {
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
      dataSource: [],
      treeData: [],
      targetColumns: []
    }
  },
  methods: {
    itemSelect (e, c) {
      console.log(e, c)
    },
    isChecked (selectedKeys, eventKey) {
      return selectedKeys.indexOf(eventKey) !== -1
    },
    onChange (targetKeys) {
      console.log('Target Keys:', targetKeys)
      this.targetKeys = targetKeys
    },
    onChecked (_, e, checkedKeys, itemSelect) {
      const { eventKey } = e.node
      itemSelect(eventKey, !this.isChecked(checkedKeys, eventKey))
    },
    handleTreeData (data, targetKeys = []) {
      data.forEach(item => {
        item['disabled'] = targetKeys.includes(item.key)
        if (item.children) {
          this.handleTreeData(item.children, targetKeys)
        }
      })
      return data
    },
    close () {
      this.$store.dispatch('ACTION_SET_CLOSE_SETTING_TABLE')
    }
  }
}
</script>

<style scoped>

</style>
