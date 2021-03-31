<template>
  <div>
    <template v-if="element.badge && (element.badge.badge === 'default')">
      {{ element.badge.description }}
      <span
        v-html="element.badge.text"
        :class="element.badge.type"/>
    </template>
    <template v-if="element.badge && element.badge.badge === 'antd-count'">
      <a-badge :count="element.badge.text">
        {{ element.badge.description }}
      </a-badge>
    </template>
    <template v-if="Array.isArray(element.badges)">
      <template v-for="(badge, idx) in element.badges">
        <template v-if="badge.badge === 'default'">
          {{ badge.description }}
          <span
            v-html="badge.text"
            :key="idx"
            :class="badge.type"/>
        </template>
        <template v-if="badge.badge === 'antd-count'">
          <a-badge :count="badge.text" :key="idx">
            {{ badge.description }}
          </a-badge>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Badge',
  props: [ 'element' ]
}
</script>
