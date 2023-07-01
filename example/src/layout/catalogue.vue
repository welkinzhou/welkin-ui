<template>
  <div class="catalogue">
    <div ref="imgRef" class="first-page">
      <img class="bg-img" src="@/assets/image/home/background.jpg" alt="夏天的云" />
      <div class="catalogue-slogan">
        <div class="catalogue-options primary-shadow">
          <div ref="scroller" class="greeting"></div>
          <div class="options">牢骚太盛防肠断，风物长宜放眼量。</div>
          <div class="options">莫道昆明池水浅，观鱼胜过富春江。</div>
        </div>
      </div>
    </div>
    <div class="catalogue-wrapper">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 目录 layout
 * author welkin
 */
import { shallowRef, watch } from 'vue'
const windowHeight = window.innerHeight

const imgRef = shallowRef()
watch(imgRef, val => {
  if (val) {
    val.style.height = windowHeight - 80 + 'px'
  }
})

const scroller = shallowRef()

const slogan = '欢迎来到 welkin 的互联网小窝，一些杂感与学习感悟，很开心与你分享。'
let timer,
  count = 1

watch(scroller, el => {
  const done = sessionStorage.getItem('title-loaded')

  if (el && !done) {
    timer = setInterval(() => {
      if (count === slogan.length) {
        clearInterval(timer)
        sessionStorage.setItem('title-loaded', 'done')
      }
      const str = slogan.slice(0, count)
      el.innerText = str
      count++
    }, 200)
  } else {
    el.innerText = slogan
  }
})
</script>
<style lang="scss" scoped>
@import '@/style/theme.scss';
.catalogue {
  .first-page {
    position: relative;
    width: 100%;
    .bg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .catalogue-slogan {
      position: absolute;
      max-width: 950px;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      .greeting {
        margin-bottom: 8px;
        font-size: 28px;
        color: #d9894e;
      }
      .catalogue-options {
        padding: 40px 20px;
        min-width: 270px;
        .options {
          text-align: right;
          font-size: 14px;
          color: $secondary-color;
        }
      }
    }
  }

  .catalogue-wrapper {
    box-sizing: border-box;
    padding: 0 40px;
  }
}
</style>
