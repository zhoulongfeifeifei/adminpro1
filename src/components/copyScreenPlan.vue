<template>
  <div class="screen-list">
    <el-dialog title="屏名称" :visible.sync="copyScreenDialog" width="50%" :inline="true" :close-on-click-modal="false" :show-close="false">
      <div>播放计划将放到喜爱屏</div>
      <div class="screenHead">
        <div class="screenLeft">
          <el-tag v-for="item in multipleSelectionAll">{{item.screenName}}({{item.screenAddress}})</el-tag>
        </div>
        <span v-if="multipleSelectionAll.length !== 0" @click="toggleSelection()">清空</span>
      </div>  
        <el-form :inline="true" style="width:100%;">
          <el-form-item label="素材标题">
            <el-input placeholder="输入屏名称进行搜索" v-model="formData.screenName">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="门店名称">
            <el-select v-model="formData.storeName" placeholder="请选择">
              <el-option-group v-for="group in formData.storeList" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-table ref='multipleTable' :data="screenTab" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :aria-checked="true"></el-table-column>
            <el-table-column prop="screenName" label="屏名称"></el-table-column>
            <el-table-column label="门店名称">
                <template slot-scope="scope">{{scope.row.storeName}}({{scope.row.screenAddress}})</template>
            </el-table-column>
            <el-table-column prop="screenResolution" label="分辨率"></el-table-column>
          </el-table>
          <el-pagination :pageSize="page.pNum" layout="total, prev, pager, next"
            :total="page.pageTotal" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.currentPage"></el-pagination>
        </el-form>
      <span slot="footer">
        <el-button type="primary" @click="chooseScreen">选择</el-button>
        <el-button @click="cancelChoose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    name:'screenList',
    props:['copyScreenDialog'],
    data(){
      return{
        screenTab: [], // 表格数据
        multipleSelectionAll:[],//所有选中的数据包含跨页数据
        multipleSelection:[],// 当前页选中的数据
        idKey: 'id', // 标识列表数据中每一行的唯一键的名称
        page:{
          pNum:2,//每页数据量
          pageTotal:3,//数据总数
          currentPage:1,//当前页，从1开始
        },
        screenTab1:[
          {
            id:1,
            screenName:'中庭大屏',
            storeName:'一点点',
            screenAddress:'万达广场',
            screenResolution:'1920*1080'
          },
          {
            id:2,
            screenName:'左侧大屏',
            storeName:'两点点',
            screenAddress:'绿城广场',
            screenResolution:'1920*1080'
          }
        ],
        screenTab2:[
          {
            id:3,
            screenName:'top侧大屏',
            storeName:'三点点',
            screenAddress:'绿城广场',
            screenResolution:'1920*1080'
          }
        ],
        formData:{
          screenName:'',
          storeName:'',
          storeList:[
            {
              label: '全部门店',
              options:[
                {
                  value: '全部门店',
                  label: '全部门店'
                }
              ]
            },
            {
              label: '有屏门店',
              options:[
                {
                  value: '西溪印象城',
                  label: '西溪印象城'
                },
                {
                  value: '古墩印象城',
                  label: '古墩印象城'
                }
              ]
            },
            {
              label: '无屏门店',
              options:[
                {
                  value: '龙首印象城',
                  label: '龙首印象城'
                }
              ]
            }
          ]
        }
      }
    },
    created() {
      this.multipleSelectionAll = this.addScreenList
      this.getGoodsList(1)
    },
    methods:{
      pageChange(val){//点击分页
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
        for(var i = 0; i < this.screenTab.length; i++) {
            if (selectAllIds.indexOf(this.screenTab[i][idKey]) >= 0) {
                // 设置选中，记住table组件需要使用ref="table"
                this.$refs.multipleTable.toggleRowSelection(this.screenTab[i], true);
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
          this.screenTab.forEach(row=>{
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
      //清空
      toggleSelection(){
        this.$nextTick(()=>{
          this.$refs.multipleTable.clearSelection()
          this.multipleSelectionAll = []
          this.multipleSelection = []
        })
      },
      getGoodsList(val){
        console.log(val)
        this.page.currentPage = val
        if(val === 2){
            this.screenTab = this.screenTab2
          }else{
            this.screenTab = this.screenTab1
          }
          setTimeout(()=>{
            this.setSelectRow();
        }, 50)
      },
      chooseScreen(){
        this.$emit('closeScreen',this.multipleSelectionAll,false)
      },
      cancelChoose(){
        this.$emit('closeScreen',this.multipleSelectionAll,false)
      },
    }
  }
</script>
<style type="text/scss" lang="scss">
.screen-list{
  .screenHead{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .screenLeft{
      width: 90%;
    }
  }
  .el-dialog__footer{
    padding-top: 20px;
    background-color: #F5F5F6;
    text-align: center;
  }
}
</style>