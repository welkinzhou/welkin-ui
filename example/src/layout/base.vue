<template>
  <div class="wel-container" ref="scrollRef">
    <Header>
      <WelNavLink :default-active="route.fullPath" @select="handleSelect">
        <WelNavItem v-for="item in navItems" :key="item.title" v-bind="item" />
      </WelNavLink>
    </Header>

    <div class="main">
      <RouterView />
    </div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 基础布局（header, content)
 * author welkin
 */
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { WelNavLink, WelNavItem } from '@welkin-ui/components'
import Header from './header.vue'

const navItems = [
  { title: '总览', path: '/home' }
  // { title: '文章', path: '/article' }
]

const router = useRouter()
const route = useRoute()

const scrollRef = ref()

watch(
  () => route.fullPath,
  val => {
    scrollRef.value.scrollTop = 0
  }
)

const handleSelect = (path: string) => {
  router.push({
    path
  })
}
</script>
<style lang="scss" scoped>
.wel-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  overflow-y: scroll;

  .main {
    box-sizing: border-box;
    flex-grow: 1;
  }
  .footer {
    height: 40px;
  }
}
</style>
