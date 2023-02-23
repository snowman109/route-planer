<template>
  <div style="
      height: 100%;
      width: 100%;
      margin-top: 0px;
      padding-top: 0px;
      position: relative;
    ">
    <div class="view-head">
      <span style="margin-right: 20px; margin-left: 50px">态势推演算法</span>
      <el-select v-model="mctsSelected" placeholder="请选择算法结果">
        <el-option v-for="item in mcts" :key="item.value" :label="item.label" :value="item.value"
          :disabled="item.disabled">
        </el-option>
      </el-select>
      <el-button round style="margin-left: 300px" @click="submit">确定</el-button>
    </div>
    <div id="mountNode" class="view-body"></div>
  </div>
</template>
<script>
import G6 from "@antv/g6";
export default {
  data() {
    return {
      graph: null,
      data: {
      },
      timer: null,
      mcts: [{'label':'beijing-bupt1 0','value':1}],
      mctsSelected: ''
    };
  },
  mounted() {
    this.initGraph();
  },
  methods: {
    initData() {
      this.data = {
        id: 'node0',
        label: "root",
        value: 0,
        n: 0,
        x: -86.5,
        y: -95.5,
        current: true,
        valid: true,
        children: []
      }
      // 第一层孩子
      for (let i = 0; i < 81; i++) {
        const id = i + 1
        this.data.children.push(
          {
            id: 'node' + id,
            label: "node" + id,
            value: id,
            n: id,
            current: false,
            valid: i % 3 == 0,
            children: []
          }
        )
      }
      // 第二层孩子 39
      for (let i = 0; i < 81; i++) {
        const id = i + 1
        this.data.children[39].children.push(
          {
            id: 'node39' + id,
            label: "node" + id,
            value: id,
            n: id,
            current: false,
            valid: i % 3 == 0,
            children: []
          }
        )
      }
      // 第三层孩子 35
      for (let i = 0; i < 81; i++) {
        const id = i + 1
        this.data.children[39].children[35].children.push(
          {
            id: 'node3935' + id,
            label: "node" + id,
            value: id,
            n: id,
            current: false,
            valid: i % 3 == 0,
            children: []
          }
        )
      }
      // 第四层孩子 42
      for (let i = 0; i < 81; i++) {
        const id = i + 1
        this.data.children[39].children[35].children[42].children.push(
          {
            id: 'node393542' + id,
            label: "node" + id,
            value: id,
            n: id,
            current: false,
            valid: i % 3 == 0,
            children: []
          }
        )
      }
      this.data.children[39].children[35].children[42].n=53
      this.data.children[39].children[35].children[42].value=217.9
      // 第四层孩子 35
      for (let i = 0; i < 81; i++) {
        const id = i + 1
        this.data.children[39].children[35].children[42].children[35].children.push(
          {
            id: 'node39354235' + id,
            label: "node" + id,
            value: id,
            n: id,
            current: false,
            valid: i % 3 == 0,
            children: []
          }
        )
      }
    },
    initGraph() {
      this.initData()

      const container = document.getElementById('mountNode');
      const width = container.scrollWidth;
      const height = container.scrollHeight;
      this.data.x = width / 2;
      this.data.y = 0
      console.log(width)
      console.log(height)
      const minimap = new G6.Minimap({
        size: [100, 100],
        className: "minimap",
        type: "delegate",
      });
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        itemTypes: ['node', 'edge'],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const outDiv = document.createElement('div');
          outDiv.style.width = 'fit-content';
          //outDiv.style.padding = '0px 0px 20px 0px';
          // e.item.getType()
          outDiv.innerHTML = `
      <ul>
        <li>n: ${e.item.getModel().n}</li>
      </ul>
      <ul>
        <li>value: ${e.item.getModel().value}</li>
      </ul>`;
          return outDiv;
        },
      });
      this.graph = new G6.TreeGraph({
        container: "mountNode", // 指定图画布的容器 id，与第 9 行的容器对应
        width: width,
        height: height - 110,
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
          type: "compactBox", // 布局类型
          direction: "TB", //
          getId: function getId(d) {
            return d.id;
          },
          getHGap: (d) => {
            return 15
          }, // 节点水平间隙
          getVGap: (d) => {
            return 25
          }, // 节点的垂直间隙
          getWidth: (d) => {
            return 60
          },
          getHeight: (d) => {
            return 50
          }
        },

        animate: true,
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            "drag-node",
            "activate-relations",
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                const data = item.getModel();
                data.collapsed = collapsed;
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
        plugins: [minimap, tooltip], // 将 Minimap 和 Grid 插件的实例配置到图上
        fitCenter: true,
      });
      // 读取数据
      this.graph.data(this.data);
      // 渲染图
      this.graph.render();
      this.graph // 鼠标进入节点
        .on("node:mouseenter", (e) => {
          console.log
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
        this.handleNodeClick(e)
      });
      // root收缩和移动中间
      const item = this.graph.findById('node0')
      this.graph.emit('node:click', {
        item: item,
      })
      // let that = this;
      // this.timer = setInterval(function () {
      //   that.$http
      //     .get(
      //       this.GLOBAL.IP +
      //       ":5001/mcts/treeview"
      //     )
      //     .then((resp) => {
      //       that.data = resp.data.treeView;
      //     })
      //     .catch((err) => {
      //       clearInterval(that.timer);
      //       that.errorTips(err);
      //     });
      // }, 1000);
    },
    handleNodeClick(event) {
      const item = event.item;
      console.log(item)
      // animately move the graph to focus on the item.
      // the second parameter controlls whether move with animation, the third parameter is the animate configuration
      this.graph.focusItem(item, true, {
        easing: 'easeCubic',
        duration: 500,
      });
    }
  },
};
</script>
<style scoped>
.g6-tooltip {
  border: 2px solid #171717;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  /* padding: 10px 8px; */
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}

.view-head {
  width: 100%;
  height: 40px;
  background: white;
  vertical-align: middle;
  /*flex 布局*/
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  justify-content: left;
}

.view-body {
  width: 100%;
  padding: 0;
  position: absolute;
  top: 40px;
  bottom: 0;
  right: 0;
  background: white;
}
</style>