### 脚手架的构建逻辑（Vite 为例）

Vite 默认的 entry 文件是根目录下的 index.html。在 index.html 文件中，会通过 script 引入 src 下的 main.ts 文件。相当于
index.html 提供 SPA 的主体 html 结构，main.ts 提供 javascript 入口。SPA 是通过 javascript 脚本劫持路由，从而动态响应决定
页面布局的。至于 Vue 文件的入库，默认是 APP.vue，main.ts 中会引入 APP.vue，并将其挂载到真实的 DOM 元素上（index.html 中
会给出接口，默认是一个 id 是 app 的 div）。

同时，Vite 提供一个 public 目录，这个目录下的文件不会被打包压缩。打包构建中会将这个目录下的文件，原封不动的复制到打包的
输出目录下。

#### vite 项目的基本配置

**Step 1： 为了开发方便，首先需要配置 `prettier`（严格讲，这和 vite 项目没关系）。**

1.安装 `prettier`

```shell
npm install --save-dev --save-exact prettier
```

2.新建 `.prettierrc.json` 文件，这里面配置 format 的规则，具体配置看官网

```shell
echo {}> .prettierrc.json
```

3.新建 `.prettierignore ` 文件配置需要忽略文件

4.配置 eslint 检查规则，使用 prettier 规则

首先安装 `eslint-config-prettier`

```shell
npm install --save-dev eslint-config-prettier
```

然后再 `.eslintrc.ts` 中添加配置

```typescript
{
  "extends": [
    "prettier" // <----- add this
  ]
}
```

5.接下来是一些可以不配置的选项，例如 git hooks， 在 pre-commit 中可以配置 prettier 格式化，或者 CI 中打包前运行
`prettier --check .`

**Step 2: 自动导入**

自动导入分为两部分，一部分是第三方库 API 的自动导入，而是 components 的自动导入

1.安装插件，`unplugin-vue-components` 自动导入组件(如 element 的所有组件)， `unplugin-auto-import` 自动导入 API （如
ref，computed)

```shell
npm install -D unplugin-vue-components unplugin-auto-import
```

2.接下来配置 `vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dts: true, // or a custom path
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      // global imports to register
      imports: [
        // presets
        'vue',
        'vue-router',
        // custom
        {
          '@vueuse/core': [
            // named imports
            'useMouse', // import { useMouse } from '@vueuse/core',
            // alias
            ['useFetch', 'useMyFetch'] // import { useFetch as useMyFetch } from '@vueuse/core',
          ],
          axios: [
            // default imports
            ['default', 'axios'] // import { default as axios } from 'axios',
          ]
        }
      ],
      eslintrc: {
        enabled: true // <-- this，增加 eslint 检测
      },
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dts: true,
      dirs: ['src/components'], // 默认将 src/components 所有的组件自动全局注册
      types: [
        // types 中只声明不引入， vue-router 已经全局注册了这两个组件，这里是为了 ts 类型声明
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView']
        }
      ],
      resolvers: [ElementPlusResolver()]
    })
  ]
})
```

AutoImport 中设置了 `eslintrc.enable` 为 true，可配合 eslint 使用，在当前目录下会生成一个 `.eslintrc-auto-import.json`文
件，

需要在 `.eslintrc.st` 中增加以下配置

```typescript
export default {
  extends: [
    ...,
    './.eslintrc-auto-import.json'
  ]
}
```

另外使用了 ts 可能还在文件中报错，因为没有引入就使用了 ref 等 vue 的 API，所以在 `tsconfig.json` 需要引入 AutoImport 的
声明文件

```json
{
  "include": ["./auto-imports.d.ts"]
}
```

**Step 3：vite 增加 jsx/tsx 拓展**

1.安装插件 `@vitejs/plugin-vue-jsx`

```
npm install @vitejs/plugin-vue-jsx -D
```

2.配置 `vite.config.ts`

```typescript
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineConfig({
  plugins: [
    vueJsx({}) // <----- add this
  ]
})
```

3.确保 `tsconfig.json` 中配置项 compilerOptions.jsx 是 preserve

```json
{
  "compilerOptions": {
    "jsx": "preserve"
  }
}
```

**Step 4：vite 其他配置**

这里只写两个常见的，其他的看文档吧，添加 `vite.config.ts` 配置

```typescript
import path from 'path'
// get absolute path
const resolve = (relativePath: string) => path.resolve(__dirname, relativePath)

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src') // path alias
    }
  },
  server: {
    host: '0.0.0.0' // listen on IP address
  }
})
```

