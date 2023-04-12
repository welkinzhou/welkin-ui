<template>
  <Transition name="fade">
    <div v-if="visible" :style="backTopStyle" class="wel_back-top"></div>
  </Transition>
</template>

<script lang="ts" setup>
/**
 * 回到顶部
 * author welkin
 */
import { onMounted, computed, ref, shallowRef } from 'vue'
const props = defineProps({
  target: {
    type: String // 滚动元素的 css selector
  },
  offset: {
    type: Number,
    default: 200
  },
  right: {
    type: Number,
    default: 40
  },
  bottom: {
    type: Number,
    default: 40
  }
})

const backTopStyle = computed(() => ({
  right: `${props.right}px`,
  bottom: `${props.bottom}px`
}))

// 滚动的元素，默认是 document
const targetEl = shallowRef<HTMLElement>(document.documentElement)

onMounted(() => {
  if (props.target) {
    const el = document.querySelector(props.target) as HTMLElement
    el && (targetEl.value = el)
  }
})

const visible = ref(false)
</script>
<style lang="scss" scoped>
.wel_back-top {
  position: fixed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
