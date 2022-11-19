import type { App, Directive } from "vue";
import type { SFCInstallWithContext, SFCWithInstall } from "./typescript";

/**
 * 给组件增加 install 方法，可以使用 plugin 方法全局注册组件
 * @param main 需要注册的组件
 * @param extra 需要在组件上额外添加的属性，这部分直接挂载不注册
 * @returns
 */
export const withInstall = <T, E extends Record<string, any>>(
  main: T,
  extra?: E
) => {
  // plugin 注册需要暴露一个 install 方法，给 vue 实例调用
  (main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp);
    }
  };

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp;
    }
  }
  return main as SFCWithInstall<T> & E;
};
