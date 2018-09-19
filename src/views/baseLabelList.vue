<template>
  <div class="labelList">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>标签列表</span>
        </div>
      </figure>
      <div class="box">
        <div class="matrialBtn">
          <el-button type="primary" @click="newLabel">新建标签</el-button>
        </div>
        <el-table :data="tableData" element-loading-text="拼命加载中" class="tableData">
          <el-table-column prop='name' align="center" label="标签名称"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新建 -->
      <el-dialog :title="title" :visible.sync="centerDialogVisible" :inline="true" :close-on-click-modal="false">
        <el-form>
          <el-form-item label="标签名称" v-if="!labelStatu" :required='true'>
              <el-input placeholder="请输入" style="width:60%;" v-model="tagName"></el-input>
            </el-form-item>
          <el-form-item label="标签类名称" v-if="labelStatu">{{groupName}}</el-form-item>
          <el-form-item label="标签" v-if="labelStatu">
            <el-tag v-for="item in tableData">{{item.name}}</el-tag>
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
    </section>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
  export default{
    name:'BaseLabelList',
    data(){
      return{
        load_data:true,
        centerDialogVisible:false,
        inputVisible:false,
        labelStatu:true,
        groupId:'',
        groupName:'',
        tagName:'',
        tagId:'',
        title:'',
        inputValue:'',
        dynamicTags:[],
        tableData:[]
      }
    },
    mounted () {
      this.load_data = true
      let sid = this.$route.query.sid
      if(sid === undefined){
        this.loadTagGroup(0)
      }else{
        this.loadTagGroup(sid)
      }
    },
    methods:{
      newLabel(){
        this.title = '新增标签'
        this.centerDialogVisible = true
        this.labelStatu = true
      },
      edit(scope){
        this.title = '编辑标签'
        this.tagName = scope.row.name
        this.tagId = scope.row.tagId
        this.centerDialogVisible = true
        this.labelStatu = false
      },
      handleClose(tag) {
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
      sava: lodash.debounce(function(){
        if(this.labelStatu){//添加标签
        this.load_data  =true
          for(let i in this.dynamicTags){
            let obj={}
            obj.groupId = this.groupId
            obj.name = this.dynamicTags[i]
            this.tagSaveTag(obj)
          } 
        }else{
          if(this.tagName === ''){
            this.$message({
              message: '请输入内容',
              type: 'warning'
            })
          }else{
            this.load_data  =true
            let obj = {}
            obj.groupId = this.groupId
            obj.name = this.tagName
            obj.tagId = this.tagId
            this.tagSaveTag(obj)
          }
        }
      },300),
      cancel(){
        this.dynamicTags = []
        this.tagName = ''
        this.tagId = ''
        this.centerDialogVisible = false
      },
      //查询标签组信息
      loadTagGroup(groupId){
        let self = this
        Api.loadTagGroup({groupId:groupId}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            self.groupId = data.object.groupId
            self.groupName = data.object.name
            self.tableData = data.object.tags
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
      //标签组新增标签和修改
      tagSaveTag(obj){
        let self = this
        Api.tagSaveTag(obj).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            self.loadTagGroup(self.groupId)
            self.centerDialogVisible = false
            if(self.title =='新增标签'){
              self.$message({
                message: '新增标签成功',
                type: 'success'
              })
            }else{
              self.$message({
                message: '编辑标签成功',
                type: 'success'
              })
            }
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
          self.dynamicTags = [] 
          self.tagName = ''
          self.tagId = ''
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
  .labelList{
    .matrialBtn{
      margin-bottom: 20px;
    }
    .el-table th{
      background-color: #F5F5F6;
    }
    .el-dialog{
      .button-new-tag {
        margin-left: 10px;
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
      .el-dialog__footer{
        padding-top: 20px;
        background-color: #F5F5F6;
        text-align: center;
      }
    }
  }
</style>
