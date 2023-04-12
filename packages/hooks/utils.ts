import { unref } from 'vue'
import { MaybeComputedRef } from '@welkin-ui/utils'
/**
 * Get the value of value/ref/getter.
 */
export function resolveUnref<T>(r: MaybeComputedRef<T>): T {
  return typeof r === 'function' ? (r as any)() : unref(r)
}

/**
 * Get the dom element of a ref of element or Vue component instance
 *
 * @param elRef
 */
export function unrefElement(elRef: any) {
  const plain = resolveUnref(elRef)
  return plain?.$el ?? plain
}
