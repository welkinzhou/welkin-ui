<template>
  <div class="wel-container" ref="scrollRef">
    <Header>
      <WelNavLink :default-active="route.fullPath" @select="handleSelect">
        <WelNavItem v-for="item in navItems" :key="item.title" v-bind="item" />
      </WelNavLink>
    </Header>

    <div class="main">
      <!-- <RouterView /> -->
      <RouterView v-slot="{ Component, route }">
        <keep-alive v-if="route.meta.cache">
          <component :is="Component" :key="route.path" />
        </keep-alive>
        <component v-else :is="Component" :key="route.path" />
      </RouterView>
    </div>
    <div class="footer">
      <div class="footer-bg">
        <a target="_blank" href="https://beian.miit.gov.cn">粤ICP备2023059245号-1 |</a>

        <a
          target="_blank"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502010080"
          style="display: inline-block; text-decoration: none; height: 20px; line-height: 20px"
        >
          <img src="@/assets/备案图标.png" style="float: left" />
          <p style="float: left; height: 20px; line-height: 20px; margin: 0px 0px 0px 5px; color: #939393">
            粤公网安备 44030502010080号
          </p>
        </a>
      </div>
    </div>
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
    color: #999;
    &-bg {
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        color: #999;
      }
      a + a {
        margin-left: 6px;
      }
    }
  }
}
</style>
