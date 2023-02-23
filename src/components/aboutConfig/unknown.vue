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
        <el-table-column prop="MinDis" label="MinDis" width="300">
          <template slot-scope="scope">
            <img :src="require('../../assets/'+scope.row.MinDis+'.png')" style="max-width: 300px; max-height: 300px;">
          </template>
        </el-table-column>
        <el-table-column prop="AECG" label="AECG" width="300">
          <template slot-scope="scope">
            <img :src="require('../../assets/'+scope.row.AECG+'.png')" style="max-width: 300px; max-height: 300px;">
          </template>
        </el-table-column>
        <el-table-column prop="GOR" label="GOR" width="300">
          <template slot-scope="scope">
            <img :src="require('../../assets/'+scope.row.GOR+'.png')" style="max-width: 300px; max-height: 300px;">
          </template>
        </el-table-column>
        <el-table-column prop="AlphaRoute" label="AlphaRoute" width="300">
          <template slot-scope="scope">
            <img :src="require('../../assets/'+scope.row.AlphaRoute+'.png')" style="max-width: 300px; max-height: 300px;">
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-image class="image" :src="require('../../assets/logo.png')"></el-image> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mcts: [{ 'label': 'beijing-bupt1 0', 'value': 1 }],
      mctsSelected: '',
      tableData: [{
        MinDis: 'MinDis',
        AECG: 'AECG',
        GOR: 'GOR',
        AlphaRoute: 'AlphaRoute',
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