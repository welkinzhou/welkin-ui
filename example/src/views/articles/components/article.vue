<template>
  <div>
    <div class="artTitle">如何提升设计价值-方法篇</div>
    <div class="artSubTitle">
      <div class="artSubTitle_date">
        上传日期：<span class="artSubTitle_date_num">2022.10.27</span>
      </div>
      <div class="artSubTitle_focus">
        <i class="artSubTitle_focus_icon"></i>1072
      </div>
    </div>

    <div><Article /></div>
  </div>
</template>

<script lang="ts" setup>
import Article from "@/markdown/SICP/SICP笔记.md";
</script>
<style lang="scss" scoped>
.artTitle {
  font-size: 24px;
  margin-bottom: 26px;
}
.artSubTitle {
  margin-bottom: 40px;

  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 20px;
  font-size: 14px;
  font-weight: 300;
  line-height: 0.104rem;
  color: #9e9ea7;
  margin-bottom: 0.312rem;
}
</style>
