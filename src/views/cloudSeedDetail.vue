<template>
  <div class="cloudDetail">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>详情</span>
        </div>
      </figure>
      <div class="box" v-loading="load_data" element-loading-text="拼命加载中">
        <ul class="ulList">
          <li>商户名称：<span class="liSpan">{{shopName}}</span></li>
          <li>商户ID：<span class="liSpan">{{shopId}}</span></li>
          <li>地址：<span class="liSpan">{{location}}{{address}}</span></li>
          <li>商户负责人：
            <span class="liSpan">{{wallahName}} </span>
            <span v-if="wallahPhone !=''">({{wallahPhone}})</span>
            <el-button type="text" @click="edit">编辑</el-button>
          </li>
        </ul>
        <!-- 模态框 -->
        <el-dialog title="更改商户负责人" :visible.sync="centerDialogVisible" :show-close="false" :close-on-click-modal="false">
          <el-form>
            <el-form-item label="负责人姓名">
              <el-input placeholder="请输入内容" style="width:70%;" v-model="headName"></el-input>
            </el-form-item>
            <el-form-item label="负责人电话">
              <el-input type="number" placeholder="请输入内容" style="width:70%;" v-model="headTal" value='' oninput="if(value.length>11)value=value.slice(0,11)"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
              <el-button type="primary" @click="update">立即更改</el-button>
              <el-button @click="cancel">取消</el-button>
            </span>
        </el-dialog>
      </div>
    </section>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
  export default{
    name:'cloudSeedDetail', 
    data(){
      return{
        load_data:true,
        centerDialogVisible:false,
        shopName:'',
        shopId:'',
        location:'',
        address:'',
        wallahName:'',
        wallahPhone:'',
        headName:'',
        headTal:''
      }
    },
    mounted() {
      let shopId = this.$route.query.shopId
        this.shopId = shopId
        this.shopFindList(1)
    },
    methods:{
      edit(){
        this.centerDialogVisible = true
        this.headName = this.wallahName
        this.headTal = this.wallahPhone
      },
      update: lodash.debounce(function(){
        if(this.headName === ''){
          this.$message({
            message: '请输入内容',
            type: 'warning'
          })
        }else if(this.headTal.length !== 11){
          this.$message({
            message: '手机号格式不正确',
            type: 'warning'
          })
        }else{
          this.updateWallah()
        }
      },300),
      cancel(){
        this.centerDialogVisible = false
        this.headName=''
        this.headTal=''
      },
      //商家分页
      shopFindList(pageNo){
        let self = this
        Api.shopFindList(
          {
            pageNo:pageNo,
            shopId:self.shopId,
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              let arr = data.object.objects[0]
              self.shopName=arr.shopName
              self.shopId=arr.shopId
              self.location=arr.location
              self.address=arr.address
              self.wallahName=arr.wallahName
              self.wallahPhone=arr.wallahPhone
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
      //修改商家负责人
      updateWallah(){
        let self = this
        Api.updateWallah(
          {
            shopId:self.shopId,
            wallahName:self.headName,
            wallahPhone:self.headTal
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.$message({
              message: '修改商家负责人成功',
              type: 'success'
             })
            self.load_data = false
            self.centerDialogVisible = false
            self.shopFindList(1)
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
          self.headName=''
          self.headTal=''
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
.cloudDetail{
  .ulList{
    li{
      padding: 10px 0;
      .liSpan{
        color: #333;
      }
    }
  }
  .el-dialog{
    .el-dialog__footer{
      padding-top: 20px;
      background-color: #F5F5F6;
      text-align: center;
    }
  }
}
</style>
