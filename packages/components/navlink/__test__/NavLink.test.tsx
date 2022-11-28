import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, expect, test } from 'vitest'
import NavLink from '../src/nav-link.vue'
import Item from '../src/link-item.vue'

describe('Nav link test', () => {
  test('render', () => {
    const wrapper = mount(() => (
      <NavLink>
        <Item path="first" />
      </NavLink>
    ))
    expect(wrapper.findAll('.link-item')).toHaveLength(1)
    expect(wrapper.find('.link-active').exists()).toBe(false)
  })

  test('slot', () => {
    const slotContentFather = 'Nav link slot'
    const slotContentChild = 'Nav item slot'
    const wrapper = mount(() => (
      <NavLink>
        <span id="nav-slot">{slotContentFather}</span>
        <Item path="first">{{ default: () => <span id="item-slot">{slotContentChild}</span> }}</Item>
      </NavLink>
    ))

    expect(wrapper.find('#nav-slot').exists()).toBe(true)
    expect(wrapper.find('#nav-slot').text()).toEqual(slotContentFather)
    const item = wrapper.findComponent(Item)
    expect(item.exists()).toBe(true)
    expect(item.find('#item-slot').text()).toEqual(slotContentChild)
  })

  test('default active', async () => {
    const wrapper = mount(() => {
      const activePath = ref('first')

      return (
        <NavLink defaultActive={activePath}>
          <Item path="first" />
          <Item path="second" />
        </NavLink>
      )
    })
    // TODO to make default active work, mount had to set activePath, and used setProps, why? Could be something wrong with using tsx.
    await wrapper.setProps({ defaultActive: 'first' })
    expect(wrapper.findAll('.link-item')[0].classes()).toContain('link-active')
  })

  test('click handle', async () => {
    const wrapper = mount(() => {
      const activePath = ref('first')

      return (
        <NavLink defaultActive={activePath}>
          <Item path="first" />
          <Item path="second" />
        </NavLink>
      )
    })
    await wrapper.setProps({ defaultActive: 'first' })
    expect(wrapper.findAll('.link-item')[0].classes()).toContain('link-active')
    await wrapper.findAll('.link-item')[1].trigger('click')
    expect(wrapper.findAll('.link-item')[1].classes()).toContain('link-active')
  })
})
