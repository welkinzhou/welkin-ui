const routes = [
  {
    path: '/article',
    component: () => import('@/views/articles/index.vue'),
    children: [
      { path: 'sicp', component: () => import('@/views/articles/sicp/index.vue') },
      { path: 'css', component: () => import('@/views/articles/css/index.vue') },
      { path: 'vite', component: () => import('@/views/articles/vite/index.vue') },
      { path: 'haskell', component: () => import('@/views/articles/haskell/index.vue') },
      { path: 'project', component: () => import('@/views/articles/project/index.vue') },
      { path: 'three', component: () => import('@/views/articles/three/index.vue') },
      { path: 'algorithm', component: () => import('@/views/articles/algorithm/index.vue') }
    ]
  }
]
export default routes
