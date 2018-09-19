<template>
  <div class="screen-list">
    <el-dialog :title="openScreen.screeName" :visible.sync="screenDialog" width="50%" :inline="true" :close-on-click-modal="false" :show-close="false">
      <div class="screentTitle">
        <span v-show="multipleSelectionAll.length !== 0 && openScreen.screenStyle !=='newOpen'">播放计划将复制到以下屏</span>
        <div class="screenHead">
          <div class="screenLeft">
            <el-tag v-for="item in multipleSelectionAll">{{item.screenName}}</el-tag>
          </div>
          <span v-if="multipleSelectionAll.length !== 0" @click="toggleSelection">清空</span>
        </div>
      </div>
        <el-form :inline="true" style="width:100%;" v-show="!daySelect" label-position="top" label-width='80px'>
          <el-form-item label="屏名称">
            <el-input placeholder="输入屏名称进行搜索" v-model="formData.screenName">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="门店名称" style="display:none;">
            <el-select v-model="formData.storeName" placeholder="请选择">
              <el-option-group v-for="group in storeList" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item style='margin-top:50px;'>
            <el-button type="primary" icon="el-icon-search"  @click="seachScreens">搜索</el-button>
          </el-form-item>
          <el-form-item style='margin-top:50px;'>
            <el-button type="primary"  @click="clearScreens">清空</el-button>
          </el-form-item>
          <el-table ref='multipleTable' :data="screenTab" style="width: 100%;margin-top:20px;" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55" :aria-checked="true"></el-table-column>
            <el-table-column align="center" prop="screenName" label="屏名称"></el-table-column>
            <el-table-column align="center" label="门店名称">
                <template slot-scope="scope">{{scope.row.useShopName}}</template>
            </el-table-column>
            <el-table-column align="center" prop="ratio" label="分辨率"></el-table-column>
          </el-table>
          <div class="pageAtion">
            <el-pagination :pageSize="page.pageRow" layout="total, prev, pager, next"
            :total="page.total" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.pageNo"></el-pagination>
          </div>
            
        </el-form>
        <el-form :inline="true" style="width:100%;" v-show="daySelect">
          <p>播放计划将在所选屏的一下时间选择播放</p>
          <el-form-item>
            <el-date-picker v-model="dayCopyStart" type="datetime" placeholder="开始时间"></el-date-picker>-
            <el-date-picker v-model="dayCopyEnd" type="datetime" placeholder="结束时间"></el-date-picker>
          </el-form-item>
        </el-form>
      <span slot="footer">
        <el-button type="primary" @click="chooseScreen" v-show="openScreen.screenStyle === 'newOpen'">选择</el-button>
        <el-button type="primary" @click="nextCopy" v-show="openScreen.screenStyle === 'copyDay' && !daySelect">下一步</el-button>
        <el-button type="primary" v-show="daySelect">复制</el-button>
        <el-button type="primary" v-show="daySelect" @click="prevCopy">上一步</el-button>
        <el-button type="primary" @click="chooseScreen" v-show="openScreen.screenStyle === 'copyWeek'">复制</el-button>
        <el-button @click="cancelChoose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
