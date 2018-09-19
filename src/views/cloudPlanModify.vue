<template>
  <div class="PlanModify">
    <section class="con">
      <record :title="title" :tableData="tableData" :planName="planName"></record>
    </section>
  </div>
</template>
<script>
import Record from "@/components/modifyRecord"
  export default{
    name:'CloudPlanModify',
    data(){
      return{
        title:"播放计划修改记录",
        planName:"计划名称",
        tableData:[
          {
            modifier:'IDO品牌宣传广告',
            modifierTime:'张三（135 2156 1353）',
            modifierContent:'1. 时间：修改前“2018.7.17 13:00-14:00”,修改后“2018.7.17 13:30-14:00”'
          }
        ]
      }
    },
    components:{
    "record":Record,
  },
  }
</script>

