
<template>
  <div style="height: 100%; width: 100%; margin-top: 0px; padding-top: 0px">
    <div class="view-head">
      <el-cascader
        v-model="citySelected"
        :options="city"
        :props="{ expandTrigger: 'hover' }"
        @change="handleChange"
      >
      </el-cascader>
    </div>
    <div class="view-body">
      <el-tabs type="border-card" style="height: 100%">
        <el-tab-pane label="cityflow" class="cityflow-view">
          <template>
            <div>
              <iframe
                :src="iframeSrc"
                id="mobsf"
                scrolling="no"
                frameborder="0"
              ></iframe>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="有向图">
          <el-image
            class="image"
            :fit="fit"
            :src="cityDirectedGraph"
            :preview-src-list="directedList"
          ></el-image>
        </el-tab-pane>
        <el-tab-pane label="python图">
          <el-image
            class="image"
            :fit="fit"
            :src="cityPythonGraph"
            :preview-src-list="pythonList"
          ></el-image>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: "view-network",
  data() {
    return {
      fit: "fill",
      iframeSrc: "",
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
      citySelected: "",
      cityDirectedGraph: "",
      cityPythonGraph: "",
      directedList: [],
      pythonList: [],
    };
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    function changeMobsfIframe() {
      const mobsf = document.getElementById("mobsf");
      const deviceWidth = document.body.clientWidth;
      const deviceHeight = document.body.clientHeight;
      mobsf.style.width = Number(deviceWidth) * 0.92 + "px"; //数字是页面布局宽度差值
      mobsf.style.height = Number(deviceHeight) * 0.85 + "px"; //数字是页面布局高度差
    }

    changeMobsfIframe();

    window.onresize = function () {
      changeMobsfIframe();
    };
    this.getCityList();
  },
  methods: {
    handleChange(value) {
      console.log(this.citySelected);
      this.$http
        .get("/roadmap/python?city=" + value[0] + "&type=" + value[1])
        .then((response) => {
          console.log(response.data);
          this.cityPythonGraph = this.GLOBAL.URL + response.data;
          this.pythonList.push(this.GLOBAL.URL + response.data);
        });
      this.$http
        .get("/roadmap/directed?city=" + value[0] + "&type=" + value[1])
        .then((response) => {
          this.cityDirectedGraph = this.GLOBAL.URL + response.data;
          this.directedList.push(this.GLOBAL.URL + response.data);
        });
      this.iframeSrc = "/cityflow.html?city=" + value[0] + "&type=" + value[1];
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
  justify-content: center;
}
.view-body {
  width: 100%;
  /* height: 95%; */
  padding: 0;
}
.image {
  height: 500px;
  width: 500px;
  margin-top: 13%;
}
</style>
<style>
.view-body .el-tabs__content {
  padding: 0px !important;
}
</style>