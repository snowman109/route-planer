<template>
    <div style="
      height: 100%;
      width: 100%;
      margin-top: 0px;
      padding-top: 0;
      position: relative;
    ">
        <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form ref="form" label-width="80px">
                <el-form-item label="进度">
                    <el-timeline :reverse="false">
                        <el-timeline-item v-for="(proc, index) in process" :key="index" :timestamp="proc.timestamp"
                            :color="proc.color">
                            {{ proc.content }}
                        </el-timeline-item>
                    </el-timeline>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">隐藏</el-button>
            </span>
        </el-dialog> -->
        <div class="view-body">
            <el-table :data="mapData" height="100%" border style="width: 100%">
                <el-table-column prop="city" label="城市">
                </el-table-column>
                <el-table-column prop="nameId" label="名称id">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                </el-table-column>
                <el-table-column prop="cityflow" label="可搜索图">
                </el-table-column>
                <el-table-column prop="python" label="坐标图">
                </el-table-column>
                <el-table-column prop="direct" label="拓扑图">
                </el-table-column>
                <el-table-column prop="nodeNum" label="节点数">
                </el-table-column>
                <el-table-column prop="edgeNum" label="边数">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
                <el-table-column prop="finishTime" label="完成时间">
                </el-table-column>
                <el-table-column label="操作" width="240">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="deleteData(scope.row)">delete</el-button>
                        <el-popover placement="right" width="600" trigger="click" @show="processShow(scope.row)"
                            @hide="processHide()">
                            <el-form ref="form" label-width="80px">
                                <el-form-item label="进度">
                                    <el-timeline :reverse="false">
                                        <el-timeline-item v-for="(proc, index) in process" :key="index"
                                            :timestamp="proc.timestamp" :color="proc.color">
                                            {{ proc.content }}
                                        </el-timeline-item>
                                    </el-timeline>
                                </el-form-item>
                            </el-form>
                            <el-button type="main" style="margin-left:10px" slot="reference">process</el-button>
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
            mapData: [

            ],
            process: [],
            innertimer: null
        };
    },
    mounted() {
        this.listRoadMapDetail();
    },
    methods: {
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then((_) => {
                    done();
                })
                .catch((_) => { });
        },
        listRoadMapDetail() {
            let that = this;
            this.$http
                .get(
                    "/roadmap/detail"
                )
                .then((resp) => {
                    console.log(resp);
                    that.mapData = resp.data.detail;
                })
                .catch((err) => {
                    this.errorTips(err.response, "获取失败");
                });
        },
        deleteData(data) {
            let rowCity = data.city;
            let rowNameId = data.nameId
            console.log(rowCity)
            let that = this;
            this.$http.delete(
                "/roadmap/delete?city=" + rowCity + "&nameId=" + rowNameId
            ).then((resp) => {
                this.openTips("删除成功", "", "success")
                that.listRoadMapDetail()
            }
            ).catch((err) => {
                window.err = err
                this.errorTips(err.response, "删除失败")
            })
        },
        processHide() {
            clearInterval(this.innertimer);
        },
        processShow(data) {
            let rowCity = data.city;
            let rowNameId = data.nameId
            console.log(rowCity)
            let that = this;
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
                    content: "已生成坐标系图",
                    timestamp: "-",
                    color: "#e4e7ed",
                },
                {
                    content: "已生成sumo路网",
                    timestamp: "-",
                    color: "#e4e7ed",
                },
                {
                    content: "已转化JSON路网",
                    timestamp: "-",
                    color: "#e4e7ed",
                },
                {
                    content: "已生成点线拓扑图",
                    timestamp: "-",
                    color: "#e4e7ed",
                },
                {
                    content: "已生成可搜索图",
                    timestamp: "-",
                    color: "#e4e7ed",
                },
                {
                    content: "complete all",
                    timestamp: "-",
                    color: "#e4e7ed",
                },
            ];
            that.$http.get("/roadmap/create/stats?city=" + rowCity + "&nameId=" + rowNameId).then((res) => {
                that.innertimer = setInterval(function () {
                    that.$http.get("/roadmap/create/stats?city=" + rowCity + "&nameId=" + rowNameId).then((res) => {
                        console.log(res.data);
                        for (let p in res.data.process) {
                            that.process[p].color = "#0bbd87";
                            that.process[p].timestamp = res.data.process[p].timestamp;
                        }
                        if (res.data.process.length == that.process.length) {
                            clearInterval(that.innertimer);
                        }
                    }).catch((err) => {
                        that.errorTips(err.response, "进度已丢失");
                    });
                }, 1000);
            }).catch((err) => {
                this.errorTips(err.response, "进度已丢失");
                return
            });
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