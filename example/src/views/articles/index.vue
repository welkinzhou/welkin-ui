<template>
  <div class="blog-wrapper">
    <div class="blog-left"></div>
    <div class="blog-article">
      <RouterView />
    </div>
    <div class="blog-right"></div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 文章页面
 * author welkin
 */
</script>
<style lang="scss" scoped>
.blog-wrapper {
  margin: 80px 0;
  min-height: 100%;
  display: flex;

  .blog-left {
    flex-basis: 180px;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .blog-article {
    flex-grow: 1;
    padding: 40px;
    background-color: #f3f3f3;
    box-shadow: 0 0 2px #f1f1f1;
    border-radius: 8px;
  }
  .blog-right {
    flex-basis: 180px;
    flex-shrink: 0;
    flex-grow: 0;
  }
}
</style>