**Step 5：配置单元测试**

1.安装两个插件 `vitest` 测试断言库，`@vue/test-utils` 生成测试组件的工具类。

2.配置 `vitest.config.ts`。

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    transformMode: {
      web: [/\.[jt]sx$/] // 可以使用tsx jsx
    },
    environment: 'jsdom'
  }
})
```

### 如何组织项目代码

明晰脚手架构建逻辑后，可以发现项目结构的重点应该从 main.ts 出发，修改其他结构意义不大。main.ts 提供全局的 javascript 入
库，这样我们可以在这里进行引入一些公共配置的操作（如，使用插件，挂载全局 Vue 属性等）。

上述操作，并非必须如此。根据个人编写代码的逻辑，可以灵活调整。需要理解入口文件的作用，顾名思义就是一个门面，这样作用也就
好理解了。当我们进入一个商场时，会根据每个门店入口的招牌，来判断这个门店是做什么的。在我们的入口文件中，应该引入偏项目底
层的公共配置，这样就能知道项目大概会有什么功能。

### 主体颜色切换

切换主体的基本思路，就是替换 css 变量值。实现思路也很简单，暗黑模式增加 class，或者 color-scheme，再修改 body 或者 :root
中的 css 变量，覆盖原始值。

`Tips: VueUse 是一个工具库，提供一些常用的 hooks`

```js
import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark({
  storageKey: 'el-theme-appearance'
})

export const toggleDark = useToggle(isDark)
```

使用后的 html 结构如下

```html
<!--light-->
<html>
  ...
</html>

<!--dark-->
<html class="dark">
  ...
</html>
```

### plop 脚手架工具

plop 可以集成到项目中，通过 terminal 交互，执行一些创建常见模版，以及可拓展的命令。

先看例子，慢慢了解：

```javascript
export default function (plop) {
  plop.setHelper('formatDate', function () {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1 > 10 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)

    const day = today.getDate() > 10 ? today.getDate() : '0' + today.getDate()
    return `${year}.${month}.${day}`
  })
  // page generator
  plop.setGenerator('page', {
    description: 'auto create page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'page name please'
      },
      {
        type: 'input',
        name: 'title',
        message: 'article title please'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'target-path/{{dashCase name}}/index.vue',
        templateFile: 'plop-templates/page.hbs'
      }
    ]
  })
}
```

Plop 使用 hbs 模版，支持 mustache 语法，用起来很容易上手，和 vue 中常用的插值类似，使用 `{{ content }}`，向模版插入内容
。

通过 prompt 设置 terminal 交互，type 设置交互类型，具体可以看
[Inquirer.js](https://github.com/SBoudrias/Inquirer.js/)。name 就是传递给 action，模板使用的变量。

这里设置了一个 helper，helper 可以直接在模版中使用，上述的 formatDate helper 没有使用参数，在模板中 `{{ formatDate }}`
就会调用这个函数，假如有参数 `{{ formatDate date }}` 这样就可以调用。

actions 中放置的是需要执行的操作，`type: 'add'` 说明执行的操作是新增文件或文件夹，path 代表新增文件的路由，templateFile
是模版路径。

一般来说，新建页面后，我们仍需创建页面对应路由，这样才能访问到。手动修改很麻烦，幸好 plop 也支持 customAction。只需在
actions 中插入一个方法，即可执行自己想要的操作了。

如下：

```js
import routeMerge from './routeMerge.js'

export default function (plop) {
  // page generator
  plop.setGenerator('page', {
    ...
    actions: [
      ...,
      function generateRoute(answers) { // answers 包含 terminal 获取的所有参数
        routeMerge(answers.name)
      }
    ]
  })
}
```

接下来就是 routeMerge 这个方法。

继续进行之前，需要补充一点点 node 的知识。js 文件除了常见的 .js 后缀，还会有 .cjs，.mjs 这些后缀。之所以这么多后缀，属于
历史遗留问题。

总所周知，一开始 js 是没有模块的，所有的方法和变量都是挂载到全局。显而易见，这样会有命名重复，导致变量覆盖的问题。项目达
到一定程度时，这个问题基本上不可避免的。当时社区的解决办法是，立即执行函数（IIFEs）。时至今日，依旧有一些包用的是这种模
式，比如说百度地图的部分插件。

后来也出现了一些规范，其中就有 commonJs 规范，node 早期采用的就是 commonJs。后来 ECMAScript 开始尝试规范化 JS，也就出现
了 ES6 中的模块化。node 在 ECMAScript 推出 ES6 后，也积极拥抱新规范。切换的过程中，难免出现两种规范并行的情况。为了区分
规范，使用 .cjs 代表 commonJs，.mjs 代表 ES6 module。后续 node 升级后，可以通过 package.json 的 type 指定默认的 js 规范
。我使用的是 `"type": "module"`，当时用 js 文件时就会自动使用 ES module 规范。

```js
import * as fs from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
// ES module 规范下 并没有全局的 __filename 和 __dirname，需要创建
const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

