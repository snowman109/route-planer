<template>
  <div style="height: 100%; width: 100%">
    <header class="Index-header">
      <span class="Index-header-span">面向数字孪生的交通态势演化系统</span>
    </header>
    <div style="height: 93%">
      <el-container style="height: 100%; width: 100%">
        <el-aside class="Index-section-aside" width="200px" height="100%">
          <el-menu class="el-menu-demo" background-color="#fff" text-color="#415058" active-text-color="#1684FC"
            :default-active="$route.path">
            <el-submenu :index="i + ''" :key="i" v-for="(item, i) in leftNav">
              <template slot="title">
                <i v-bind:class="[item.icon]"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item :index="inner.url" :key="i" v-for="(inner, i) in item.child">
                <router-link tag="li" :to="inner.url">
                  <span>{{ inner.name }}</span>
                </router-link>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="Index-section-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
export default {
  name: "index.vue",
  data() {
    return {
      leftNav: [
        {
          name: "数据导入模块",
          child: [
            { url: "/dataImport/roadmap/view", name: "预览路网" },
            { url: "/dataImport/roadmap/generate", name: "生成路网" },
            { url: "/dataImport/roadmap/manage", name: "管理路网" },
            { url: "/dataImport/flow/", name: "车流" },
          ],
          icon: "el-icon-discover",
        },
        {
          name: "算法执行模块",
          child: [
            { url: "/algo/dataset", name: "数据集" },
            { url: "/algo/valuenetwork", name: "价值网络" },
            { url: "/algo/mcts", name: "态势推演算法" },            
          ],
          icon: "el-icon-cpu",
        },
        {
          name: "结果可视化模块",
          child: [{ url: "/result/table", name: "结果对比" },
          { url: "/result/route", name: "路网热力图" },
          { url: "/result/tree", name: "搜索树" }],
          icon: "el-icon-picture-outline-round",
        },
      ],
    };
  },
};
</script>
<style scoped>
.Index-header {
  width: 100%;
  height: 60px;
  background: rgb(115, 171, 232);
}

.Index-header-span {
  line-height: 60px;
  font-size: 24px;
  color: #ffffff;
}

.Index-section-aside {
  background-color: #ffffff;
  color: #415058;
  text-align: center;
  height: 100%;
  /* width: 100%; */
}

.Index-section-main {
  height: 100%;
  /* width: 92%; */
  background-color: #d3dce6;
  padding: 0px;
}

.head__li {
  float: left;
}
</style>