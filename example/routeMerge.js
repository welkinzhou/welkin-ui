import * as fs from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

// 这里输入的 name，是被转换成 dashCase 的name， looks-like-this
export default async function addRoute(name) {
  const absPath = path.join(__dirname, './src/router/article.ts')
  // 读取文件，使用 utf-8
  let file = await fs.readFile(absPath, { encoding: 'utf-8' })

  // 去除字符串中空字符
  file = file.replaceAll(/\s/g, '')

  // 匹配 routes 数组内容
  const reg = /\[.*\]/g
  const arrStr = file.match(reg)[0]

  const newArr = replaceImport(arrStr)

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
  const temp = str.replaceAll(/\(\)=>import\((.*?)\)/g, '$1')
  return temp
}
// 将文件 url 拼接成动态导入形式
function toImport(url) {
  return `()=>import('${url}')`
}
