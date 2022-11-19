<template>
  <li
    @click="triggerSelect"
    :class="[
      'link-item',
      { 'link-active': active },
      { 'nav-padding-right': !isLast },
      { 'nav-padding-left': !isFirst },
    ]"
  >
    <slot>{{ title }}</slot>
    <div v-if="!isLast" class="split-line"></div>
  </li>
</template>

<script lang="ts" setup>
import { NavRoot } from "./type";
import { ref, computed, inject, onMounted } from "vue";

const props = defineProps({
  path: { type: [String], required: true },
  title: { type: String },
});
// 获取导航容器
const root = inject("navRoot") as NavRoot;

const triggerSelect = () => {
  root.updateActive(props.path);
  root.handleSelect(props.path, props);
};

const ownIndex = ref(0);

const updateIndex = (index: number) => {
  ownIndex.value = index;
};

onMounted(() => {
  root.children.push({
    props,
    ownIndex,
    updateIndex,
  });
});
// 当前选中
const active = computed(() => props.path === root.activePath);
// 是否是第一个元素
const isFirst = computed(() => ownIndex.value === 0);
// 是否是最后一个元素
const isLast = computed(() => ownIndex.value === root.children.length - 1);
</script>
<style lang="scss" scoped>
@import "@/style/theme.scss";
.link-item {
  color: $secondary-color;
  position: relative;
  cursor: pointer;

  &.link-active {
    font-weight: 600;
    color: $title-color;
  }
  .split-line {
    position: absolute;
    width: 1px;
    top: 50%;
    right: 0;
    height: 60%;
    transform: translateY(-50%);
    background-color: #909399;
  }
}
.nav-padding-left {
  padding-left: 32px;
}
.nav-padding-right {
  padding-right: 32px;
}
</style>
