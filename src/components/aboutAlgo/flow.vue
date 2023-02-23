<template>
    <div style="
      height: 100%;
      width: 100%;
      margin-top: 0px;
      padding-top: 0;
      position: relative;
    ">
        <div class="view-body">
            <el-table :data="flowData" height="100%" border style="width: 100%">
                <el-table-column prop="city" label="城市">
                </el-table-column>
                <el-table-column prop="nameId" label="名称id">
                </el-table-column>
                <el-table-column prop="flowId" label="车流id">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                </el-table-column>
                <el-table-column prop="flow" label="车辆数">
                </el-table-column>
                <el-table-column prop="actualFlow" label="实际车辆数">
                </el-table-column>
                <el-table-column prop="flowPath" label="车流路径">
                </el-table-column>
                <el-table-column prop="configPath" label="配置路径">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
                <el-table-column prop="finishTime" label="完成时间">
                </el-table-column>
                <el-table-column label="操作" width="120">
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
            flowData: [

            ]
        };
    },
    mounted() {
        this.listFlowData();
    },
    methods: {
        listFlowData() {
            let that = this;
            this.$http
                .get(
                    "/flow"
                )
                .then((resp) => {
                    console.log(resp);
                    that.flowData = resp.data.flows;
                })
                .catch((err) => {
                    this.errorTips(err.response, "获取失败");
                });
        },
        deleteData(data) {
            let rowCity = data.city;
            let rowNameId = data.nameId
            let flowId = data.flowId
            let that = this;
            this.$http.delete(
                "/flow?city=" + rowCity + "&nameId=" + rowNameId + '&flowId=' + flowId
            ).then((resp) => {
                this.openTips("删除成功", "", "success")
                that.listFlowData()
            }
            ).catch((err) => {
                window.err = err
                this.errorTips(err.response, "删除失败")
            })
        },
        errorTips: function (res, type) {
            console.log(res)
            if (res.status === 401) {
                this.openTips(type, "缺少权限", "error");
            } else if (res.status === 402) {
                this.openTips("登录状态丢失，请重新登录", "", "error");
            } else if (res.status === 500) {
                this.openTips(type, "服务器问题，请稍后再试", "error");
            } else if (res.status == 409) {
                this.openTips(type, res.data, "error")
            } else {
                this.openTips(type, "error");
            }
        }
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
    height: 100%;
    padding: 0;
    left: 0;
    right: 0;
    bottom: 0;

}
</style>