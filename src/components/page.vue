<template>
  <el-pagination background layout="total, sizes, prev, pager, next, jumper, ->" @size-change="Change" @current-change="Change" :pager-count="5" :current-page="search.pageNo" :page-sizes="[20]" :page-size="dataList.pageRow" :total="dataList.total"></el-pagination>
</template>

<script>
export default{
  name:"Page",
  data(){
    return{
    }
  },
  props:["dataList","search"],
  mounted(){
  },
  methods:{
    Change(val){
      this.$emit("Change",val);
    }
  }
}
</script>
