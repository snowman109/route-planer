
<template>
  <div id="container">
    <div class="input-card" style="width: 120px">
      <button class="btn" @click="beginEdit" style="margin-bottom: 5px">
        开始编辑
      </button>
      <button class="btn" @click="stopEdit" style="margin-bottom: 5px">
        结束编辑
      </button>
      <button class="btn" @click="downloadMap" style="margin-bottom: 5px">
        下载地图
      </button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" label-width="80px">
        <el-form-item label="城市">
          <el-input v-model="city"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="type"></el-input>
        </el-form-item>
        <el-form-item label="坐标">
          <span>{{ LatLonPath }}</span>
        </el-form-item>
        <el-form-item label="进度">
          <el-timeline :reverse="false">
            <el-timeline-item
              v-for="(proc, index) in process"
              :key="index"
              :timestamp="proc.timestamp"
              :color="proc.color"
            >
              {{ proc.content }}
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" :disabled="cancelDisabled"
          >取 消</el-button
        >
        <el-button type="primary" @click="submit" :loading="commitLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
  data() {
    return {
      map: null,
      polyEditor: null,
      LatLonPath: [],
      polygon: null,
      dialogVisible: false,
      city: "",
      type: "",
      process: [],
      commitLoading: false,
      cancelDisabled: false,
    };
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    initProcess() {
      this.process = [
        {
          content: "坐标解析完成",
          timestamp: "-",
          color: "#e4e7ed",
        },
        {
          content: "下载地图完成",
          timestamp: "-",
          color: "#e4e7ed",
        },
        {
          content: "已生成python图片",
          timestamp: "-",
          color: "#e4e7ed",
        },
        {
          content: "已生成sumo路网",
          timestamp: "-",
          color: "#e4e7ed",
        },
        {
          content: "已转化cityflow路网",
          timestamp: "-",
          color: "#e4e7ed",
        },
        {
          content: "已生成directed图片",
          timestamp: "-",
          color: "#e4e7ed",
        },
        {
          content: "已生成cityflow画图文件",
          timestamp: "-",
          color: "#e4e7ed",
        },
        {
          content: "complete all",
          timestamp: "-",
          color: "#e4e7ed",
        },
      ];
    },
    submit() {
      let data = {
        city: this.city,
        type: this.type,
        coordinate: [],
      };
      console.log(this.city);
      console.log(this.type);
      for (let i = 0; i < this.LatLonPath.length; i++) {
        let coordinate = [];
        let position = this.LatLonPath[i];
        coordinate.push(position.getLng());
        coordinate.push(position.getLat());
        data.coordinate.push(coordinate);
        // console.log(position.getLng(), " ", position.getLat());
      }
      let finish = false;
      this.commitLoading = true;
      this.cancelDisabled = true;
      this.$http.post("/roadmap", data).then((response) => {
        that.dialogVisible = false;
        finish = true;
      });
      let that = this;
      this.initProcess();
      const innertimer = setInterval(function () {
        that.$http.get("/roadmap/create/stats").then((res) => {
          console.log(res.data);
          for (let p in res.data.process) {
            that.process[p].color = "#0bbd87";
            that.process[p].timestamp = res.data.process[p].timestamp;
          }
        });
        if (finish) {
          clearInterval(innertimer);
        }
      }, 1000);
      console.log(data);
    },
    initMap() {
      AMapLoader.load({
        key: "32f41937c25ce43e4cc276cbc03e5f23", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.PolygonEditor"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            //设置地图容器id
            center: [116.3582466, 39.9616717],
            viewMode: "3D", //是否为3D地图模式
            zoom: 16.8, //初始化地图级别
            // center: [105.602725, 37.076636], //初始化地图中心点位置
          });
          this.polyEditor = new AMap.PolygonEditor(this.map);
          var that = this;
          this.polyEditor.on("add", function (data) {
            var polygon = data.target;
            that.polygon = polygon;
            that.LatLonPath = polygon.getPath();
            that.polyEditor.addAdsorbPolygons(polygon);
            console.log(that.LatLonPath);
            polygon.on("dblclick", () => {
              that.polyEditor.setTarget(polygon);
              that.polyEditor.open();
            });
          });
          this.polyEditor.on("end", function (data) {
            var polygon = data.target;
            that.polygon = polygon;
            that.LatLonPath = polygon.getPath();
            that.polyEditor.addAdsorbPolygons(polygon);
            console.log(that.LatLonPath);
          });
          this.polyEditor.open();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    beginEdit() {
      this.polyEditor.open();
    },
    stopEdit() {
      this.polyEditor.close();
    },
    downloadMap() {
      this.initProcess();
      this.dialogVisible = true;
    },
  },
};
</script>

<style  scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.input-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border-radius: 0.25rem;
  width: 22rem;
  border-width: 0;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 0.75rem 1.25rem;
  z-index: 999;
}
/* .input-card button{
  z-index: 999;
} */
</style>