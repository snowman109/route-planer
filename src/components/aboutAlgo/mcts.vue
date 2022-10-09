<template>
  <div
    style="
      height: 100%;
      width: 100%;
      margin-top: 0px;
      padding-top: 0px;
      position: relative;
    "
  >
    <div class="view-head">
      <el-dialog title="训练网络" :visible.sync="mctsVisiable" width="30%">
        <el-form ref="form" label-width="80px">
          <el-form-item label="路网">
            <span>{{ citySelected }}</span>
          </el-form-item>
          <el-form-item label="车流数">
            <span>{{ flowSelected }}</span>
          </el-form-item>
          <el-form-item label="lr">
            <el-input v-model="lr"></el-input>
          </el-form-item>
          <el-form-item label="扩展阈值">
            <el-input v-model="expansionThr"></el-input>
          </el-form-item>
          <el-form-item label="选择阈值">
            <el-input v-model="nLimit"></el-input>
          </el-form-item>
          <el-form-item label="tGap">
            <el-input v-model="tGap"></el-input>
          </el-form-item>
          <el-form-item label="device">
            <el-select v-model="deviceSelected" placeholder="请选择设备">
              <el-option
                v-for="item in devices"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="mctsVisiable = false">取 消</el-button>
          <el-button
            type="primary"
            @click="createMcts"
            :disabled="!valuenetExist"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <span style="margin-right: 20px; margin-left: 50px"> 路网 </span>
      <el-cascader
        v-model="citySelected"
        :options="city"
        @change="cityChanged"
        :props="{ expandTrigger: 'hover' }"
        style="margin-right: 50px"
      >
      </el-cascader>
      <span style="margin-right: 20px">车流</span>
      <el-select v-model="flowSelected" placeholder="请选择车流">
        <el-option
          v-for="item in flow"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        >
        </el-option>
      </el-select>
      <el-button round style="margin-left: 300px" @click="submit"
        >确定</el-button
      >
      <el-button round style="margin-left: 20px" @click="openMctsDialog"
        >mcts</el-button
      >
    </div>
    <div class="view-body">
      <el-table :data="mcts" height="100%" border style="width: 100%">
        <el-table-column prop="city" label="路网" width="auto">
        </el-table-column>
        <el-table-column prop="type" label="type" width="auto">
        </el-table-column>
        <el-table-column prop="flow" label="车流" width="auto">
        </el-table-column>
        <el-table-column prop="totalLevel" label="总层数" width="auto">
        </el-table-column>
        <el-table-column prop="count" label="搜索次数" width="auto">
        </el-table-column>
        <el-table-column prop="expansionThr" label="扩展阈值" width="auto">
        </el-table-column>
        <el-table-column prop="nLimit" label="选择阈值" width="auto">
        </el-table-column>
        <el-table-column prop="createDate" label="createDate" width="auto">
        </el-table-column>
        <el-table-column prop="finishDate" label="finishDate" width="auto">
        </el-table-column>
        <el-table-column prop="trainSize" label="trainSize" width="auto">
        </el-table-column>
        <el-table-column prop="status" label="status" width="auto">
        </el-table-column>
        <el-table-column label="log" width="auto">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="600"
              trigger="click"
              @show="logShow(scope)"
              @hide="logHide()"
            >
              <el-table :data="logData" height="500">
                <el-table-column
                  width="160"
                  property="time"
                  label="时间"
                ></el-table-column>
                <el-table-column
                  width="440"
                  property="content"
                  label="内容"
                ></el-table-column>
              </el-table>
              <el-button circle slot="reference">click 激活</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="搜索可视化" width="auto">
          <template slot-scope="scope">
            <el-button @click="show(scope.row)">show</el-button>
          </template>
        </el-table-column>
        <el-table-column label="operate" width="auto">
          <template slot-scope="scope">
            <el-button circle @click="trainAgain(scope.row)"
              >trainAgain</el-button
            >
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
        {
          label: "manhattan",
          value: "manhattan",
          children: [{ value: "1环", label: "1环" }],
        },
        {
          label: "beijing",
          value: "beijing",
          children: [{ value: "1环", label: "2环" }],
        },
        {
          label: "jinan",
          value: "jinan",
          children: [{ value: "1环", label: "3环" }],
        },
      ],
      flow: [
        {
          label: "3000",
          value: "3000",
        },
        {
          label: "2000",
          value: "2000",
        },
        {
          label: "3500",
          value: "3500",
        },
      ],
      citySelected: ["", ""],
      flowSelected: "",
      mcts: [],
      logtimer: null,
      logData: [],
      mctsVisiable: false,
      devices: [],
      deviceSelected: "",
      lr: 0.0002,
      expansionThr: 20,
      nLimit: 100,
      tGap: 50,
      valuenetExist: false,
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
              "&type=" +
              data.type +
              "&flow=" +
              data.flow
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
            that.errorTips(err);
          });
      }, 1000);
    },
    logHide() {
      clearInterval(this.logtimer);
    },
    submit() {
      this.getMcts();
    },
    getDevices() {
      this.devices = [];
      this.$http
        .get("/valuenet/device")
        .then((res) => {
          for (let i in res.data.devices) {
            this.devices.push({
              label: res.data.devices[i],
              value: res.data.devices[i],
            });
          }
        })
        .catch((err) => {
          this.errorTips(err.response, "获取设备失败");
        });
    },
    getMcts() {
      this.mcts = [];
      this.$http
        .get(
          "/mcts?city=" +
            this.citySelected[0] +
            "&type=" +
            this.citySelected[1] +
            "&flow=" +
            this.flowSelected
        )
        .then((res) => {
          for (let i = 0; i < res.data.mcts.length; i++) {
            let tmp = res.data.mcts[i];
            this.mcts.push({
              city: tmp.city,
              type: tmp.type,
              flow: tmp.flow,
              totalLevel: tmp.totalLevel,
              count: tmp.count,
              expansionThr: tmp.expansionThr,
              nLimit: tmp.nLimit,
              createDate: tmp.createDate,
              finishDate: tmp.finishDate,
              trainSize: tmp.trainSize,
              status: tmp.status,
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
        this.checkValuenet();
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
            for (let type in response.data[city]) {
              tmp.children.push({
                label: response.data[city][type],
                value: response.data[city][type],
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
          "/dataset/flow?city=" +
            this.citySelected[0] +
            "&type=" +
            this.citySelected[1]
        )
        .then((resp) => {
          // console.log(resp);
          for (let flow in resp.data.flows) {
            let tmp = {
              label: resp.data.flows[flow]["name"],
              value: resp.data.flows[flow]["nums"],
            };
            this.flow.push(tmp);
          }
        })
        .catch((err) => {
          this.errorTips(err.response, "获取失败");
        });
    },
    checkValuenet() {
      this.$http
        .get(
          "/mcts/valuenet?city=" +
            this.citySelected[0] +
            "&type=" +
            this.citySelected[1] +
            "&flow=" +
            this.flowSelected
        )
        .then((res) => {
          if (res.data.exist == 1) {
            this.valuenetExist = true;
          } else {
            this.valuenetExist = false;
          }
        })
        .catch((err) => {
          this.errorTips(err.response, "获取失败");
        });
    },
    createMcts() {
      this.$http
        .post("/mcts", {
          city: this.citySelected[0],
          type: this.citySelected[1],
          flow: this.flowSelected,
          lr: this.lr,
          expansionThr: this.expansionThr,
          nLimit: this.nLimit,
          tGap: this.tGap,
          device: this.deviceSelected,
        })
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
    trainAgain(row) {},
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