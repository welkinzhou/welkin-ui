import routeMerge from './routeMerge.js'

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
        path: 'src/views/articles/{{dashCase name}}/index.vue',
        templateFile: 'plop-templates/page.hbs'
      },
      {
        type: 'add',
        path: 'src/views/articles/{{dashCase name}}/md/index.md'
      },
      function generateRoute(answers) {
        routeMerge(answers.name)
      }
    ]
  })
}
