<template>
  <div class="home primary-shadow">
    <div>首页</div>
    <div class="list-wrapper">
      <WelList v-model:loading="isLoading" :data="data">
        <template #default="{ data }">
          <brief-card v-bind="data" />
        </template>
      </WelList>
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

    <brief-card />
    <div style="margin-top: 8px">
      <WelSelect v-model="selectValue">
        <WelOption :value="1" label="测试" />
      </WelSelect>
    </div>

    <div class="row">
      <div class="col-3">
        <h3>Draggable 1</h3>
        <draggable class="list-group" :list="list1" group="people" @change="log" itemKey="id">
          <template #item="{ element, index }">
            <div class="list-group-item">{{ element.name }} {{ index }}</div>
          </template>
        </draggable>
      </div>

      <div class="col-3">
        <h3>Draggable 2</h3>
        <draggable class="list-group" :list="list2" group="people" @change="log" itemKey="id">
          <template #item="{ element, index }">
            <div class="list-group-item">{{ element.name }} {{ index }}</div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable'

import { ref } from 'vue'
import { WelList, WelSteps, WelStep, WelSelect, WelOption } from '@welkin-ui/components'
import briefCard from './components/brief-card.vue'

const isLoading = ref(false)
const data = [
  {
    title: '扬州慢',
    summary:
      '淳熙丙辛日，予过维扬。夜雪初霁，荠麦弥望。入其城，则四顾萧条，寒水自碧，暮色渐起，戍角悲吟。予怀怆然，感慨今昔，因自度此曲，千岩老人以为有《黍离》之悲也。',
    date: '1176年冬至',
    author: '姜夔'
  }
]

const selectValue = ref('')

const drag = ref(false)

const list1 = ref([
  { name: 'John', id: 1 },
  { name: 'Joao', id: 2 },
  { name: 'Jean', id: 3 },
  { name: 'Gerard', id: 4 }
])
const list2 = ref([
  { name: 'Juan', id: 5 },
  { name: 'Edgard', id: 6 },
  { name: 'Johnson', id: 7 }
])

const log = (evt: any) => {
  console.log(evt)
}
</script>
<style lang="scss" scoped>
.home {
  margin: 80px 0;
  background-color: #fff;
  padding: 40px;
  .list-wrapper {
    margin-top: 16px;
    margin-bottom: 32px;
  }
  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
    border-radius: 0.25rem;
    min-height: 20px;
  }

  .list-group-item {
    position: relative;
    display: block;
    padding: 0.75rem 1.25rem;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.125);
    cursor: move;
  }

  .list-group-item + .list-group-item {
    border-top-width: 0;
  }

  .list-group-item:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  .list-group-item:last-child {
    border-bottom-right-radius: inherit;
    border-bottom-left-radius: inherit;
  }
}
</style>
<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
