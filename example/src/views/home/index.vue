<template>
  <div class="home primary-shadow">
    <div>首页</div>
    <div class="list-wrapper">
      <WelList v-model:loading="isLoading" :data="data">
        <template #default="{ data }">
          <brief-card v-bind="data" />
        </template>
      </WelList>
    </div>

    <brief-card />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { WelList } from '@welkin-ui/components'
import briefCard from './components/brief-card.vue'

const isLoading = ref(false)
const data = [
  {
    title: '扬州慢',
    summary:
      '淳熙丙辛日，予过维扬。夜雪初霁，荠麦弥望。入其城，则四顾萧条，寒水自碧，暮色渐起，戍角悲吟。予怀怆然，感慨今昔，因自度此曲，千岩老人以为有《黍离》之悲也。',
    date: '1176年冬至',
    author: '姜夔'
  }
]
</script>
<style lang="scss" scoped>
.home {
  margin: 80px 0;
  background-color: #fff;
  padding: 40px;
}
</style>
