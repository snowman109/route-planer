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
    <el-dialog title="新建车流" :visible.sync="flowVisible" width="30%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="路网">
          <span>{{ citySelected }}</span>
        </el-form-item>
        <el-form-item label="车流数">
          <el-input v-model="flowNum" style="width: 30%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="flowVisible = false">取 消</el-button>
        <el-popover
          placement="top-start"
          title="注意"
          width="200"
          trigger="hover"
          content="创建之前请检查车流是否存在，若存在将会清空该车流已存在数据集并替换"
        >
          <el-button
            type="primary"
            @click="createFlow"
            style="margin-left: 20px"
            slot="reference"
            :loading="flowLoading"
            >确 定</el-button
          >
        </el-popover>
      </span>
    </el-dialog>
    <el-dialog title="新建数据集" :visible.sync="datasetVisible" width="30%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="路网">
          <span>{{ citySelected }}</span>
        </el-form-item>
        <el-form-item label="车流">
          <span>{{ flowSelected }}</span>
        </el-form-item>
        <el-form-item label="t_gap">
          <el-input v-model="tGap" style="width: 30%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="datasetVisible = false">取 消</el-button>
        <el-button type="primary" @click="createDataset">确 定</el-button>
      </span>
    </el-dialog>
    <div class="view-head">
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
      <el-button icon="el-icon-plus" circle @click="openFlowDialog"></el-button>
      <el-button round style="margin-left: 300px" @click="submit"
        >确定</el-button
      >
      <el-button round style="margin-left: 20px" @click="openDatesetDialog"
        >新建数据集</el-button
      >
    </div>
    <div class="view-body">
      <el-table :data="dataset" height="100%" border style="width: 100%">
        <el-table-column prop="city" label="city" width="120">
        </el-table-column>
        <el-table-column prop="type" label="type" width="120">
        </el-table-column>
        <el-table-column prop="flow" label="flow" width="120">
        </el-table-column>
        <el-table-column prop="tGap" label="t_gap" width="120">
        </el-table-column>
        <el-table-column prop="size" label="size" width="120">
        </el-table-column>
        <el-table-column prop="path" label="path"> </el-table-column>
        <el-table-column prop="createDate" label="createDate" width="120">
        </el-table-column>
        <el-table-column prop="finishDate" label="finishDate" width="120">
        </el-table-column>
        <el-table-column prop="status" label="status" width="120">
        </el-table-column>
        <el-table-column label="log" width="120">
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
              <el-button slot="reference">click 激活</el-button>
            </el-popover>
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
      flowVisible: false,
      datasetVisible: false,
      flowNum: 0,
      tGap: 0,
      date: "",
      flowLoading: false,
      logtimer: null,
      dataset: [
        {
          tGap: 100,
          size: 3120,
          path: "/data/lgy/lightschedule/mapdata/Beijing/1/3000/{date}/data/",
          createDate: "20220422",
          finishDate: "20220423",
          status: "complete",
          log: "",
        },
        {
          tGap: 100,
          size: 3120,
          path: "/data/lgy/lightschedule/mapdata/Beijing/1/3000/{date}/data/",
          createDate: "20220422",
          finishDate: "20220423",
          status: "complete",
          log: "",
        },
        {
          tGap: 100,
          size: 3120,
          path: "/data/lgy/lightschedule/mapdata/Beijing/1/3000/{date}/data/",
          createDate: "20220422",
          finishDate: "20220423",
          status: "complete",
          log: "",
        },
        {
          tGap: 100,
          size: 3120,
          path: "/data/lgy/lightschedule/mapdata/Beijing/1/3000/{date}/data/",
          createDate: "20220422",
          finishDate: "20220423",
          status: "complete",
          log: "",
        },
        {
          tGap: 100,
          size: 3120,
          path: "/data/lgy/lightschedule/mapdata/Beijing/1/3000/{date}/data/",
          createDate: "20220422",
          finishDate: "20220423",
          status: "complete",
          log: "",
        },
      ],
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
      logData: [],
    };
  },
  mounted() {
    this.getCityList();
    this.getDatasets();
    // this.getFlow();
  },
  methods: {
    logShow(scope) {
      this.logData = [];
      let that = this;
      this.logtimer = setInterval(function () {
        let data = scope.row;
        that.$http
          .get(
            "/dataset/log?city=" +
              data.city +
              "&type=" +
              data.type +
              "&flow=" +
              data.flow +
              "&t_gap=" +
              data.tGap
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
    createFlow() {
      let selectCity = this.citySelected[0];
      let selectType = this.citySelected[1];
      let data = {
        city: selectCity,
        type: selectType,
        flow: this.flowNum,
      };
      this.flowLoading = true;
      this.$http
        .post("/dataset/flow", data)
        .then((resp) => {
          this.flowLoading = false;
          this.flowVisible = false;
          this.getDatasets();
          this.getFlow();
        })
        .catch((err) => {
          this.errorTips(err.response, "创建失败");
        });
    },
    submit() {
      this.getDatasets();
    },
    createDataset() {
      let data = {
        city: this.citySelected[0],
        type: this.citySelected[1],
        flow: this.flowSelected,
        t_gap: this.tGap,
      };
      this.$http
        .post("/dataset", data)
        .then((resp) => {
          this.getDatasets();
          this.datasetVisible = false;
        })
        .catch((err) => {
          this.errorTips(err.response, "创建失败");
        });
    },
    openFlowDialog() {
      if (this.citySelected[0] == "") {
        window.alert("请先选择路网");
      } else {
        this.flowVisible = true;
      }
    },
    openDatesetDialog() {
      if (this.citySelected[0] == "" || this.flowSelected == "") {
        window.alert("请先选择路网和车流");
      } else {
        this.datasetVisible = true;
      }
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
    getDatasets() {
      this.dataset = [];
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
            this.dataset.push({
              city: resp.data.dataset[i].city,
              type: resp.data.dataset[i].type,
              flow: resp.data.dataset[i].flow,
              tGap: resp.data.dataset[i].t_gap,
              size: resp.data.dataset[i].size,
              path: resp.data.dataset[i].path,
              createDate: resp.data.dataset[i].createDate,
              finishDate: resp.data.dataset[i].finishDate,
              status: resp.data.dataset[i].status,
            });
          }
        });
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