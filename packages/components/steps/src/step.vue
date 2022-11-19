<template>
  <div
    :class="[
      'wel-step',
      parent.props.horizontal ? 'is-vertical' : 'is-horizontal',
    ]"
  >
    <!-- icon 和 line -->
    <!-- 图标和线的 flex 方向与主体相反 -->
    <div
      :class="[
        'icon-line',
        isBem(props.status),
        parent.props.horizontal ? 'is-horizontal' : 'is-vertical',
        isBem('first', isFirst),
        isBem('last', isLast),
      ]"
    >
      <div :class="'icons-content'">
        <svg
          :class="[
            'icons',
            hasBem('before', !isFirst),
            hasBem('after', !isLast),
          ]"
        >
          <use xlink:href="#circle"></use>
        </svg>
      </div>
      <div class="line"></div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>

  <!-- SVG 圆环 icon -->
  <svg style="display: none">
    <symbol id="circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" stroke-width="10" />
    </symbol>
  </svg>
</template>

<script lang="ts" setup>
/**
 * 步骤条组件子级 item
 */
import { ref, reactive, computed, inject, onMounted } from "vue";
import { InjectSteps, stepProps } from "./step";

const props = defineProps(stepProps);
// 当前组件在 steps 中的 index
const index = ref(-1);
const setIndex = (i: number) => {
  index.value = i;
};

const parent = inject("WelSteps") as InjectSteps;
// 是否是第一个 step 组件
const isFirst = computed(() => index.value === 0);
// 是否是最后一个组件
const isLast = computed(() => {
  return index.value === parent.steps.value.length - 1;
});

const instance = reactive({
  setIndex,
});
// 将当前实例推进 parent 中
parent.steps.value = [...parent.steps.value, instance];

function isBem(status: string, hasStatus = true) {
  return hasStatus ? `is-${status}` : "";
}

function hasBem(status: string, hasStatus: boolean) {
  return hasStatus ? `has-${status}` : "";
}
</script>
<style lang="scss" scoped>
@import "@../../../../common-style/index.scss";
.wel-step {
  display: flex;
  overflow: hidden;
  .icon-line {
    display: inline-flex;
    position: relative;
    .icons-content {
      position: relative;
      z-index: 5;
      .icons {
        fill: #fff;
        width: 14px;
        height: 14px;
      }
    }
    &.is-vertical .line {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: #e4e7ed;
      z-index: 3;
    }
    &.is-vertical.is-first .line {
      top: 1em;
    }
    &.is-vertical.is-last .line {
      top: 0;
      bottom: calc(100% - 1em);
    }

    &.is-horizontal .line {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(0.5em + 1px);
      height: 2px;
      background-color: #e4e7ed;
      z-index: 3;
    }
    &.is-horizontal.is-first .line {
      left: 12px;
    }
    &.is-horizontal.is-last .line {
      left: 0;
      right: calc(100% - 12px);
    }
  }

  .content {
    flex-grow: 1;
  }
  &.is-horizontal .content {
    margin-left: 14px;
  }
  &.is-vertical .content {
    margin-right: 14px;
  }
}
.is-default {
  stroke: $primary;
}
.is-success {
  stroke: $success;
}
.is-warning {
  stroke: $warning;
}
.is-danger {
  stroke: $danger;
}

.is-horizontal {
  flex-flow: row;
}
.is-vertical {
  flex-flow: column;
}
</style>
