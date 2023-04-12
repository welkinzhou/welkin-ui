<template>
  <div class="list-wrapper">
    <template v-for="item in props.data">
      <div :style="itemStyle">
        <slot :data="item" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import '../style/index.scss'
import { listProps, listEmits } from './list'

const props = defineProps(listProps)

const emits = defineEmits(listEmits)

const itemStyle = computed(() => {
  const styleStr = `margin-bottom: ${props.gutter}px`
  return styleStr
})
</script>
