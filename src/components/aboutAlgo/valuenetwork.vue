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
    <el-dialog title="训练网络" :visible.sync="trainVisible" width="30%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="路网">
          <span>{{ citySelected }}</span>
        </el-form-item>
        <el-form-item label="车流数">
          <el-select
            v-model="flowSelected"
            @change="chooseDataset"
            placeholder="请选择车流"
            :disabled="flowDisable"
          >
            <el-option
              v-for="item in flow"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据集">
          <el-select
            v-model="datasetSelected"
            multiple
            placeholder="请选择数据集"
          >
            <el-option
              v-for="item in dataset"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="batch_size">
          <el-input v-model="batchSize" :disabled="batchSizeDisable"></el-input>
        </el-form-item>
        <el-form-item label="epoch">
          <el-input v-model="epoch"></el-input>
        </el-form-item>
        <el-form-item label="lr">
          <el-input v-model="lr"></el-input>
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
        <el-button @click="trainVisible = false">取 消</el-button>
        <el-button type="primary" @click="createValuenet">确 定</el-button>
      </span>
    </el-dialog>
    <div class="view-head">
      <span style="margin-right: 20px; margin-left: 50px"> 路网 </span>
      <el-cascader
        v-model="citySelected"
        :options="city"
        :props="{ expandTrigger: 'hover' }"
        style="margin-right: 50px"
      >
      </el-cascader>
      <el-button round style="margin-left: 300px" @click="submit"
        >确定</el-button
      >
      <el-button round style="margin-left: 20px" @click="showTrainDialog"
        >训练网络</el-button
      >
    </div>
    <div class="view-body">
      <el-table :data="valuenet" height="100%" border style="width: 100%">
        <el-table-column prop="city" label="路网" width="100">
        </el-table-column>
        <el-table-column prop="type" label="type" width="100">
        </el-table-column>
        <el-table-column prop="flow" label="车流" width="100">
        </el-table-column>
        <el-table-column prop="path" label="path"> </el-table-column>
        <el-table-column prop="createTime" label="createTime" width="100">
        </el-table-column>
        <el-table-column prop="finishTime" label="finishTime" width="100">
        </el-table-column>
        <el-table-column prop="loss" label="loss" width="100">
        </el-table-column>
        <el-table-column prop="trainSize" label="trainSize" width="100">
        </el-table-column>
        <el-table-column prop="learnRate" label="learnRate" width="100">
        </el-table-column>
        <el-table-column prop="numEpoch" label="Epoch" width="100">
        </el-table-column>
        <el-table-column prop="batchSize" label="batchSize" width="100">
        </el-table-column>
        <el-table-column prop="maxLabel" label="maxLabel" width="100">
        </el-table-column>
        <el-table-column label="lossImage" width="100">
          <template slot-scope="scope">
            <el-button circle @click="showLoss(scope)">show</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="status" width="100">
        </el-table-column>
        <el-table-column label="log" width="100">
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
        <el-table-column label="operate" width="100">
          <template slot-scope="scope">
            <el-button circle @click="updateNeural(scope.row)"
              >update</el-button
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
      active: 0,
      trainVisible: false,
      flowDisable: false,
      batchSizeDisable: false,
      valuenet: [],
      city: [],
      citySelected: ["", ""],
      flow: [],
      flowSelected: "",
      dataset: [],
      datasetSelected: [],
      batchSize: 10,
      epoch: 60,
      lr: 0.0002,
      devices: [],
      deviceSelected: "",
      logtimer: null,
      logData: [],
    };
  },
  mounted() {
    this.getCityList();
    this.getValuenet();
  },
  methods: {
    logShow(scope) {
      this.logData = [];
      let that = this;
      this.logtimer = setInterval(function () {
        let data = scope.row;
        that.$http
          .get(
            "/valuenet/log?city=" +
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
      // 获取价值网络
      this.getValuenet();
    },
    showLoss(scope) {
      let url = scope.row.lossImage;
      window.open(this.GLOBAL.URL + "/valuenet/image?url=" + url);
    },
    showTrainDialog() {
      if (this.citySelected.length < 2 || this.citySelected[0] == "") {
        window.alert("请先选择路网");
      } else {
        this.flowDisable = false;
        this.batchSizeDisable = false;
        this.trainVisible = true;
        this.getFlow();
        this.getDevices();
      }
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
    // trainNeural() {
    //   let data = {
    //     city: this.citySelected[0],
    //     type: this.citySelected[1],
    //     flow: this.flowSelected,
    //     tGap: this.datasetSelected,
    //     epoch: this.epoch,
    //     batch_size: this.batchSize,
    //     lr: this.lr,
    //     device: this.deviceSelected,
    //   };
    //   console.log(data);
    //   this.$http
    //     .post("/valuenet", data)
    //     .then((resp) => {
    //       this.trainVisible = false;
    //       this.getValuenet();
    //     })
    //     .catch((err) => {
    //       this.errorTips(err.response, "创建失败");
    //     });
    //   this.flow = [];
    //   this.devices = [];
    //   this.dataset = [];
    // },
    chooseDataset() {
      // todo 根据所选的路网和车流获取数据集
      this.getDatasets();
    },
    getDatasets() {
      this.dataset = [];
      if (
        this.citySelected.length < 2 ||
        this.citySelected[0] == "" ||
        this.citySelected[1] == "" ||
        this.flowSelected == ""
      ) {
        this.openTips("未选择城市或车流", "获取数据集失败", "error");
        return;
      }
      this.$http
        .get(
          "/dataset?city=" +
            this.citySelected[0] +
            "&type=" +
            this.citySelected[1] +
            "&flow=" +
            this.flowSelected
        )
        .then((resp) => {
          console.log(resp);
          for (let i in resp.data.dataset) {
            if (resp.data.dataset[i].status == "finish") {
              this.dataset.push({
                label:
                  "t_gap: " +
                  resp.data.dataset[i].t_gap +
                  " size:" +
                  resp.data.dataset[i].size,
                value: resp.data.dataset[i].t_gap,
              });
            }
          }
        });
    },
    updateNeural(data) {
      this.flowDisable = true;
      this.batchSizeDisable = true;
      this.citySelected = [data.city, data.type];
      this.flowSelected = data.flow;
      this.batchSize = data.batchSize;
      this.trainVisible = true;
      this.getDevices();
      this.getDatasets();
    },
    getValuenet() {
      let city = this.citySelected[0];
      let type = this.citySelected[1];
      this.valuenet = [];
      this.$http
        .get("/valuenet?city=" + city + "&type=" + type)
        .then((res) => {
          for (let i in res.data.valuenet) {
            let tmp = res.data.valuenet[i];
            this.valuenet.push({
              city: tmp.city,
              type: tmp.type,
              flow: tmp.flow,
              path: tmp.path,
              createTime: tmp.createTime,
              finishTime: tmp.finishTime,
              loss: tmp.loss,
              trainSize: tmp.trainSize,
              learnRate: tmp.learnRate,
              numEpoch: tmp.numEpoch,
              batchSize: tmp.batchSize,
              maxLabel: tmp.maxLabel,
              lossImage: tmp.lossImage,
              status: tmp.status,
              version: tmp.version,
            });
          }
        })
        .catch((err) => {
          this.errorTips(err.response, "获取失败");
        });
    },
    createValuenet() {
      let city = this.citySelected[0];
      let type = this.citySelected[1];
      let flow = this.flowSelected;
      let dataset = this.datasetSelected;
      if (city == "" || type == "" || flow == 0 || dataset.length == 0) {
        this.openTips("未选择城市或车流或dataset", "创建失败", "error");
        return;
      }
      if (this.batchSize <= 0 || this.batchSize > 20) {
        this.openTips("batchSize范围介于0~20之间", "创建失败", "error");
        return;
      }
      if (this.epoch <= 0) {
        this.openTips("epoch应大于0", "创建失败", "error");
        return;
      }
      if (this.lr <= 0 || this.lr > 1) {
        this.openTips("lr应介于0~1之间", "创建失败", "error");
        return;
      }
      let data = {
        city: this.citySelected[0],
        type: this.citySelected[1],
        flow: this.flowSelected,
        tGap: this.datasetSelected,
        epoch: this.epoch,
        batch_size: this.batchSize,
        lr: this.lr,
        device: this.deviceSelected,
      };
      this.$http
        .post("/valuenet", data)
        .then((resp) => {
          this.trainVisible = false;
          this.getValuenet();
        })
        .catch((err) => {
          this.errorTips(err.response, "创建失败");
        });
      this.flow = [];
      this.devices = [];
      this.dataset = [];
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
}
</style>