<template>
  <div style="
      height: 100%;
      width: 100%;
      margin-top: 0px;
      padding-top: 0px;
      position: relative;
    ">
    <div class="view-head">
      <el-dialog title="训练网络" :visible.sync="mctsVisiable" width="30%">
        <el-form ref="form" label-width="80px">
          <el-form-item label="路网">
            <span>{{ citySelected }}</span>
          </el-form-item>
          <el-form-item label="车流">
            <span>{{ flowSelected }}</span>
          </el-form-item>
          <el-form-item label="lr">
            <el-input v-model="lr"></el-input>
          </el-form-item>
          <el-form-item label="扩展阈值">
            <el-input v-model="expansionThreshold"></el-input>
          </el-form-item>
          <el-form-item label="选择阈值">
            <el-input v-model="nLimit"></el-input>
          </el-form-item>
          <el-form-item label="tGap">
            <el-input v-model="tGap"></el-input>
          </el-form-item>
          <el-form-item label="device">
            <el-select v-model="deviceSelected" placeholder="请选择设备">
              <el-option v-for="item in devices" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="基准版本">
            <el-select v-model="baseVersionSelected" placeholder="请选择基准版本">
              <el-option v-for="item in baseVersions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="mctsVisiable = false">取 消</el-button>
          <el-button type="primary" @click="createMcts">确 定</el-button>
        </span>
      </el-dialog>
      <span style="margin-right: 20px; margin-left: 50px"> 路网 </span>
      <el-cascader v-model="citySelected" :options="city" @change="cityChanged" :props="{ expandTrigger: 'hover' }"
        style="margin-right: 50px">
      </el-cascader>
      <span style="margin-right: 20px">车流</span>
      <el-select v-model="flowSelected" placeholder="请选择车流">
        <el-option v-for="item in flow" :key="item.value" :label="item.label" :value="item.value"
          :disabled="item.disabled">
        </el-option>
      </el-select>
      <el-button round style="margin-left: 300px" @click="submit">确定</el-button>
      <el-button round style="margin-left: 20px" @click="openMctsDialog">mcts</el-button>
      <el-popover placement="right" width="600" trigger="click" @show="processLogShow()" @hide="processLogHide()">
        <el-table :data="processLogData" height="500">
          <el-table-column width="600" property="content" label="内容"></el-table-column>
        </el-table>
        <el-button round style="margin-left: 20px" slot="reference">查看进程log</el-button>
      </el-popover>
    </div>
    <div class="view-body">
      <el-table :data="mcts" height="100%" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table v-bind:data="props.row.detail" :default-expand-all="true">
              <el-table-column prop="version" align="center" label="版本" width="100">
              </el-table-column>
              <el-table-column prop="baseVersion" align="center" label="基准版本" width="100">
              </el-table-column>
              <el-table-column prop="tGap" align="center" label="时间间隔" width="100">
              </el-table-column>
              <el-table-column prop="expansionThreshold" align="center" label="扩展阈值" width="100">
              </el-table-column>
              <el-table-column prop="nLimit" align="center" label="选择阈值" width="100">
              </el-table-column>
              <el-table-column prop="learnRate" align="center" label="学习率" width="100">
              </el-table-column>
              <el-table-column prop="totalLevel" align="center" label="总层数" width="100">
              </el-table-column>
              <el-table-column prop="trainSize" align="center" label="数据集大小" width="100">
              </el-table-column>
              <el-table-column prop="device" align="center" label="设备" width="100">
              </el-table-column>
              <el-table-column prop="loss" align="center" label="损失" width="100">
              </el-table-column>
              <el-table-column label="损失图片" width="100">
                <template slot-scope="scope">
                  <el-button @click="showLoss(scope)">show</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="status" align="center" label="状态" width="100">
              </el-table-column>
              <el-table-column prop="createDate" align="center" label="开始时间" width="100">
              </el-table-column>
              <el-table-column prop="finishDate" align="center" label="结束时间" width="100">

              </el-table-column>
              <el-table-column label="log" width="auto">
                <template slot-scope="scope">
                  <el-popover placement="right" width="600" trigger="click" @show="logShow(scope)" @hide="logHide()">
                    <el-table :data="logData" height="500">
                      <el-table-column width="160" property="time" label="时间"></el-table-column>
                      <el-table-column width="440" property="content" label="内容"></el-table-column>
                    </el-table>
                    <el-button slot="reference">show</el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="搜索可视化" width="auto">
                <template slot-scope="scope">
                  <el-button @click="show(scope.row)">show</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="路网" width="auto">
        </el-table-column>
        <el-table-column prop="nameId" label="nameId" width="auto">
        </el-table-column>
        <el-table-column prop="flowId" label="车流" width="auto">
        </el-table-column>
        <el-table-column prop="searchCount" label="搜索次数" width="auto">
        </el-table-column>
        <el-table-column prop="createDate" label="createDate" width="auto">
        </el-table-column>
        <el-table-column prop="finishDate" label="finishDate" width="auto">
        </el-table-column>
        <el-table-column prop="trainSize" label="trainSize" width="auto">
        </el-table-column>
        <el-table-column prop="status" label="status" width="auto">
        </el-table-column>
        <el-table-column label="operate" width="auto">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteData(scope.row)">delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      city: [

      ],
      flow: [

      ],
      citySelected: ["", ""],
      flowSelected: "",
      mcts: [],
      logtimer: null,
      logData: [],
      mctsVisiable: false,
      devices: [],
      deviceSelected: "",
      baseVersions: [],
      baseVersionSelected: "",
      lr: 0.0002,
      expansionThreshold: 20,
      nLimit: 100,
      tGap: 50,
      processLogTimer: null,
      processLogData: []
    };
  },
  mounted() {
    this.getMcts();
    this.getCityList();
  },
  methods: {
    logShow(scope) {
      this.logData = [];
      let that = this;
      this.logtimer = setInterval(function () {
        let data = scope.row;
        that.$http
          .get(
            "/mcts/log?city=" +
            data.city +
            "&nameId=" +
            data.nameId +
            "&flowId=" +
            data.flowId +
            "&version=" +
            data.version
          )
          .then((resp) => {
            for (let i = that.logData.length; i < resp.data.logs.length; i++) {
              that.logData.push({
                time: resp.data.logs[i].time,
                content: resp.data.logs[i].content,
              });
            }
          })
          .catch((err) => {
            clearInterval(that.logtimer);
            that.errorTips(err.response, "获取日志失败");
          });
      }, 1000);
    },
    logHide() {
      clearInterval(this.logtimer);
    },
    submit() {
      this.getMcts();
    },
    showLoss(scope) {
      let url = scope.row.lossPath;
      window.open(this.GLOBAL.URL + "/mcts/image?url=" + url);
    },
    getDevices() {
      this.devices = [];
      this.$http
        .get("/valuenet/device")
        .then((res) => {
          for (let i in res.data.devices) {
            this.devices.push({
              label: res.data.devices[i].name + ", 显存使用率" + (res.data.devices[i].used * 100).toFixed(2) + "%",
              value: res.data.devices[i].name,
            });
          }
        })
        .catch((err) => {
          this.errorTips(err.response, "获取设备失败");
        });
    },
    getBaseVersions() {
      this.baseVersions = []
      this.$http.get("/mcts/version?city=" +
        this.citySelected[0] +
        "&nameId=" +
        this.citySelected[1] +
        "&flowId=" +
        this.flowSelected).then((res) => {
          for (let i = 0; i < res.data.version.length; i++) {
            this.baseVersions.push({
              label: res.data.version[i].version + ", loss" + res.data.version[i].loss,
              value: res.data.version[i].version
            })
          }
        }).catch((err) => {
          this.errorTips(err.response, "获取历史版本失败")
        })
    },
    getMcts() {
      this.mcts = [];
      this.$http
        .get(
          "/mcts?city=" +
          this.citySelected[0] +
          "&nameId=" +
          this.citySelected[1] +
          "&flowId=" +
          this.flowSelected
        )
        .then((res) => {
          for (let i = 0; i < res.data.mcts.length; i++) {
            let tmp = res.data.mcts[i];
            this.mcts.push({
              city: tmp.city,
              nameId: tmp.nameId,
              flowId: tmp.flowId,
              totalLevel: tmp.totalLevel,
              searchCount: tmp.searchCount,
              expansionThreshold: tmp.expansionThreshold,
              nLimit: tmp.nLimit,
              createDate: tmp.createDate,
              finishDate: tmp.finishDate,
              trainSize: tmp.trainSize,
              status: tmp.status,
              detail: tmp.detail
            });
          }
        })
        .catch((err) => {
          this.errorTips(err.response, "获取失败");
        });
    },

    openMctsDialog() {
      if (
        this.citySelected.length < 2 ||
        this.citySelected[0] == "" ||
        this.flowSelected == ""
      ) {
        window.alert("请先选择路网或车流");
      } else {
        this.mctsVisiable = true;
        this.getDevices();
        this.getBaseVersions();
      }
    },
    getCityList() {
      this.$http
        .get("/roadmap")
        .then((response) => {
          this.city = [];
          for (let city in response.data) {
            let tmp = {
              label: city,
              value: city,
              children: [],
            };
            for (let nameId in response.data[city]) {
              tmp.children.push({
                label: response.data[city][nameId],
                value: response.data[city][nameId],
              });
            }
            this.city.push(tmp);
          }
        })
        .catch((err) => {
          this.errorTips(err.response, "获取失败");
        });
    },
    cityChanged() {
      this.getFlow();
    },
    getFlow() {
      this.flow = [];
      if (this.citySelected == "") {
        return;
      }
      this.$http
        .get(
          "/flow/query?city=" +
          this.citySelected[0] +
          "&nameId=" +
          this.citySelected[1]
        )
        .then((resp) => {
          console.log(resp);
          for (let flow in resp.data.flows) {
            let tmp = {
              label: resp.data.flows[flow]["flowId"],
              value: resp.data.flows[flow]["flowId"],
            };
            this.flow.push(tmp);
          }
        })
        .catch((err) => {
          this.errorTips(err.response, "获取失败");
        });
    },
    createMcts() {
      let data = {
        city: this.citySelected[0],
        nameId: this.citySelected[1],
        flowId: this.flowSelected,
        lr: this.lr,
        expansionThreshold: this.expansionThreshold,
        nLimit: this.nLimit,
        tGap: this.tGap,
        baseVersion: this.baseVersionSelected,
        device: this.deviceSelected,
      }
      this.$http
        .post("/mcts", data)
        .then((res) => {
          this.getMcts();
          this.mctsVisiable = false;
        })
        .catch((err) => {
          this.errorTips(err.response, "创建失败");
        });
    },
    show(row) {
      let routeUrl = this.$router.resolve({
        path: "/treeview",
        query: { id: 1 },
      });
      window.open(routeUrl.href, "_blank");
    },
    deleteData(data) {
      let rowCity = data.city;
      let rowNameId = data.nameId
      let flowId = data.flowId
      let that = this;
      this.$http.delete(
        "/mcts?city=" + rowCity + "&nameId=" + rowNameId + '&flowId=' + flowId
      ).then((resp) => {
        this.openTips("删除成功", "", "success")
        that.getMcts()
      }
      ).catch((err) => {
        window.err = err
        this.errorTips(err.response, "删除失败")
      })
    },
    processLogShow() {
      this.processLogData = [];
      let that = this;
      this.processLogTimer = setInterval(function () {
        that.$http
          .get(
            "/dataset/processLog"
          )
          .then((resp) => {
            for (let i = that.processLogData.length; i < resp.data.logs.length; i++) {
              that.processLogData.push({
                content: resp.data.logs[i].content,
              });
            }
          })
          .catch((err) => {
            clearInterval(that.processLogTimer);
            that.errorTips(err.response, "获取日志文件失败");
          });
      }, 1000);
    },
    processLogHide() {
      clearInterval(this.processLogTimer)
    },
    errorTips: function (res, type) {
      if (res.status === 401) {
        this.openTips(type, "缺少权限", "error");
      } else if (res.status === 402) {
        this.openTips("登录状态丢失，请重新登录", "", "error");
      } else if (res.status === 500) {
        this.openTips(type, "服务器问题，请稍后再试", "error");
      } else {
        this.openTips(type, res.data, "error");
      }
    },
  },
};
</script>
<style scoped>
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
  /* height: auto; */
  /* height: 95%; */
  padding: 0;
  left: 0;
  right: 0;
  top: 40px;
  bottom: 0;
  position: absolute;
  background: white;
}
</style>