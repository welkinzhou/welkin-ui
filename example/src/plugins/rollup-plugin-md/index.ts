import { createFilter } from '@rollup/pluginutils'
import { markdownToVue } from './convertor/index'

export default function mdPlugin(options: any = {}) {
  let config: any
  // 创建 filter，官方推荐，用来判断是否是需要转换的类型文件 https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter
  // 选择所有 .md 文件
  const filter = createFilter(options.include || /\.md$/, options.exclude || null)
  return {
    // this name will show up in warnings and errors rollup 配置项
    name: 'rollup-plugin-md',
    // 指定插件加载顺序  https://cn.vitejs.dev/guide/api-plugin.html #插件顺序
    // vite 官方配置 pre 会在 alias 解析后，官方核心插件加载前调用
    enforce: 'pre' as 'pre' | 'post',
    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig
      // console.log('vite config ------', config)
    },

    // 在其他钩子中使用存储的配置
    // https://rollupjs.org/plugin-development/#transform
    // code 是读取的文件内容
    // id 是文件的绝对路径
    async transform(code, id) {
      if (!filter(id)) return

      try {
        // 转换文件到
        return await markdownToVue(config)(id, code)
      } catch (e: any) {
        this.error(e)
      }
    },
    // 热刷新重新渲染
    async handleHotUpdate(ctx) {
      if (!filter(ctx.file)) return

      const defaultRead = ctx.read
      ctx.read = async function () {
        return await markdownToVue(config)(ctx.file, await defaultRead())
      }
    }
  }
}
