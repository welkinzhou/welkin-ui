现在大家写博客，都习惯了写 Markdown 文件。一个将 md 文件转换成 html，或者 vue 组件的插件就必不可少。

本来我是使用 [vite-plugin-md](https://github.com/antfu/vite-plugin-md) 这个官方插件，引入后也成功将 md 转化成了 vue 组件
。随后，想添加一个常见的功能，高亮代码。参考 github 上的 README.md，首先尝试了添加 markdown-it 插件（ vite-plugin-md 使
用的也是 markdown-it，也允许添加 markdown-it 插件），如下：

```js
// vite.config.js
import Markdown from 'vite-plugin-md'

export default {
  plugins: [
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true
      },
      markdownItSetup(md) {
        // add anchor links to your H[x] tags
        md.use(require('markdown-it-anchor'))
        // add code syntax highlighting with Prism
        md.use(require('markdown-it-prism'))
      }
    })
  ]
}
```

并没有生效，接下来我又看到插件有提供几个 builder，其中 [Code Builder](https://github.com/yankeeinlondon/code-builder) 可
以提供代码高亮，还有快捷复制的功能。引入 builder 后，确实实现了代码高亮，但是粘贴代码功能会报错。

```js
import Markdown from 'vite-plugin-md'
import code from '@yankeeinlondon/code-builder'

export default {
  plugins: [
    Markdown({
      builders: [code()]
    })
  ]
}
```

我很好奇为什么，是不是使用方式有问题。

就把 `vite-plugin-md` 和 `@yankeeinlondon/code-builder` 的源码拉下来，简单看了一下。在这个过程中，突然冒出一个念头，我还
没写过 vite 的插件呢！！！不如趁此机会，自己写一个练习一下。也是因为这个原因，我对官方插件中的问题，不求甚解，下述的定位
过程，很多都是我的猜测，没有认真测。如果大家有遇到类似问题，可以参考一下。

#### vite 插件基础

[vite 插件](https://cn.vitejs.dev/guide/api-plugin.html)是在 rollup 插件基础上进行的拓展，rollup 插件中的 hooks 也都是支
持的。

插件返回一个对象，基本属性有 `name`，name 会在插件报错时，随错误信息一起给出。

还有一个很重要的属性，`enforce`。指定插件的加载顺序：

- Alias
- 带有 `enforce: 'pre'` 的用户插件
- Vite 核心插件
- 没有 enforce 值的用户插件
- Vite 构建用的插件
- 带有 `enforce: 'post'` 的用户插件
- Vite 后置构建插件（最小化，manifest，报告）

接下来就是一些有用的 hooks，具体的还是要看官方文档。下面我只会写遇到过的，别的我也不熟悉，就不班门弄斧了。

#### vite-plugin-md

在看 `vite-plugin-md` 的实现之前，有几个问题需要思考

1. 怎么识别 md 文件。
2. 怎么 md 文件变成 vue 组件，这里实际上有两步，首先要将 md 转为 html（markdown-it），再把得到的 html 变成 vue 组件。

尤其是第二点，当时让我迷惑了很久。工程化一般使用的是 SFC，很多时候都忘了，实际上组件的使用需要注册，才能使用。包括引入的
组件，很多时候也是使用插件的形式，暴露一个 install，通过 `app.component` 的方式全局注册组件使用。但是 `Vite` 是一个打包
工具，和 vue 本身并没有任何关系，也就无从获取 vue 实例，这样怎么注册组件呢？

带着问题，开始看代码。

##### 插件主体

```typescript
enforce: 'pre',
configResolved(c) {
  config = { ...c }
},
async transform(content, file): Promise<TransformResult> {
  if (!filter(file))
    return

  try {
    /** converts Markdown to VueJS SFC string */
    return await markdownToVue(config)(file, content)
  }
  catch (e: any) {
    this.error(e)
  }
},
async handleHotUpdate(ctx) {
  if (!filter(ctx.file))
    return

  const defaultRead = ctx.read
  ctx.read = async function () {
    return (await markdownToVue(config)(ctx.file, await defaultRead())).code
  }
},
```

`enforce` 设置的是 pre， 也就是在 Vite 核心插件调用前执行，这个很重要，后面就会明白。

这里使用了三个 hook，`configResolved` 会在 vite 配置解析完成后调用，这里是用来保存插件配置的。vite-plugin-md 有自己的一
些配置项，这里保存下来可以在别的方法中获取配置项。

`transform` 是 rollup 中的 hook，官方描述是 `Can be used to transform individual modules`，在这个 hook 中可以对引入的模
块进行转换。transform 的函数类型是： `(code: string, id: string) => TransformResult`。参数中的 code 就是读取到的文件内容
，id 是文件绝对路径。值得注意的是 hook 返回值，类型如下：

```typescript
type TransformResult = string | null | Partial<SourceDescription>

interface SourceDescription {
  code: string
  map?: string | SourceMap
  ast?: ESTree.Program
  assertions?: { [key: string]: string } | null
  meta?: { [plugin: string]: any } | null
  moduleSideEffects?: boolean | 'no-treeshake' | null
  syntheticNamedExports?: boolean | string | null
}
```

rollup 中对返回值的描述：`this hook can optionally return a `{ code, ast, map
}`object. The`ast`must be a standard ESTree AST with`start`and`end`properties for each node. If the transformation does not move code, you can preserve existing sourcemaps by setting`map`to`null`. Otherwise, you might need to generate the source map.`我
们可以直接返回处理后的文件内容，如果有改动，官方建议手动生成一个 source map。

还有一个钩子 `handleHotUpdate`，这个 hook 是 Vite 提供的，用来处理 HMR，每次更新后重新编译。接受一个参数 ctx，ctx 类型签
名如下：

```typescript
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

file 是修改的文件路径。

- `modules` 是受更改文件影响的模块数组。它是一个数组，因为单个文件可能映射到多个服务模块（例如 Vue 单文件组件）。
- `read` 这是一个异步读函数，它返回文件的内容。之所以这样做，是因为在某些系统上，文件更改的回调函数可能会在编辑器完成文
  件更新之前过快地触发，并 `fs.readFile` 直接会返回空内容。传入的 `read` 函数规范了这种行为。

在这个 hook 中，我们不能直接拿到读取过的文件，需要通过调用 read 获取。其实也合理，有些文件的更新并不需要额外处理，等到需
要处理时候再读取。

OK，API 介绍完成，整个方法的逻辑也就很清楚了。configResolved 中保存配置信息。在 transform 和 handleHotUpdate 中，通过
filter 方法，判断当前文件是否是 md 文件（判断文件路径是否是 .md 结尾）。使用 markdownToVue 将 md 文件转换为 Vue SFC 字符
串。

如果敏感一点，我应该已经注意到了这里是将 md 转化为 **SFC 字符串！！！**。可惜当时并不懂这是什么意思。

##### markdownToVue

markdownToVue 的流程很复杂，只会挑其中我感兴趣的看。markdownToVue 最终使用的是 `composeSfcBlocks` 方法。在
composeSfcBlocks 使用的是函数式编程，使用了很多的 flow，pipe 方式（类似于 Haskell 中的 compose，无非是 Haskell 中是从右
到左，这里是从上到下）。整个方法的组织模式是 pointFree 的，也就意味着我们不需要关注中间过程，只需要看几个关键函数就行了
。函数命名语义化也很好，整体阅读体验还是很好的。

**createParser**

这个方法引入 markdown-it，整体代码简单：

```typescript
const createParser = <B extends readonly any[]>() =>
  transformer<B>()('metaExtracted', payload => {
    const parser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      ...(payload.options?.markdownItOptions ? payload.options.markdownItOptions : {})
    })

    parser.linkify.set({ fuzzyLink: false })

    return { ...payload, parser, stage: 'parser' }
  })
```

**loadMarkdownItPlugins**

这一步看代码，是用来加载 markdown-it 插件的。但是和官方给的用法是不一样的：

```typescript
const loadMarkdownItPlugins = <B extends readonly any[]>() =>
  transformer<B>()('parser', payload => {
    payload.options.markdownItUses.forEach(e => {
      const [plugin, options] = toArray(e)
      payload.parser.use(plugin, options)
    })

    return payload
  })
```

可以看到这是使用的 config 中的 `markdownItUses` 选项，依次调用加载。这和上面的 `markdownItSetup` 是不一样的，我怀疑可能
这里导致我之前直接使用 `markdown-it-prism` 高亮代码没有生效。

**parseHtml**

这里就是调用了，markdown-it 的 render 方法，将 md 转化成 html，没什么好说的。

接下来就是一写格式化的东西，比如说如果有给定的 class，或者 vue componnet，将 md 转化后的 html，使用 div 或者 component
包裹起来。这些根据需要来看就行了。

**extractBlocks**

这个函数用来抽离不同的功能去，可以看看，针对各种情况的处理，非常详细。但是对于我来说不是很重要。

**finalize**

看到这个方法，我之前说的第二个疑惑瞬间清楚了：

```typescript
const finalize = <B extends readonly any[]>() =>
  transformer<B>()('sfcBlocksExtracted', payload => {
    const component = `${payload.scriptSetup}${payload.scriptBlocks.join('\n')}${payload.styleBlocks.join(
      '\n'
    )}${payload.customBlocks.join('\n')}${wrap('template', payload.templateBlock)}\n`

    return {
      ...payload,
      stage: 'closeout',
      component
    }
  })
```

这里将之前抽离的各种 block，合并在一起，组成一个 Vue SFC 的标准结构。插件的 `enforce` 设置成 pre，也就好理解了。在插件中
，我们只是对文件内容进行 transform，至于怎么解释 Vue SFC 是 Vite 自己的问题。只要我们返回的是一个合法的 Vue SFC 格式字符
串，Vite 就会使用 [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)，去编译为标准的
JavaScript 和 CSS，这样组件执行提前到 pre 也就是自然的事情了。

接下来是创建 source map，嘿嘿，我跳过了。包括 extractBlocks，留着接下来补课吧。

#### code builder

上面只看到 markdown-it 的插件使用失效的可能原因，后来我是用 code builder 确实高亮了，但是一键 copy 代码配置后报错。所以
我又看了这个插件的代码，看的比较粗糙。

**defaultBlocks**

这个方法是用来创建代码块基本结构的，这里我只关心粘贴的功能：

```typescript
/**
 * The heading row will always be defined but what it contains is determined by
 * configuration
 */
const heading = pipe(
  '<div class="heading-row">',
  addClass(metaClasses),
  fence.props.heading
    ? append(`<div class="${resolver([])(o?.headingClasses).join(' ')}">${fence.props.heading}</div>`)
    : identity,
  o?.clipboard ? append('<i-clipboard class="icon clipboard" @click="_copyClipboard" />') : identity,
  o?.showLanguage ? append('<span class="lang-display"></span>') : identity
)

const codeBlockWrapper = `<div class="code-wrapper">${heading || ''}<div class="code-block"></div>${footer || ''}</div>`
```

可以看到这里给了两个功能区，一个是显示代码的 Language，还有就是 `clipboard` 一键粘贴代码功能。这里给出的点击事件是
`_copyClipboard`。很神奇的是，找不到这个方法的实现。

继续往下看，btw，这个插件代码风格和 vi t-plugin-md 一样，也是 pointFree 的，看到了一个方法 `addClipboard`：

```typescript
const CLIPBOARD =
  '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="clipboard" viewBox="0 0 256 256"><path fill="currentColor" d="M166 152a6 6 0 0 1-6 6H96a6 6 0 0 1 0-12h64a6 6 0 0 1 6 6Zm-6-38H96a6 6 0 0 0 0 12h64a6 6 0 0 0 0-12Zm54-66v168a14 14 0 0 1-14 14H56a14 14 0 0 1-14-14V48a14 14 0 0 1 14-14h37.2a45.8 45.8 0 0 1 69.6 0H200a14 14 0 0 1 14 14ZM94 64v2h68v-2a34 34 0 0 0-68 0Zm108-16a2 2 0 0 0-2-2h-29.7a44.9 44.9 0 0 1 3.7 18v8a6 6 0 0 1-6 6H88a6 6 0 0 1-6-6v-8a44.9 44.9 0 0 1 3.7-18H56a2 2 0 0 0-2 2v168a2 2 0 0 0 2 2h144a2 2 0 0 0 2-2Z"/></svg>'

export const addClipboard =
  (p: Pipeline<PipelineStage.parser>, o: CodeOptions) =>
  (fence: CodeBlockMeta<'dom'>): CodeBlockMeta<'dom'> => {
    const test = (prop: boolean | BlockCallback<boolean>) =>
      typeof prop === 'boolean' ? prop : prop ? prop(fence, p.fileName, p.frontmatter) : false

    if (o?.clipboard || test(fence.props?.clipboard)) {
      fence.codeBlockWrapper = select(fence.codeBlockWrapper)
        .update('.lang-display')(el =>
          pipe(el, append(CLIPBOARD), addClass('use-clipboard'), addVueEvent('onClick', "copyToClipboard('testing')"))
        )
        .toContainer()
    }

    if (test(o.provideClipboardFunctionality) || o?.clipboard || test(fence.props?.clipboard)) {
      const script = `const clipboardAvailable = () => !!navigator?.clipboard?.writeText
  const copyToClipboard = (text) => {
    navigator?.clipboard?.writeText(text)
  }\n`
      p.addCodeBlock('clipboard', script)
    }

    return fence
  }
```

CLIPBOARD 是一个 svg 图标。可以看到，这里判断了 option 是否配置 clipboard 为 true，如果有添加 图标，并且给图标添加事件
copyToClipboard，可能是这里出了问题。我看 8 个月前有人提了相关的 issue，但是没有回复，也就没有继续关心这个代码。

#### Vite plugin 实践

基本的逻辑理清楚了，接下来可以写一个自己的 plugin-md 试一试了。

首先我在项目的 src 目录下面，创建了一个 plugin 目录。其实这是有问题的，这是一个 vite 的 plugin，写在 src 下面不伦不类。
因为这是一个练习用的 plugin，我也没有发布的想法，就这样先写一下。

插件目录如下

```shell
rollup-plugin-md
    ├── convertor
    │   ├── htmlToSfc.ts
    │   ├── index.ts
    │   └── markdown-parser.ts
    └── index.ts
```

首先是 index 中的内容：

```typescript
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
    enforce: 'pre',
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
```

这里的 config 其实我没有用到，只是方便后面拓展使用，我在 markdownToVue 中直接返回了一个 Vue SFC 字符串。

既然 index 有了，那就先导入使用一下呗。

在 vite.config.ts 中添加代码：

```typescript
import mdPlugin from './src/plugins/rollup-plugin-md/index'

export default defineConfig({
  ...,
  plugins: [
    mdPlugin(),
   ...
  ],
})
```

我这里拉取的 vite 模板，`tsconfig.json` 中配置了 reference，项目把 vite 打包配置和项目配置做了区分。ts 中的 references
是 3.0 新增的功能，主要是为了提升 ts 检测效率。

比如说，如果我们的项目中，区分了两个模块，比如说这里，区分了业务模块和打包配置的相关模块。如果我们只是修改打包配置，很明
显，不需要对业务模块进行检查。所以这里拆出了另一个 `tsconfig.node.json`。我们要在 vite.config.ts 中使用 plugin，需要将相
关文件加入 tsconfig.node.json。

```json
--- tsconfig.json
{
  ...
  // 项目中用不到 plugin 所以要排除
  "exclude": ["src/plugins/rollup-plugin-md/**/*.ts"],
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ],
}
--- tsconfig.node.json
{
 ...
  "include": [
    "vite.config.ts",
    // 打包配置需要包括插件
    "src/plugins/rollup-plugin-md/**/*.ts"
  ]
}
```

转换 md 的方法，markdown-parser：

```typescript
import MarkdownIt from 'markdown-it'

