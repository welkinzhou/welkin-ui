<template>
  <div class="home primary-shadow">
    <h1>文章列表</h1>
    <div class="list-wrapper">
      <brief-card v-for="data in list" v-bind="data" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import briefCard from './components/brief-card.vue'

const list = [
  {
    title: '算法学习',
    summary:
      '很多时候，不知道怎么优化代码。如今想来，只是能力未到。就和那个老生常谈的问题一样，学微积分，学物理有什么用。你要先学会才知道有什么用，学会了就是广阔天地，大有作为。没有学过，整日柴米油盐，当然也就没有，杀鸡焉用牛刀。算法的学习，亦是如此。',
    date: '2023-06-12',
    author: 'welkin',
    path: '/article/algorithm'
  },
  {
    title: 'ThreeJS 学习',
    summary:
      '人生中总会有几个节点，突然间大梦初醒。做了前端也有段时间了，整日埋首那些简单的后台系统之间，竟也有些忘了自己为何做前端。至今记得当时决意做前端，使看了 Apple 的 AirPods Pro 产品页，这也太 cool 了。如今看到 ThreeJS 一样的触动，希望能走的更远。',
    date: '2023-06-10',
    author: 'welkin',
    path: '/article/three'
  },
  {
    title: 'SICP',
    summary:
      '一直有听说 SICP 的大名，闲来无事时，也买了一本看看，可惜并没有看完。在这个过程中也产生了一些思考，简单记录下，也期待我把这个笔记补完的一天。',
    date: '2023-05-07',
    author: 'welkin',
    path: '/article/sicp'
  },
  {
    title: 'CSS 持续学习笔记',
    summary:
      'CSS 是一门需要用心研究的语言。真的需要用心，除此之外强大的记忆力也是不可或缺。我对 CSS 的认识就是，存在太多 exceptions 的一门语言。我是真的很佩服那些把 CSS 玩出花的人，这是一篇踩坑笔记，也是一个备忘录。',
    date: '2023-05-11',
    author: 'welkin',
    path: '/article/css'
  },
  {
    title: '项目搭建思路',
    summary:
      '一直在用已经搭建好的项目进行开发，虽然什么都懂一点，却从未实践过。果然纸上得来终觉浅，通过一步步配置项目，不仅把之前没记住的知识巩固了，还学到了很多新东西。记录一下，后续如果有新的体会，也会更新过来。',
    date: '2023-02-07',
    author: 'welkin',
    path: '/article/project'
  },
  {
    title: 'Vite 插件笔记',
    summary:
      '使用了很久的 Vue 3，从最开始的 Vue-cli 加 setup 函数的写法。转到使用 Vite 加 setup 语法糖，体验是大幅提升了。不得不说 Vite 太好用了，尤其是本地开发的丝滑感受。遗憾的是，在公司开发的项目中，并没有开发 Vite 插件的经验。刚好在自己写这个博客的过程中，体验一下。',
    date: '2023-02-07',
    author: 'welkin',
    path: '/article/vite'
  },
  {
    title: 'Haskell',
    summary:
      "Haskell 是一门有趣的语言，尽管没那么实用，但是确实给了我很多启发。跟着《Haskell 趣学指南》，学习了一遍。给我一种感觉，我变强了，但是不知道强在哪里。很神奇的一种体验，很多时候这种思路上的转变，都是描述的。就像 Sandel 在 Justice: What's the Right Thing to Do? 中说的一样，有些东西学了，不能告诉你是好是坏，但是你一定回不去了。政治哲学如是，函数式编程亦如是。",
    date: '2022-11-10',
    author: 'welkin',
    path: '/article/haskell'
  }
]
</script>
<style lang="scss" scoped>
.home {
  margin: 80px 0;
  background-color: #fff;
  padding: 40px;
  .list-wrapper {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 12px;
  }
}
</style>
