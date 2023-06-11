<template>
  <div class="brief" @click="clickHandler">
    <!-- <div class="card-img">
      <img class="cover-img" :src="picture" alt="cover" />
    </div> -->
    <div class="card-content">
      <h4 class="title">{{ title }}</h4>
      <div class="main">
        <div class="summary">{{ summary }}</div>
      </div>
      <div class="date">{{ date }}</div>
      <div class="author" v-if="author">{{ author }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
interface Props {
  title?: string
  summary?: string
  date?: string
  author?: string
  path?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '夏天的太阳',
  summary: '你来人间一趟，你要看看太阳',
  date: '1985年1月',
  author: '查海生',
  path: '/article/sicp'
})
const router = useRouter()
const clickHandler = () => {
  router.push({
    path: props.path
  })
}
</script>
<style lang="scss" scoped>
.brief {
  box-shadow: 0 0 1px var(--primary-background) inset;
  background-color: var(--primary-background);
  border-radius: 8px;
  padding: 6px 12px;
  min-width: 800px;
  display: flex;
  .card-img {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
  .card-content {
    padding: 26px 24px;
    color: #8d9788;
    flex-grow: 1;
    flex-shrink: unset;
    .title {
      font-weight: var(--title-font-weight);
    }
    .main {
      margin: 12px 0;
    }
    .date {
      margin-top: 4px;
      font-size: 12px;
    }
  }
}
.cover-img {
  height: 270px;
  width: 360px;
  object-fit: contain;
}
</style>
