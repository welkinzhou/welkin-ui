<template>
  <div class="header-wrapper">
    <div class="container">
      <div class="logo">
        <slot name="logo"> 江枫余火 </slot>
      </div>
      <div class="content">
        <slot name="default"> </slot>
      </div>
      <div class="avatar">
        <slot name="avatar">欢迎</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
<style lang="scss" scoped>
.header-wrapper {
  min-height: 80px;
  box-sizing: border-box;
  padding: 10px 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  width: 100%;
  &.is-fix {
    box-shadow: 0 1px 2px rgba(84, 84, 102, 20%);
  }

  .container {
    width: 100%;
    display: flex;
    .logo {
      width: 120px;
    }
    .content {
      flex-grow: 1;
    }
    .avatar {
      width: 180px;
    }
  }
}
</style>
