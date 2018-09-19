<template>
  <div class="test">
    <section class="con">
    <div class="box">
      <el-tag v-for="item in multipleSelectionAll">
            {{item.name}}
          </el-tag>
       <!-- 数据显示 -->
      <el-table :data="tableData3" ref="multipleTable" stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="barcode" label="商品编码"></el-table-column>
        <el-table-column prop="quantity" label="区域总库存"></el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="page.currentPage" :page-size="page.pnum" layout="total, prev, pager, next , jumper" :total="page.pageTotal"></el-pagination>
    </div>
    <el-select v-model="value7" placeholder="请选择">
        <el-option-group
          v-for="group in options3"
          :key="group.label"
          :label="group.label">
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-option-group>
      </el-select>
    </section>
  </div>
</template>
<script>
  export default{
    name:'Test',
    data(){
      return{
        tableData3: [], // 表格数据 
        multipleSelectionAll:[],//所有选中的数据包含跨页数据
        multipleSelection:[],// 当前页选中的数据
        idKey: 'id', // 标识列表数据中每一行的唯一键的名称
        page:{
            //每页数据量
            pnum:2,
            //数据总数
            pageTotal:3,
            //当前页，从1开始
            currentPage:1,
        },
        tab4:[{
          id:'0',
          date: '2016-05-03',
          name: '王小',
          address: '上海市普陀区金沙江路 118 弄'
          }, {
            id:'1',
            date: '2016-05-06',
            name: '王虎',
            address: '上海市普陀区金沙江路 151 弄'
          }
        ],
        tableData5:[
          {
            id: '2',
            date: '2016-05-03',
            name: '王小二',
            address: '上海市普陀区金沙江路 151 弄'
          },{
            id: '3',
            date: '2016-05-05',
            name: '王小二55',
            address: '上海市普陀区金沙江路 151 弄'
          }
        ],
        tab6:[
          {
          id:'0',
          date: '2016-05-03',
          name: '王小',
          address: '上海市普陀区金沙江路 118 弄'
          },
          {
            id: '2',
            date: '2016-05-03',
            name: '王小二',
            address: '上海市普陀区金沙江路 151 弄'
          }
        ],
        options3: [{
          label: '热门城市',
          options: [{
            value: 'Shanghai',
            label: '上海'
          }, {
            value: 'Beijing',
            label: '北京'
          }]
        }, {
          label: '城市名',
          options: [{
            value: 'Chengdu',
            label: '成都'
          }, {
            value: 'Shenzhen',
            label: '深圳'
          }, {
            value: 'Guangzhou',
            label: '广州'
          }, {
            value: 'Dalian',
            label: '大连'
          }]
        }],
        value7: ''
      }
    },
    created() {
      this.multipleSelectionAll = this.tab6
      this.getGoodsList()
    },
    methods:{
      handleCurrentChange(val){
          this.changePageCoreRecordData();
          this.getGoodsList(val);
      },
       handleSelectionChange (val) {
          // table组件选中事件,记得加上@selection-change="handleSelectionChange"
          this.multipleSelection = val;
           setTimeout(()=>{
              this.changePageCoreRecordData();
          }, 50)
      },
      // 设置选中的方法
      setSelectRow() {
          if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
              return;
          }
          // 标识当前行的唯一键的名称
          let idKey = this.idKey;
          let selectAllIds = [];
          let that = this;
          this.multipleSelectionAll.forEach(row=>{
              selectAllIds.push(row[idKey]);
          })
          this.$refs.multipleTable.clearSelection();
          for(var i = 0; i < this.tableData3.length; i++) {
              if (selectAllIds.indexOf(this.tableData3[i][idKey]) >= 0) {
                  // 设置选中，记住table组件需要使用ref="table"
                  this.$refs.multipleTable.toggleRowSelection(this.tableData3[i], true);
              }
          }
      } ,
      // 记忆选择核心方法
      changePageCoreRecordData () {
          // 标识当前行的唯一键的名称
          let idKey = this.idKey;
          let that = this;
          // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
          if (this.multipleSelectionAll.length <= 0) {
              this.multipleSelectionAll = this.multipleSelection;
              return;
          }
          // 总选择里面的key集合
          let selectAllIds = [];
          this.multipleSelectionAll.forEach(row=>{
              selectAllIds.push(row[idKey]);
          })
          let selectIds = []
          // 获取当前页选中的id
          this.multipleSelection.forEach(row=>{
              selectIds.push(row[idKey]);
              // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
              if (selectAllIds.indexOf(row[idKey]) < 0) {
                  that.multipleSelectionAll.push(row);
              }
          })
          let noSelectIds = [];
          // 得到当前页没有选中的id
          this.tableData3.forEach(row=>{
              if (selectIds.indexOf(row[idKey]) < 0) {
                  noSelectIds.push(row[idKey]);
              }
          })
          noSelectIds.forEach(id=>{
              if (selectAllIds.indexOf(id) >= 0) {
                  for(let i = 0; i< that.multipleSelectionAll.length; i ++) {
                      if (that.multipleSelectionAll[i][idKey] == id) {
                          // 如果总选择中有未被选中的，那么就删除这条
                          that.multipleSelectionAll.splice(i, 1);
                          break;
                      }
                  }
              }
          })
      },
      getGoodsList(val){
        this.page.currentPage = val
        if(val === 2){
            this.tableData3 = this.tableData5
          }else{
            this.tableData3 = this.tab4
          }
        setTimeout(()=>{
            this.setSelectRow();
        }, 50)
      }
    }
  }
</script>