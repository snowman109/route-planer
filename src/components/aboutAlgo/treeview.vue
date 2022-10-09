<template>
  <div>
    <div id="mountNode"></div>
  </div>
</template>
<script>
import G6 from "@antv/g6";
export default {
  data() {
    return {
      graph: null,
      data: {
        // 点集
        id: -1,
        label: "root",
        value: 0,
        n: 0,
        children: [
          { id: 1, label: "1", value: 0, n: 0 },
          { id: 2, label: "2", value: 2, n: 3 },
          { id: 3, label: "3", value: 1, n: 4 },
        ],
      },
      timer: null,
    };
  },
  mounted() {
    this.initGraph();
  },
  methods: {
    initGraph() {
      let minimap = new G6.Minimap({
        size: [100, 100],
        className: "minimap",
        type: "delegate",
      });
      let grid = new G6.Grid();
      this.graph = new G6.TreeGraph({
        container: "mountNode", // 指定图画布的容器 id，与第 9 行的容器对应
        // // 画布宽高
        defaultNode: {
          size: [60, 40],
          style: {
            fill: "#DEE9FF",
            stroke: "#5B8FF9",
          },
        },
        defaultEdge: {
          size: 1,
          color: "#b5b5b5",
        },
        layout: {
          type: "dendrogram", // 布局类型
          direction: "TB", // 自左至右布局，可选的有 H / V / LR / RL / TB / BT
          nodeSep: 10, // 节点之间间距
          rankSep: 20, // 每个层级之间的间距
        },
        animate: true,
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            "drag-node",
            {
              // 定义展开/收缩行为
              type: "collapse-expand",
            },
            {
              type: "tooltip",
              formatText(model) {
                const text =
                  "label: " + model.label + "<br/> class: " + model.class;
                return text;
              },
              shouldUpdate: (e) => {
                return true;
              },
            },
          ], // 允许拖拽画布、放缩画布、拖拽节点
        },
        nodeStateStyles: {
          // 节点状态样式
          // 鼠标悬浮在节点上时的样式
          hover: {
            fill: "#5B8FF9",
            stroke: "#5B8FF9",
          },
          // 鼠标点击节点时的样式
          selected: {
            fill: "#5B8FF9",
            stroke: "#5B8FF9",
          },
        },
        plugins: [minimap, grid], // 将 Minimap 和 Grid 插件的实例配置到图上
        fitCenter: true,
      });
      // 读取数据
      this.graph.data(this.data);
      // 渲染图
      this.graph.render();
      this.graph // 鼠标进入节点
        .on("node:mouseenter", (e) => {
          const nodeItem = e.item; // 获取鼠标进入的节点元素对象
          this.graph.setItemState(nodeItem, "hover", true); // 设置当前节点的 hover 状态为 true
        });

      // 鼠标离开节点
      this.graph.on("node:mouseleave", (e) => {
        const nodeItem = e.item; // 获取鼠标离开的节点元素对象
        this.graph.setItemState(nodeItem, "hover", false); // 设置当前节点的 hover 状态为 false
      });

      // 点击节点
      this.graph.on("node:click", (e) => {
        // 先将所有当前是 click 状态的节点置为非 click 状态
        const clickNodes = this.graph.findAllByState("node", "click");
        clickNodes.forEach((cn) => {
          this.graph.setItemState(cn, "click", false);
        });
        const nodeItem = e.item; // 获取被点击的节点元素对象
        this.graph.setItemState(nodeItem, "click", true); // 设置当前节点的 click 状态为 true
      });

      // 点击边
      this.graph.on("edge:click", (e) => {
        // 先将所有当前是 click 状态的边置为非 click 状态
        const clickEdges = this.graph.findAllByState("edge", "click");
        clickEdges.forEach((ce) => {
          this.graph.setItemState(ce, "click", false);
        });
        const edgeItem = e.item; // 获取被点击的边元素对象
        this.graph.setItemState(edgeItem, "click", true); // 设置当前边的 click 状态为 true
      });
      let that = this;
      this.timer = setInterval(function () {
        that.$http
          .get(
            this.GLOBAL.IP +
            ":5001/mcts/treeview"
          )
          .then((resp) => {
            that.data = resp.data.treeView;
          })
          .catch((err) => {
            clearInterval(that.timer);
            that.errorTips(err);
          });
      }, 1000);
    },
  },
};
</script>
<style scoped>
.g6-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}
</style>