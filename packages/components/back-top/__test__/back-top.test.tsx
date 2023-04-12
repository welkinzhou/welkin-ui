import { mount } from '@vue/test-utils'
import { expect, describe, test } from 'vitest'
import BackTop from '../src/back-top.vue'

/**
 * 功能描述
 * 滚动后展示
 * 点击后滚动到顶部
 */

describe('back top', () => {
  test('scroll visible', () => {
    const wrapper = mount(() => (
      <div id="container" style="height:100px;width:100%;over-flow:auto;">
        <div style="height:1000px;width:100%;"></div>
        <BackTop target="#container" />
      </div>
    ))
    // 没有滚动不渲染
    expect(wrapper.find('.wel_back-top').exists()).toBe(false)
    const target = document.querySelector('#container')
    target.scrollTop = 300
    expect(wrapper.find('.wel_back-top').exists()).toBe(true)
  })

  test('click handle', async () => {
    const wrapper = mount(() => (
      <div id="container" style="height:100px;width:100%;over-flow:auto;">
        <div style="height:1000px;width:100%;"></div>
        <BackTop target="#container" />
      </div>
    ))
    const target = document.querySelector('#container')
    target.scrollTop = 300
    // 点击返回顶部，组件隐藏
    await wrapper.find('.wel_back-top').trigger('click')
    expect(target.scrollTop).toBe(0)
    expect(wrapper.find('.wel_back-top').exists()).toBe(false)
  })
})
