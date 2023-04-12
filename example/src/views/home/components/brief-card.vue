<template>
  <div class="brief">
    <div class="card-img">
      <img class="cover-img" :src="props.picture" alt="cover" />
    </div>
    <div class="card-content">
      <div class="title">{{ props.title }}</div>
      <div class="main">
        <div class="summary">{{ props.summary }}</div>
        <div class="date">{{ props.date }}</div>
      </div>
      <div class="author">{{ props.author }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import defaultImgSrc from '@/assets/image/bamboo.jpg'
interface Props {
  title?: string
  summary?: string
  date?: string
  author?: string
  picture?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '夏天的太阳',
  summary: '你来人间一趟，你要看看太阳',
  date: '1985年1月',
  author: '查海生',
  picture: defaultImgSrc
})
</script>
<style lang="scss" scoped>
.brief {
  box-shadow: 0 0 1px var(--primary-background) inset;
  background-color: var(--primary-background);
  border-radius: 8px;
  padding: 6px 12px;
  min-width: 800px;
  display: flex;
  .card-content {
    margin-left: 24px;
    padding: 26px 0;
    color: #8d9788;
    flex-grow: 1;
    flex-shrink: unset;
    .title {
      font-weight: var(--title-font-weight);
    }
    .main {
      margin: 12px 0;
      height: 150px;
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
