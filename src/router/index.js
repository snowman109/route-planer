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
import unknown from '../components/aboutConfig/unknown.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    children: [
      { path: 'aboutNetwork/view', name: 'view', component: view },
      { path: 'aboutNetwork/generate', name: 'generate', component: generate },
      { path: 'aboutAlgo/dataset', name: 'dataset', component: dataset },
      { path: 'aboutAlgo/valuenetwork', name: 'valuenetwork', component: valuenetwork },
      { path: 'aboutAlgo/mcts', name: 'mcts', component: mcts },
      { path: 'aboutAlgo/visualization', name: 'visualization', component: visualization },
      { path: 'aboutConfig/unknown', name: 'unknown', component: unknown },
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
