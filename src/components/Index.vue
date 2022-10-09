<template>
  <div style="height: 100%; width: 100%">
    <header class="Index-header">
      <span class="Index-header-span">面向数字孪生的交通态势演化系统</span>
    </header>
    <section style="height: 93%">
      <el-container style="height: 100%; width: 100%">
        <el-aside class="Index-section-aside" width="200px" height="100%">
          <el-menu
            class="el-menu-demo"
            background-color="#fff"
            text-color="#415058"
            active-text-color="#1684FC"
            :default-active="$route.path"
          >
            <el-submenu :index="i + ''" :key="i" v-for="(item, i) in leftNav">
              <template slot="title">
                <i v-bind:class="[item.icon]"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item
                :index="inner.url"
                :key="i"
                v-for="(inner, i) in item.child"
              >
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
    </section>
  </div>
</template>
<script>
export default {
  name: "index.vue",
  data() {
    return {
      leftNav: [
        {
          name: "路网相关",
          child: [
            { url: "/aboutNetwork/view", name: "预览路网" },
            { url: "/aboutNetwork/generate", name: "生成路网" },
          ],
          icon: "el-icon-discover",
        },
        {
          name: "算法相关",
          child: [
            { url: "/aboutAlgo/dataset", name: "数据集" },
            { url: "/aboutAlgo/valuenetwork", name: "价值网络" },
            { url: "/aboutAlgo/mcts", name: "蒙特卡洛树搜索" },
            { url: "/aboutAlgo/visualization", name: "可视化" },
          ],
          icon: "el-icon-cpu",
        },
        {
          name: "配置相关",
          child: [{ url: "/aboutConfig/unknown", name: "没想好呢" }],
          icon: "el-icon-edit",
        },
      ],
    };
  },
};
</script>
<style scoped>
.Index-header {
  width: 100%;
  height: 80px;
  background: rgb(38, 224, 253);
}
.Index-header-span {
  line-height: 80px;
  font-size: 24px;
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