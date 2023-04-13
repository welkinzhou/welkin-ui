/**
 * 将 html 转换成 sfc 内容
 * @param template html 内容
 */

export const htmlToSFC = (template, file) => {
  return `
  <template> 
    <div class="markdown-body">
        ${template}
        <svg id="clipboard" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="clipboard" viewBox="0 0 256 256"><path fill="currentColor" d="M166 152a6 6 0 0 1-6 6H96a6 6 0 0 1 0-12h64a6 6 0 0 1 6 6Zm-6-38H96a6 6 0 0 0 0 12h64a6 6 0 0 0 0-12Zm54-66v168a14 14 0 0 1-14 14H56a14 14 0 0 1-14-14V48a14 14 0 0 1 14-14h37.2a45.8 45.8 0 0 1 69.6 0H200a14 14 0 0 1 14 14ZM94 64v2h68v-2a34 34 0 0 0-68 0Zm108-16a2 2 0 0 0-2-2h-29.7a44.9 44.9 0 0 1 3.7 18v8a6 6 0 0 1-6 6H88a6 6 0 0 1-6-6v-8a44.9 44.9 0 0 1 3.7-18H56a2 2 0 0 0-2 2v168a2 2 0 0 0 2 2h144a2 2 0 0 0 2-2Z"/></svg>
    </div>
  </template>
  <script  setup>
    import "highlight.js/styles/arduino-light.css";
    // const clipboardAvailable = () => !!navigator?.clipboard?.writeText
    const _copyClipboard = e => {
        console.log(e.currentTarget)
        // navigator?.clipboard?.writeText(text)
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
    .hljs > code {
        font-size: 12px;
        padding: 15px 12px;
        margin: 0;
        word-break: normal;
        display: block;
        overflow-x: auto;
        background: #f8f8f8
    }
  </style>
`
}