// 这里输入的 name，是被转换成 dashCase 的name， looks-like-this
export default async function addRoute(name) {
  // 获取路由文件内容
  const absPath = path.join(__dirname, './src/router/article.ts')
  // 读取文件，使用 utf-8
  let file = await fs.readFile(absPath, { encoding: 'utf-8' })
  // 去除字符串中空字符
  file = file.replaceAll(/\s/g, '')
  // 匹配 routes 数组内容
  const reg = /\[.*\]/g
  const arrStr = file.match(reg)[0]
  const newArr = replaceImport(arrStr)
  // 提取后数据转换成数组
  const routes = eval(newArr)
  const comName = camelCase(name)
  const newRoute = {
    path: comName,
    component: `@/views/articles/${name}/index.vue`
  }
  // 推入新路由
  routes[0].children.push(newRoute)
  let replacedRoutes = JSON.stringify(routeToString(routes))
  // 替换 () => { * } 前后的 "
  replacedRoutes = replacedRoutes.replaceAll(/\"(\(\)=>import\(.*?\))\"/g, '$1')

  const content = 'const routes =' + replacedRoutes + '\n export default routes'
  // 写入新路由
  fs.writeFile(absPath, content)
}

// 将 dash-case 风格的字符串转成 camelCase 风格
function camelCase(str) {
  const words = str.split('-')
  const camelStr = words.reduce((acc, cur) => {
    const firstLetter = cur.charAt(0)
    const rest = cur.slice(1)
    acc = acc + firstLetter.toUpperCase() + rest
    return acc
  })
  return camelStr
}

// 转换路由信息数组
function routeToString(routes) {
  const temp = routes.map(route => {
    const children = route.children
    // 如果有子级路由，先转换子级
    if (children && Array.isArray(children)) {
      route.children = routeToString(children)
    }
    if (route.component) route.component = toImport(route.component)
    return route
  })
  return temp
}

// 替换打包工具动态导入文件语法
function replaceImport(str) {
  // 使用 ? 转换成非贪婪，小心你匹配多了
  const temp = str.replaceAll(/\(\)=>import\((.*?)\)/g, '$1')
  return temp
}
// 将文件 url 拼接成动态导入形式
function toImport(url) {
  return `()=>import('${url}')`
}
```

上面的方法，如果直接使用正则匹配，把新路由写入进去或许会简单一点。这只是我个人的想法，有很多问题。

接下来讲一下我的思路，以及部分转换的理由。

在 vue 项目中，通常是导出一个路由数组。我这里的路由 component 使用的的动态导入，这个是 vite 或者 webpeck 的语法，类似这
样：

```js
const route = [{
    path: '/article',
    component: () => import(components-path),
    ...
}]
```

最直接的想法就是，在 node 中读取 route 作为数组，向数组中 push 一个新的对象，再将得到的结果输出到文件中。简单的思路，实
践中存在几个问题。

首先读取 route 数组是否可取，根据我目前的尝试，是有问题的。不单单是因为我 routeMerge 使用的是 js， route 文件使用的 ts（
离谱，我怎么会这么写，可能是懒吧）。更重要的是，我们实际上修改的不是运行时获取的对象，而是本地的代码
，`component: () => import(components-path)` 是要经过 vite 编译的。

另外几个问题也和第一个问题相关。如果不能直接导入数组，那就获取字符串，将字符串转化成数组咯。在上面的代码中，我使用正则将
数组提取出来，本来想直接使用 eval 转化成数组（没想到别的好办法，谁来救救孩子）。转换之后，发现 component 是一个函数。形
式上看，没错它就是一个 lambda 函数。我们希望它保持 `component: () => import(components-path)` 的形式， component 必须是
一个字符串。这就有了 `replaceImport` 方法，将 lambda 函数转换成对应组件的路由。

接着就是重写路由文件时，转换成 JSON 是键值都会转换成 "" 包含的字符串。 `() => import(components-path)` 如果是字符串就不
会执行，这样还需要一次转换。

基本上就是这样子。
