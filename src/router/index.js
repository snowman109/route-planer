import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index.vue'
import mcts from '../components/aboutAlgo/mcts.vue'
import treeview from '../components/aboutAlgo/treeview'
import visualization from '../components/aboutAlgo/visualization.vue'
import dataset from '../components/aboutAlgo/dataset.vue'
import valuenetwork from '../components/aboutAlgo/valuenetwork.vue'
import view from '../components/aboutNetwork/view.vue'
import generate from '../components/aboutNetwork/generate.vue'
import manage from '../components/aboutNetwork/manage.vue'
import flow from '../components/aboutAlgo/flow.vue'
import treeView from '../components/aboutAlgo/treeview.vue'
import unknown from '../components/aboutConfig/unknown.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    children: [
      { path: 'dataImport/roadmap/view', name: 'view', component: view },
      { path: 'dataImport/roadmap/generate', name: 'generate', component: generate },
      { path: 'dataImport/roadmap/manage', name: 'manage', component: manage },
      { path: 'dataImport/flow', name: 'flow', component: flow },
      { path: 'algo/dataset', name: 'dataset', component: dataset },
      { path: 'algo/valuenetwork', name: 'valuenetwork', component: valuenetwork },
      { path: 'algo/mcts', name: 'mcts', component: mcts },
      { path: 'result/table', name: 'table', component: visualization },
      { path: 'result/tree', name: 'tree', component: treeView },
      { path: 'result/route', name: 'route', component: unknown },
    ]
  },
  {
    path: '/treeview',
    name: 'treeview',
    component: treeview
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
