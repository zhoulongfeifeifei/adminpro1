<template>
  <div class="data">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>数据</span>
        </div>
      </figure>
      <div class="box boxData">
        <div class="boxList" v-for="(item,index) in eachrtsList">
          <div class="boxListHead">
            <div class="boxHeadLeft">
              <span>123</span>
              <div class="boxLeft">
                <h3 class="boxLeftTit">{{item.totalTit}}</h3>
                <h4 style="color:#9394B5;">{{item.newAddTit}}</h4>
              </div>
            </div>
            <div class="boxHeadRight">
              <h1 class="boxLeftTit">{{item.total}}</h1>
              <h3>{{item.newAdd}}</h3>
            </div>
          </div>
          <div class="allData" :id="'allData'+index"></div>
        </div>
      </div>
      <div class="box box1">
        <div class="ecahrtData" id='allData3'></div>
      </div>
    </section>
  </div>
</template>
<script>
let echarts = require('echarts')
export default{
  name:'Data',
  data(){
    return{
      eachrtsList:[
      ],
      timeData:['08-01','08-02','08-03','08-04','08-05','08-06','08-07'],
      allNum:[120, 181, 501, 234, 290, 430, 240],
      hasNum:[10, 131, 101, 134, 90, 230, 210],
      lianNum:[1110, 50, 401, 100, 200, 200, 30]
    }
  },
  mounted () {
    //图标加载
    this.charts()
  },
  methods:{
    charts(){
      this.eachrtsList =[
        {
          totalTit:'总数',
          total:432,
          newAddTit:'上周新增',
          newAdd:123,
          data:[134,10, 52, 200, 47, 67, 45, 34]
        },
        {
          totalTit:'脸脸所有',
          total:432,
          newAddTit:'上周新增',
          newAdd:123,
          data:[820, 932, 901, 934, 1290, 1330, 1320]
        },
        {
          totalTit:'脸脸运营',
          total:432,
          newAddTit:'上周新增',
          newAdd:123,
          data0:[120, 132, 101, 134, 90, 230, 210],
          data1:[20, 182, 191, 234, 290, 330, 310]
        }
      ]
      this.$nextTick(() =>{
        this.myChart1 = echarts.init(document.getElementById('allData0'))
        this.myChart2 = echarts.init(document.getElementById('allData1'))
        this.myChart3 = echarts.init(document.getElementById('allData2'))
        this.myChart4 = echarts.init(document.getElementById('allData3'))
        var _this = this
        let series1 =[]
        let series2 = []
        for(let i=0;i<2;i++){
          let obj = {
            type:'line',
            smooth:true,
            symbolSize:5,
            name:'',
            itemStyle:{
              normal:{
                color:''
              }
            }
          }
          if(i === 0){
            obj.name = '总量屏'
            obj.itemStyle .normal.color = '#5B13AC'
            obj.data = this.eachrtsList[2].data0
          }else{
            obj.name = '脸脸屏'
            obj.itemStyle .normal.color = '#1B8AB6'
            obj.data = this.eachrtsList[2].data1
          }
          series1.push(obj)
        }
        for(let i=0;i<3;i++){
          let obj = {
            type:'line',
            smooth:true,
            symbolSize:5,
            name:'',
            itemStyle:{
              normal:{
                backgroundColor:''
              }
            },
            areaStyle: {normal: {}},
          }
          if(i === 0){
            obj.name = '总屏数'
            obj.data = [120, 150, 200, 250, 300, 330, 400]
          }else if(i === 1){
            obj.name = '脸脸所有'
            obj.data = [70, 80, 90, 130, 160, 180, 210]
          }else{
            obj.name = '脸脸运营数'
            obj.data = [50, 70, 110, 120, 140, 150, 190]
          }
          series2.push(obj)
        }
        this.option1 ={
          color: ['#21FFFF'],
          tooltip : {
            trigger: 'axis'
          },
          grid: {
            left: '0%',
            right: '1%',
            bottom: '5%',
            height:'100px',
            containLabel: true
          },
          xAxis : {
              type : 'category',
              data:_this.eachrtsList[0].data,
              show:false
            },
          yAxis : [
            {
              show:false,
              axisLine:{
                  show:false
              },
              type : 'value'
            }
          ],
          series : [
            {
              name:'上周新增',
              type:'bar',
              barWidth: '5%',
              data:_this.eachrtsList[0].data,
              smooth: true,
              symbolSize: 5
            }
          ]
        }
        this.option2 ={
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
              type: 'category',
              data: _this.eachrtsList[1].data,
              show:false
          },
          yAxis: {
            show:false,
            axisLine:{
                show:false
            },
            type : 'value'
          },
          series: [{
              name:'上周新增',
              type: 'line',
              smooth: true,
              symbolSize: 5,
              data: _this.eachrtsList[1].data,
              itemStyle:{
                normal:{
                  color:'#5B13AC'
                }
              },
          }]
        }
        this.option3 ={
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: _this.eachrtsList[2].data0,
            show:false
          },
          yAxis: {
            type: 'value',
            show:false,
            axisLine:{
              show:false
            },
          },
          series: series1
        }
        this.option4 ={
          color:['#492B98','#1B8AB6','#273FA5'],
          title: {
            text: '屏幕趋势（台）'
          },
          tooltip : {
              trigger: 'axis',
          },
          legend: {
            data:['总屏数','脸脸所有','脸脸运营数'],
            x: 'center',
            y: 'bottom',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : ['周一','周二','周三','周四','周五','周六','周日'],
              show:false
            }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series:series2
        }
        this.myChart1.setOption(this.option1)
        this.myChart2.setOption(this.option2)
        this.myChart3.setOption(this.option3)
        this.myChart4.setOption(this.option4)
      })
    },
  }
}
</script>
<style type="text/scss" lang="scss">
  .data{
    .boxData{
      display: flex;
      flex-direction: row;
      .boxList{
        flex: 1;
        margin-right: 10px;
        background-color: #222161;
        padding: 0 10px;
        .boxListHead{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          .boxHeadLeft{
            color: #fff;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .boxLeft{
              padding: 20px;
            }
          }
          .boxHeadRight{
            color: #21FFFF;
          }
          .boxLeftTit{
            padding-bottom: 20px;
          }
        }
        .allData{
          height: 100px;
        }
      }
    }
    .box1{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .ecahrtData{
        flex:1;
        height: 400px;
      }
    }
  }
</style>
