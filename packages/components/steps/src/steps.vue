<template>
  <div
    :class="['wel-steps', props.horizontal ? 'is-horizontal' : 'is-vertical']"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, watch, withDefaults } from "vue";
import { stepsProps } from "./steps";
/**
 * 步骤条组件
 */

const props = defineProps(stepsProps);

// 保存所有的子组件信息
const steps = ref([]);

provide("WelSteps", { steps, props });
// 子组件实例化时候，需要写入 index
watch(steps, () => {
  steps.value.forEach((instance: any, index: number) => {
    instance.setIndex(index);
  });
});
</script>
<style lang="scss" scoped>
.wel-steps {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.is-horizontal {
  flex-flow: row;
}
.is-vertical {
  flex-flow: column;
}
</style>
