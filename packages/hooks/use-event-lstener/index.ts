import { onBeforeMount, Ref, watch } from 'vue'
import { Fn, ArrayAble, isArray, noop } from '@welkin-ui/utils'
import { unrefElement } from '../utils'

type EventTarget = string | Element | Ref<null | Element>

/**
 * 绑定事件的 hook，默认 onBeforeMount 自动 remove
 * @param target 需要绑定事件的元素, 可以是 css selector，Element 或者 一个 Ref 元素
 * @param event 绑定的时间类型
 * @param handler 事件触发的回调
 * @param options 原生中绑定事件的额外参数
 * @return 返回一个方法，可以手动接触绑定
 */
export function useEventListener(target: EventTarget, events: any, handlers: ArrayAble<Fn>, options: any): Fn

export function useEventListener(target, events, handlers, options) {
  if (!target) return noop

  events = !isArray(events) && [].push(events)
  handlers = !isArray(handlers) && [].push(handlers)
  // 注册事件后会返回一个移除回调的方法
  const removers = []
  const cleanup = () => {
    removers.forEach(fn => fn())
    removers.length = 0
  }

  const register = (event: string, handler: any) => {
    target.addEventListener(event, handler, options)
    return target.removeEventListener(event, handler, options)
  }

  // 如果是一个 ref，可能使用 hook 时，Element 没有挂载，需要等待挂载后进行挂载
  // 使用 watch 不需要关心 hook 调用时机
  const stopWatch = watch(
    () => unrefElement(target),
    el => {
      cleanup()
      if (!el) return

      removers.push(
        ...(events as string[]).flatMap(event => {
          return (handlers as Function[]).map(handler => register(event, handler))
        })
      )
    },
    // 默认 watcher 不会在一创建就执行，如果是传入的 Element 就会有问题
    // 需要将 immediate 设置为 true
    // 默认用户创建的 watcher 触发会早于 vue 刷新 DOM 的 watcher
    // 如果需要获取 DOM 元素，需要将 flush 设置为 post
    { immediate: true, flush: 'post' }
  )
  // 返回一个手动解除绑定的方法
  const stop = () => {
    stopWatch()
    cleanup()
  }

  // 默认在 onBeforeMount 中移除事件
  onBeforeMount(() => {
    stop()
  })

  return stop
}
