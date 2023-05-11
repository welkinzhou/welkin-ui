<template>
  <div class="catalogue">
    <div class="catalogue-left">
      <div class="catalogue-options primary-shadow">
        <div class="greeting">欢迎来到 welkin 的互联网小窝，一些杂感与学习感悟，很开心与你分享。</div>
        <div class="options">牢骚太盛防肠断，风物长宜放眼量。</div>
        <div class="options">莫道昆明池水浅，观鱼胜过富春江。</div>
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
</script>
<style lang="scss" scoped>
@import '@/style/theme.scss';
.catalogue {
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 0 12px;
  .catalogue-left {
    width: 400px;
    margin-top: 80px;
    .greeting {
      margin-bottom: 8px;
    }
    .catalogue-options {
      padding: 40px 20px;
      min-width: 270px;
      .options {
        background-color: #fff;
        text-align: right;
        font-size: 14px;
        color: $secondary-color;
      }
    }
  }

  .catalogue-wrapper {
    flex: 1;
    box-sizing: border-box;
    padding: 0 40px;
  }
}
</style>