import hljs from 'highlight.js'

// 使用 markdown-it 将 md 文件转化为 html
const parser = MarkdownIt({
  // Enable HTML tags in source
  // 最好设置为 false，设置 true 后 lisp code block vue-complier 解析报错
  html: false,
  // Use '/' to close single tags (<br />).
  xhtmlOut: true,
  // Autoconvert URL-like text to links
  linkify: true,
  // Enable some language-neutral replacement + quotes beautification
  typographer: true,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs">' +
          // 复制代码会报错，直接传入 code 会报错，可能是被解析成 js，还没找到解决办法
          // 在 code block 上添加 v-pre 指令，这样 vue 就不会对内部内容进行编译，直接原样输出提升效率
          `<div class="code-heading"><span class="icon lang-display">${lang}</span><svg class="icon clipboard" @click="_copyClipboard"><use xlink:href="#clipboard"></use></svg></div><code v-pre>` +
          hljs.highlight(code, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        )
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + parser.utils.escapeHtml(code) + '</code></pre>'
  }
})

export { parser as mdParser }
```

这里是用了 `highlight.js` 高亮代码。MarkdownIt 的 highlight 方法会在解析到代码块时，自动调用。hljs.highlight 会将代码块
进行转换，然后添加上对应的类名。根据引用的不同样式文件，呈现不同的效果。

我在代码模块前，增加了两个功能区域，分别用来显示代码类型，和一键粘贴。

到了这一步，基本的 html 结构也就有了，但是注意，点击事件和代码高亮的样式还没有。现在是看不出来效果的。

将 html 转化为 SFC，`htmlToSFC`：

```typescript
export const htmlToSFC = (template, file) => {
  return `
  <template> 
    <div class="markdown-body">
        ${template}
        <div style="display:none">
        <svg id="clipboard" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M166 152a6 6 0 0 1-6 6H96a6 6 0 0 1 0-12h64a6 6 0 0 1 6 6Zm-6-38H96a6 6 0 0 0 0 12h64a6 6 0 0 0 0-12Zm54-66v168a14 14 0 0 1-14 14H56a14 14 0 0 1-14-14V48a14 14 0 0 1 14-14h37.2a45.8 45.8 0 0 1 69.6 0H200a14 14 0 0 1 14 14ZM94 64v2h68v-2a34 34 0 0 0-68 0Zm108-16a2 2 0 0 0-2-2h-29.7a44.9 44.9 0 0 1 3.7 18v8a6 6 0 0 1-6 6H88a6 6 0 0 1-6-6v-8a44.9 44.9 0 0 1 3.7-18H56a2 2 0 0 0-2 2v168a2 2 0 0 0 2 2h144a2 2 0 0 0 2-2Z"/></svg>
        </div>
    </div>
  </template>
  <script  setup>
    import "highlight.js/styles/arduino-light.css";
    // const clipboardAvailable = () => !!navigator?.clipboard?.writeText
    const _copyClipboard = e => {
        const target = e.currentTarget.parentNode.parentNode.querySelector('code')
        const text = target.innerText
        navigator?.clipboard?.writeText(text)
    }
  </script>
  <style lang="scss" scoped>
    .code-heading {
        display: flex;
        align-items: center;
        justify-content: end;
        color: #393a34;
        line-height: 1rem;
        .icon +.icon{
            margin-left: 0.2rem;
        }
        .clipboard {
            width: 1rem;
            height: 1rem;
            cursor: pointer;
            opacity: .75;
        }
    }
    .hljs{
        padding: 15px 12px;
        margin: 0;
        background: #f8f8f8;
        > code {
            font-size: 12px;
            word-break: normal;
            display: block;
            overflow-x: auto;
        }
    }
    
  </style>
`
}
```

我这里的实现就很简单了，没有做过多处理，直接拼接。并且导入 highlight.js 相关样式，把点击事件还有 svg 图标加上。没有做过
多处理，也没有添加 source map。
