import MarkdownIt from 'markdown-it'

import hljs from 'highlight.js'

// 使用 markdown-it 将 md 文件转化为 html
const parser = MarkdownIt({
  // Enable HTML tags in source
  html: true,
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
          `<div class="code-heading"><span class="icon lang-display">${lang}</span><svg class="icon clipboard" @click="_copyClipboard"><use xlink:href="#clipboard"></use></svg></div><code>` +
          hljs.highlight(code, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        )
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + parser.utils.escapeHtml(code) + '</code></pre>'
  }
})

export { parser as mdParser }
