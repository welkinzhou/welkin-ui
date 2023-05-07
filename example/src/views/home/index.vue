<template>
  <div class="home primary-shadow">
    <h1>文章列表</h1>
    <div class="list-wrapper">
      <WelList v-model:loading="isLoading" :data="data">
        <template #default="{ data }">
          <brief-card v-bind="data" />
        </template>
      </WelList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { WelList } from '@welkin-ui/components'
import briefCard from './components/brief-card.vue'
import SicpPic from '@/assets/image/sicp/sicp.jpg'

const isLoading = ref(false)
const data = [
  {
    title: 'SICP',
    summary:
      '一直有听说 SICP 的大名，闲来无事时，也买了一本看看，可惜并没有看完。在这个过程中也产生了一些思考，简单记录下，也期待我把这个笔记补完的一天。',
    date: '2023-05-07',
    picture: SicpPic,
    author: 'welkin'
  }
]
</script>
<style lang="scss" scoped>
.home {
  margin: 80px 0;
  background-color: #fff;
  padding: 40px;
  .list-wrapper {
    margin-top: 18px;
  }
}
</style>
