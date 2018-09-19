<template>
<div class="record">
  <figure>
    <div class="crumbs">
      <span>{{title}}</span>
    </div>
  </figure>
  <div class="box">
    <h3 class="head"><span>【{{planName}}】</span>修改记录</h3>
    <el-table :data="tableData" v-loading="load_data" element-loading-text="拼命加载中">
      <el-table-column align="center" prop="modifier" label="修改人"></el-table-column>
      <el-table-column align="center" prop="modifierTime" label="修改时间"></el-table-column>
      <el-table-column align="center" prop="modifierContent" label="修改内容"></el-table-column>
    </el-table>
  </div>
</div>
</template>
<script>
export default{
  name:'Record',
  props:["title", "tableData","planName"],
  data(){
    return{
      load_data:false,
    }
  },
  mounted(){
  },
  methods:{
  }
}
</script>
<style type="text/scss" lang="scss">
  .record{
    .head{
      color: #333;
      // font-weight: 600;
      font-size: 18px;
    }
  }
</style>
