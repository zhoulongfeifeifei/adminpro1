<template>
  <div class="baseConfig">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>基础标签设置</span>
        </div>
      </figure>
      <div class="box" v-loading="load_data" element-loading-text="拼命加载中">
        <div class="matrialBtn">
          <el-button type="primary" @click="newLabel">新建标签类</el-button>
        </div>
        <el-table :data="tableData" class="tableData">
          <el-table-column  prop="name" align="center" label="标签类名称"></el-table-column>
          <el-table-column align="center" prop="desc" label="标签类描述"></el-table-column>
          <el-table-column align="center" label="标签数">
            <template slot-scope="scope">
              <router-link :to="{ name: 'BaseLabelList', query: {sid: scope.row.groupId} }">
                <p style="color:#409EFF">{{scope.row.tagCount}}</p>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="tagRequiredCN" label="是否多选"></el-table-column>
          <el-table-column align="center" prop="tagOptionCN" label="是否必选"></el-table-column>
          <el-table-column align="center" prop="statusCN" label="状态"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="addLabel(scope)" :disabled="disabled = (scope.row.statusCN === '正常') ? false : true">新增标签</el-button>
              <router-link :to="{ name: 'BaseLabelList', query: {sid: scope.row.groupId} }">
                  <el-button type="text" :disabled="disabled = (scope.row.statusCN === '正常') ? false : true">查看标签</el-button>
              </router-link>
              <el-button type="text" @click="edit(scope)" :disabled="disabled = (scope.row.statusCN === '正常') ? false : true">编辑</el-button>
              <el-button type="text" v-if="scope.row.statusCN === '正常'" @click="normal(scope)">禁用</el-button>
              <el-button type="text" v-if="scope.row.statusCN === '已禁用'" @click="cancelDisable(scope)">取消禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :pageSize="page.pageRow" layout="total, prev, pager, next"
            :total="page.total" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.pageNo"></el-pagination>
      </div>
      <!-- 新建 -->
       <el-dialog :title="diaTitle" :visible.sync="centerDialogVisible" :inline="true" :close-on-click-modal="false">
          <el-form label-position="right" label-width="110px">
            <el-form-item label="标签类名称：" v-show="diaTitle === '新建标签类' || diaTitle === '编辑标签'" :required='true'>
              <el-input placeholder="请输入" style="width:80%;" v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="标签类名称：" v-show="diaTitle === '新增标签'">{{name}}</el-form-item>
            <el-form-item label="标签类描述：" v-show="diaTitle === '新建标签类' || diaTitle === '编辑标签'">
              <el-input placeholder="请输入内容" style="width:80%;" v-model="desc"></el-input>
            </el-form-item>
            <el-form-item label="是否必选：" v-show="diaTitle === '新建标签类' || diaTitle === '新增标签'">
              <el-radio-group v-model="tagRequired">
                <el-radio :label =1>是</el-radio>
                <el-radio :label =0>否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否多选：" v-show="diaTitle === '新建标签类' || diaTitle === '新增标签'">
              <el-radio-group v-model="tagOption">
                <el-radio :label =1>是</el-radio>
                <el-radio :label =0>否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="标签：" v-show="diaTitle === '新增标签'">
               <el-tag v-for="item in tabArr">{{item.name}}</el-tag>
              <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
              <el-input class="input-new-tag" v-if="inputVisible"
                v-model="inputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+新增</el-button>
            </el-form-item>
          </el-form>
          <span slot="footer">
              <el-button type="primary" @click="sava">保存</el-button>
              <el-button @click="cancel">取消</el-button>
            </span>
        </el-dialog>
        <!-- 禁用 -->
    </section>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
  export default{
    name:"BaseLabelConfig",
    data(){
      return{
        load_data:true,
        disabled:false,
        tabArr:[],
        centerDialogVisible:false,
        diaTitle:'',
        groupId:'',
         page:{
          pageRow:0,
          pageNo:1,
          totalPageNo:0,
          total:0
        },
        tabNumber:'',
        name:'',
        desc:'',
        tagRequired:0,
        tagOption:0,
        statusCN:'正常',
        inputVisible:false,
        inputValue:'',
        dynamicTags:[],
        tableData:[]
      }
    },
    mounted() {
      this.load_data = true
      this.findGroupList(1)
    },
    methods:{
      pageChange(val){
        this.load_data = true
        this.page.pageNo = val
        this.findGroupList(val)
      },
      newLabel(){
        this.centerDialogVisible = true
        this.diaTitle = '新建标签类'
      },
      addLabel(scope){
        this.load_data = true
        this.tabNumber = scope.$index
        let row = scope.row
        this.groupId = row.groupId
        this.name = row.name
        this.desc = row.desc
        if(row.tagOptionCN === '多选'){
          this.tagOption = 1
        }else{
          this.tagOption = 0
        }
        if(row.tagRequiredCN === '必选'){
          this.tagRequired = 1
        }else{
          this.tagRequired = 0
        }
        this.centerDialogVisible = true
        this.diaTitle = '新增标签'
        this.loadTagGroup(row.groupId)
      },
      edit(scope){
        this.tabNumber = scope.$index
        let row = scope.row
        this.groupId = row.groupId
        this.name = row.name
        this.desc = row.desc
        if(row.tagOptionCN === '多选'){
          this.tagOption = 1
        }else{
          this.tagOption = 0
        }
        if(row.tagRequiredCN === '必选'){
          this.tagRequired = 1
        }else{
          this.tagRequired = 0
        }
        this.centerDialogVisible = true
        this.diaTitle = '编辑标签'
      },
      normal(scope){
        this.tabNumber = scope.$index
        this.$confirm('禁用后该标签将无法使用，是否禁用？','提示',{
          confirmButtonText: '禁用',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.load_data = true
          this.disableGroup(scope.row.groupId)
        }).catch(() =>{
        })
      },
      cancelDisable(scope){
        this.tabNumber = scope.$index
        this.$confirm('取消禁用后该标签可正常使用，是否取消？','提示',{
          confirmButtonText: '取消禁止',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.load_data = true
          this.enableGroup(scope.row.groupId)
        }).catch(() =>{
        })
      },
      handleClose(tag) {
        console.log(tag)
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      sava:lodash.debounce(function(){
        if(this.diaTitle === '新建标签类'){ //新建
          if(this.name === ''){
            this.$message({
              message: '请输入标签类名称',
              type: 'warning'
            })
          }else{
              let obj ={}
              obj.name = this.name
              obj.desc = this.desc
              obj.tagRequired = this.tagRequired
              obj.tagOption = this.tagOption
              this.saveGroup(obj)
            }
        }else if(this.diaTitle === '新增标签'){
          if(this.tabNumber !==''){
            for(let i in this.dynamicTags){
              let obj = {}
              obj.groupId = this.groupId
              obj.tagId = ''
              obj.name = this.dynamicTags[i]
              this.tagSaveTag(obj)
            }
          }
          this.centerDialogVisible = false
        }else if(this.diaTitle === '编辑标签'){ //编辑
          if(this.tabNumber !==''){
            if(this.name === ''){
              this.$message({
                message: '请输入标签类名称',
                type: 'warning'
              })
            }else{
              let obj ={}
              obj.groupId = this.groupId
              obj.name = this.name
              obj.desc = this.desc
              obj.tagRequired = this.tagRequired
              obj.tagOption = this.tagOption
              this.saveGroup(obj)
            }
          }
        }
      },300),
      cancel(){
        this.dynamicTags = []
        this.tabArr=[]
        this.tabNumber = ''
        this.name = ''
        this.desc = ''
        this.tagRequired = 0
        this.tagOption = 0
        this.centerDialogVisible = false
      },
      //编辑素材标签类
      saveTag(name){
        let self = data
        Api.saveTag({name:name}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            self.tableData[self.tabNumber].name = self.name
            self.tableData[self.tabNumber].desc = self.desc
            self.centerDialogVisible = false
          }else{
            self.load_data =false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
        }).catch((error) =>{
           self.load_data =false
            Swal({
              text:'请求服务器失败',
              allowOutsideClick:false
            })
        })
      },
      //保存标签组和编辑标签组
      saveGroup(obj){
        let self = this
        Api.saveGroup(obj).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            self.centerDialogVisible = false
            if(self.diaTitle === '新建标签类'){
              self.findGroupList(1)
              self.$message({
                message: '新建标签类成功',
                type: 'success'
              })
            }else{
              self.$message({
                message: '编辑标签成功',
                type: 'success'
              })
              self.tableData[self.tabNumber].name = self.name
              self.tableData[self.tabNumber].desc = self.desc
            }
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
          self.groupId = ''
          self.tabArr=[]
          self.name = ''
          self.desc = ''
          self.dynamicTags = []
          self.tagRequired = 0
          self.tagOption = 0
        }).catch((error) =>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //保存标签
      tagSaveTag(obj){
        let self = this
        Api.tagSaveTag(obj).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            self.centerDialogVisible = false
            self.findGroupList(1)
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
          self.groupId = ''
          self.tabArr=[]
          self.name = ''
          self.desc = ''
          self.dynamicTags = []
          self.tagRequired = 0
          self.tagOption = 0
        }).catch((error) =>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //禁用标签组信息
      disableGroup(groupId){
        let self = this
        Api.disableGroup({groupId:groupId}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(self.tabNumber !== ''){
            self.tableData[self.tabNumber].statusCN = '已禁用'
          }
          self.tabNumber = ''
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
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
      },
      //取消禁用标签组信息
      enableGroup(groupId){
        let self = this
        Api.enableGroup({groupId:groupId}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(self.tabNumber !== ''){
              self.tableData[self.tabNumber].statusCN = '正常'
            }
          self.tabNumber = ''
          self.tabNumber = ''
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
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
      },
      //查询标签类组列表分页
      findGroupList(pageNo){
        let self = this
        Api.findGroupList({pageNo:pageNo}).then((res) =>{
          let data  =res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.page.pageRow = data.object.pageRow
              self.page.pageNo = data.object.pageNo
              self.page.total = data.object.total
              self.page.lastPage = data.object.lastPage
              self.tableData = data.object.objects
            }
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
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
      },
      //查询标签组信息
      loadTagGroup(groupId){
        let self = this
        Api.loadTagGroup({groupId:groupId}).then((res) =>{
          let data =res.data
          if(data.status === 0){
            self.load_data = false
            self.tabArr = data.object.tags
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
  }
</script>
<style type="text/scss" lang="scss">
  .baseConfig{
    .matrialBtn{
      margin-bottom: 20px;
    }
    .tableData{
      .tableSpan{
        display: inline-block;
        padding:0 5px;
      }
    }
    .el-dialog{
      .el-dialog__body {
        text-align: initial;
        padding: 10px 20px;
      }
      .button-new-tag {
        margin-left: 5px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }
    }
  }
</style>
