<template>
  <div class="catalogue">
    <div class="catalogue-options primary-shadow">
      <div class="options">栀子</div>
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
.catalogue {
  height: 100%;
  display: flex;
  padding: 0 12px;
  .catalogue-options {
    flex: 0 0 180px;
    margin-top: 80px;
    .options {
      min-height: 120px;
      background-color: #fff;
      padding: 40px 20px;
    }
  }
  .catalogue-wrapper {
    flex: 1;
    box-sizing: border-box;
    padding: 0 40px;
  }
}
</style>
