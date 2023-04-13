import { mdParser } from './markdown-parser'

import { htmlToSFC } from './htmlToSfc'

export const markdownToVue = config => {
  function complier(file, content) {
    const html = mdParser.render(content)
    const sfc = htmlToSFC(html, file)
    return sfc
  }

  return complier
}
