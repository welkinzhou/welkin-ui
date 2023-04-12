<template>
  <div class="wel_option" @click="selectHandler">
    <div>{{ label }}</div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { SelectInjectKey } from './constants'
import { SelectInstance } from './types'

/**
 * 下拉框选项
 * author welkin
 */
const props = defineProps({
  value: {
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const selectWrapperInstance = inject(SelectInjectKey) as SelectInstance

const selectHandler = () => {
  selectWrapperInstance.updateSelect(props)
}
</script>
<style lang="scss" scoped></style>
