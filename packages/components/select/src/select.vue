<template>
  <div class="wel_select-wrapper">
    <div class="reference" ref="reference" aria-describedby="tooltip">
      <input v-model="inputContentText" type="text" @focus="show" />
    </div>
    <div class="dropdown" v-show="dropdownVisible" ref="dropdown" id="tooltip" role="tooltip">
      下拉
      <slot />
      <div id="arrow" data-popper-arrow></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 下拉选择框
 * author welkin
 */
import { provide, ref, unref, watch } from 'vue'
import { createPopper } from '@popperjs/core'
import { SelectInjectKey } from './constants'

const props = defineProps({
  modelValue: {
    required: true
  },
  multi: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:modelValue'])

// 输入框中内容
const inputContentText = ref('')

const popperInstance = ref()

const reference = ref()
const dropdown = ref()

// 更新绑定 dom 后使用 popperJS
watch(
  () => [unref(reference), unref(dropdown)],
  ([referenceEl, dropdownEl]) => {
    // 绑定时 ref 还没有保存当前 dom，需要等待绑定后创建 popper
    if (referenceEl && dropdownEl) {
      popperInstance.value = createPopper(referenceEl, dropdownEl, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          }
        ]
      })
    }
  },
  // 需要获取 DOM 对象，所以在更新后触发
  { flush: 'post' }
)
// 提供一个修改选定值的方法
const updateSelect = (data: any) => {
  if (data.value === props.modelValue) return
  inputContentText.value = data.label
  emits('update:modelValue', data.value, data)
}
// 向下提供一个 Fake Instance，提供选中值，更新选中等
provide(SelectInjectKey, {
  props,
  DropdownHide: hide,
  updateSelect
})
// 是否展示下拉弹框
const dropdownVisible = ref(false)

function show() {
  // Make the tooltip visible
  dropdownVisible.value = true

  // Enable the event listeners
  popperInstance.value.setOptions(options => ({
    ...options,
    modifiers: [...options.modifiers, { name: 'eventListeners', enabled: true }]
  }))

  // Update its position
  popperInstance.value.update()
}

function hide() {
  // Hide the tooltip
  dropdownVisible.value = false

  // Disable the event listeners
  popperInstance.value.setOptions(options => ({
    ...options,
    modifiers: [...options.modifiers, { name: 'eventListeners', enabled: false }]
  }))
}
</script>
<style lang="scss" scoped>
.wel_select-wrapper {
  background-color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: inset 0 0 1px #484848;
  display: inline-flex;
  align-items: center;
  height: 32px;
  .reference {
    padding: 0 8px;
  }
  input {
    border: none;
    outline: none;
    height: 100%;
    font-size: 16px;
    line-height: 1;
  }
}
#tooltip {
  background: #333;
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  font-size: 13px;
  border-radius: 4px;
}

#arrow,
#arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
}

#arrow {
  visibility: hidden;
}

#arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg);
}

#tooltip[data-popper-placement^='top'] > #arrow {
  bottom: -4px;
}

#tooltip[data-popper-placement^='bottom'] > #arrow {
  top: -4px;
}

#tooltip[data-popper-placement^='left'] > #arrow {
  right: -4px;
}

#tooltip[data-popper-placement^='right'] > #arrow {
  left: -4px;
}
</style>