export default {
  name: "screenList",
  props: ["screenDialog", "addScreenList","openScreen",'saveScreenStyle','tabList'],
  data() {
    return {
      load_data:false,
      oldSelect:[],
      screenTab: [], // 表格数据
      multipleSelectionAll: [], //所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "screenId", // 标识列表数据中每一行的唯一键的名称
      daySelect:false,
      dayCopyStart:'',//日计划复制下一步的开始时间
      dayCopyEnd:'',//日计划复制下一步的结束时间
      page:{
        pageRow:0,
        pageNo:1,
        totalPageNo:0,
        total:0
      },
      formData: {
        screenName: "",
        storeName: ""
      },
      storeList: [
          {
            label: "全部门店",
            options: [
              {
                value: "全部门店",
                label: "全部门店"
              }
            ]
          },
          {
            label: "有屏门店",
            options: [
              {
                value: "西溪印象城",
                label: "西溪印象城"
              },
              {
                value: "古墩印象城",
                label: "古墩印象城"
              }
            ]
          },
          {
            label: "无屏门店",
            options: [
              {
                value: "龙首印象城",
                label: "龙首印象城"
              }
            ]
          }
        ]
    };
  },
  watch:{
      tabList(obj){
          this.getGoodsList(1);
          this.screenTab = obj.objects
          this.page.pageRow = obj.pageRow
          this.page.pageNo = obj.pageNo
          this.page.total = obj.total
          this.page.lastPage = obj.lastPage
          if(this.openScreen.saveScreenStyle){
            this.$refs.multipleTable.clearSelection();
            this.multipleSelectionAll = [];
            this.multipleSelection = [];
          }else{
            if (this.openScreen.screenStyle === "newOpen") {
              this.multipleSelectionAll = this.addScreenList
              this.oldSelect =  _.cloneDeep(this.addScreenList)
            }
          }
      }
  },
  methods: {
    pageChange(val) {
      //点击分页
      this.page.pageNo = val
      this.changePageCoreRecordData();
      this.screenFindPage(val)
    },
    //搜索
    seachScreens(){
      this.changePageCoreRecordData();
      this.page.pageNo = 1
      this.page.total = 0
      this.screenFindPage(1)
    },
    clearScreens(){
      for(let i in this.formData){
        this.formData[i] = ''
      }
      this.changePageCoreRecordData();
      this.page.pageNo = 1
      this.page.total = 0
      this.screenFindPage(1)
    },
    handleSelectionChange(val) {
      // table组件选中事件,记得加上@selection-change="handleSelectionChange"
      this.multipleSelection = val;
      setTimeout(() => {
        this.changePageCoreRecordData();
      }, 50);
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
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.multipleTable.clearSelection();
      for (var i = 0; i < this.screenTab.length; i++) {
        if (selectAllIds.indexOf(this.screenTab[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.multipleTable.toggleRowSelection(this.screenTab[i], true);
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
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
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.screenTab.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    //清空
    toggleSelection() {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
        this.multipleSelectionAll = [];
        this.multipleSelection = [];
      });
    },
    getGoodsList(val) {
      this.page.currentPage = val;
      setTimeout(() => {
        this.setSelectRow();
      }, 50);
    },
    chooseScreen: lodash.debounce(function () {
      this.load_data = false
      let arr =[]
      if (this.openScreen.screenStyle === "newOpen") {
        this.$emit("closeScreen", this.multipleSelectionAll, false);
      }else if(this.openScreen.screenStyle === "copyWeek"){
        this.$refs.multipleTable.clearSelection();
        this.multipleSelectionAll = [];
        this.multipleSelection = [];
         this.$emit("closeScreen", arr, false);
      }else{
        this.$refs.multipleTable.clearSelection();
        this.multipleSelectionAll = [];
        this.multipleSelection = [];
        this.$emit("closeScreen", arr, false);
      }
    },300),
    //下一步
    nextCopy(){
      this.daySelect = true
    },
    //上一步
    prevCopy(){
      this.daySelect = false
    },
    cancelChoose() {
      this.load_data = false
      let arr =[]
      if (this.openScreen.screenStyle === "newOpen") {
        // console.log(this.oldSelect)
        this.$emit("closeScreen",this.oldSelect,false);
      }else if(this.openScreen.screenStyle === "copyWeek"){
        this.$refs.multipleTable.clearSelection();
        this.multipleSelectionAll = [];
        this.multipleSelection = [];
         this.$emit("closeScreen", arr, false);
      }else{
        this.$refs.multipleTable.clearSelection();
        this.multipleSelectionAll = [];
        this.multipleSelection = [];
        this.$emit("closeScreen", arr, false);
      }
    },
    //查看屏列表
      screenFindPage(pageNo){
        let self = this
        Api.screenFindPage(
          {
            pageNo:pageNo,
            operationShopId:self.openScreen.operationShopId,
            screenName:self.formData.screenName
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.page.pageRow = data.object.pageRow
              self.page.pageNo = data.object.pageNo
              self.page.total = data.object.total
              self.page.lastPage = data.object.lastPage
              self.screenTab = data.object.objects
              setTimeout(() => {
                self.setSelectRow();
              }, 50);
            }else{
              self.page.pageNo = 1
              self.page.total = 0
              self.screenTab = []
              setTimeout(() => {
                self.setSelectRow();
              }, 50);
            }
          }else{
            self.load_data = false
            Swal({
              text:data.errorMessage,
              allowOutsideClick:false
            })
          }
        }).catch((error) =>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      }
  }
};
</script>
<style type="text/scss" lang="scss">
.screen-list {
  .screentTitle{
    background-color: #f5f5f6;
    margin-bottom: 10px;
    padding:10px;
    .screenHead {
      padding-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .screenLeft {
        width: 90%;
      }
    }
  }
  .pageAtion{
    padding: 20px 0 30px;
    background-color: #fff;
  }
}
</style>