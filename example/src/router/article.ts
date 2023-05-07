const routes = [
  {
    path: '/article',
    component: () => import('@/views/articles/index.vue'),
    children: [
      {
        path: 'sicp',
        component: () => import('@/views/articles/sicp/index.vue')
      }
    ]
  }
]
export default routes
