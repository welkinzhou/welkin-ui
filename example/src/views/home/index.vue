<template>
  <div class="home primary-shadow">
    <div>首页</div>
    <div class="list-wrapper">
      <WelList v-model:loading="isLoading" @change="loadChange" />
    </div>

    <WelSteps>
      <WelStep>
        <div>清平乐</div>
        <div>李白</div>
        <div>🍬</div>
      </WelStep>
      <WelStep>云想衣裳花想容</WelStep>
      <WelStep>春风拂槛露华浓</WelStep>
    </WelSteps>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { WelList, WelSteps, WelStep } from "@welkin-ui/components";

const isLoading = ref(false);

const loadChange = (val: boolean) => {
  console.log("change", val);
};
</script>
<style lang="scss" scoped>
.home {
  margin: 80px 0;
  background-color: #fff;
  height: 100%;
  padding: 40px;
  .list-wrapper {
    margin-top: 16px;
    margin-bottom: 32px;
  }
}
</style>
