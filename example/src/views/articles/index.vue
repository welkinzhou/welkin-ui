<template>
  <div class="blog-wrapper">
    <div class="blog-left"></div>
    <div class="blog-article">
      <Article />
    </div>
    <div class="blog-right"></div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 文章页面
 * author welkin
 */
import Article from "./components/article.vue";
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
    background-color: #fff;
    padding: 40px;
  }
  .blog-right {
    flex-basis: 180px;
    flex-shrink: 0;
    flex-grow: 0;
  }
}
</style>
