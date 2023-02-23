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
    <div class="view-body">
      <el-table :data="tableData" border style="width: 100%;margin-top: 10px;margin-left: 20px;">
        <el-table-column prop="algo" label="算法" width="180">
        </el-table-column>
        <el-table-column prop="ALat" label="ALat" width="180">
        </el-table-column>
        <el-table-column prop="ADis" label="ADis" width="180">
        </el-table-column>
        <el-table-column prop="AWai" label="AWai" width="180">
        </el-table-column>
        <el-table-column prop="ADet" label="ADet" width="180">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      graph: null,
      data: {
      },
      timer: null,
      mcts: [{ 'label': 'beijing-bupt1 0', 'value': 1 }],
      mctsSelected: '',
      tableData: [{
        algo: 'minDis',
        ALat: '219.32',
        ADis: '3019.30',
        AWai: '78.90',
        ADet: '0'
      }, {
        algo: 'minLat',
        ALat: '211.69',
        ADis: '3158.11',
        AWai: '51.23',
        ADet: '138.81'
      }, {
        algo: 'minLig',
        ALat: '217.77',
        ADis: '3033.65',
        AWai: '79.19',
        ADet: '14.35'
      }, {
        algo: 'AECG',
        ALat: '200.17',
        ADis: '3190.11',
        AWai: '43.12',
        ADet: '170.81'
      },{
        algo: 'GOR',
        ALat: '197.21',
        ADis: '3176.21',
        AWai: '40.31',
        ADet: '156.91'
      },{
        algo: 'AlphaRoute',
        ALat: '180.37',
        ADis: '3145.23',
        AWai: '20.19',
        ADet: '35.93'
      }]
    };
  },
  methods: {

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
  padding: 0;
  position: absolute;
  top: 40px;
  bottom: 0;
  right: 0;
  justify-content: center;
  background: white;
}
</style>