<template>
  <ul class="wel_nav-link">
    <slot />
  </ul>
</template>

<script lang="ts" setup>
import { NavRoot } from "./type";
import { onMounted, watch, reactive, ref, provide } from "vue";

const props = defineProps({
  defaultActive: {
    type: [String],
    default: "",
  },
});

const emits = defineEmits(["select"]);

const updateActive = (index: string) => {
  navRoot.activePath = index;
};

const handleSelect = (index: string, item: any) => {
  emits("select", index, item);
};

const navRoot = reactive<NavRoot>({
  activePath: "",
  updateActive,
  handleSelect,
  children: [],
});

onMounted(() => {
  navRoot.activePath = props.defaultActive;
});

// 导航的栏目更新后重新设置 index
watch(
  () => navRoot.children,
  () => {
    navRoot.children.forEach((item, index) => {
      item.updateIndex(index);
    });
  },
  { deep: true }
);

provide("navRoot", navRoot);
</script>
<style lang="scss" scoped>
.wel_nav-link {
  display: flex;
  align-items: center;
}
</style>
