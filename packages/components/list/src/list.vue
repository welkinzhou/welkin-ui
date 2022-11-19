<template>
  <div class="list-title">列表</div>
  <div>list state: {{ props.loading }}</div>

  <button @click="updateLoadingHandler">update</button>
</template>

<script lang="ts" setup>
import "../style/index.scss";
import { listProps, listEmits } from "./list";

const props = defineProps(listProps);

const emits = defineEmits(listEmits);

const updateLoadingHandler = () => {
  emits("update:loading", !props.loading);
  emits("change", !props.loading);
};
</script>
