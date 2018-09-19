<template>
  <section class="con">
    <figure>
      <figcaption>版本：{{pData.versionNo}} 查看权限</figcaption>
      <div class="crumbs">
        <span>商家管理</span>
        <a href="/authVersionList">权限版本管理</a>
        <a>版本：{{pData.versionNo}} 查看权限</a>
      </div>
      <a href="/authVersionList" class="btn5  btn5-change"><i class="fa fa-reply"></i> 返回</a>
    </figure>
    <div class="box">
      <form>
        <div class="l form-group mb15">
          <label>业态：</label>
          <select class="w140" v-model="search.businessTypeId">
            <option v-for="d in data.businessType" :value="d.sid" :key="d.$index">{{ d.name }}</option>
          </select>
        </div>

        <div class="l form-group mb15">
          <label>等级：</label>
          <select class="w140" v-model="search.memberLevelId">
            <option v-for="d in data.memberLevel" :value="d.sid" :key="d.$index">{{ d.name }}</option>
          </select>
        </div>

        <div class="l form-group mb15">
          <label>地点：</label>
          <select class="w140" v-model="search.shopTypeId">
            <option v-for="d in data.shopType" :value="d.sid" :key="d.$index">{{ d.name }}</option>
          </select>
        </div>

        <div class="l form-group mb15">
          <label>角色：</label>
          <select class="w140" v-model="search.roleIdList">
            <option value="">超级管理员</option>
            <option v-for="d in data.role" :value="d.sid" :key="d.$index">{{ d.name }}</option>
          </select>
        </div>

        <div class="form-group text-center">
          <button type="button" class="btn l w85 mr15" @click="Search"><i class="fa fa-search"></i>查询</button>
          <button type="button" class="btn2 l w85" @click="Reset">重置</button>
        </div>
      </form>
    </div>
    <div class="box">
      <div class="scrollY h520">
        <div class="w45p l ml5p">
          <el-tabs v-model="pData.activeTab" type="card">
            <el-tab-pane label="手机权限" name="firstTab"></el-tab-pane>
          </el-tabs>
          <div class="relative">
            <div class="absolute w100p h100p zIndex99"></div>
            <el-tree show-checkbox default-expand-all  :auto-expand-parent="true" node-key="sid"
              :data="dataList1" :default-checked-keys="pData.checked1" :props="defaultProps">
            </el-tree>
          </div>
        </div>

        <div class="w45p l ml5p">
          <el-tabs v-model="pData.activeTab" type="card">
            <el-tab-pane label="PC权限" name="firstTab"></el-tab-pane>
          </el-tabs>
          <div class="relative">
            <div class="absolute w100p h100p zIndex99"></div>
            <el-tree show-checkbox default-expand-all  :auto-expand-parent="true" node-key="sid"
              :data="dataList2" :default-checked-keys="pData.checked2" :props="defaultProps">
            </el-tree>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Page from "@/components/page"
import * as Api from "@/api/api"

const Swal=require("sweetalert2")

export default{
  name:"UseShopList",
  data(){
    return{
      pData:{versionId:this.$route.query.versionId, versionNo:this.$route.query.versionNo, checked1:[], checked2:[], activeTab:"firstTab"},
      search:{pageNo:1, pageRow:20, businessTypeId:2, shopTypeId:0, memberLevelId:0, roleIdList:""},
      data:{businessType:null, shopType:null, memberLevel:null, role:null},
      defaultProps:{label:"name", children:"childs"},
      dataList1:[],
      dataList2:[]
    }
  },
  components:{
    "page":Page
  },
  mounted(){
    let self=this;
    Api.Business().then(function(sj) {self.data.businessType=sj.data.object});                   // 获取业态
    Api.Address().then(function(sj) {self.data.shopType=sj.data.object;});                       // 获取地点属性
    Api.MemberLevel().then(function(sj) {self.data.memberLevel=sj.data.object;});                // 获取商家等级
    Api.Role().then(function(sj) {self.data.role=sj.data.object;});                              // 获取角色等级
    self.Initial();
  },
  methods:{
    Search(){this.search.pageNo=1; this.Initial()},                                              // 查询
    Change(val){this.search.pageNo=val; this.Initial();},                                        // 翻页
    Reset(){                                                                                     // 清空查询
      this.search.pageNo=1;
      this.search.businessTypeId=2;
      this.search.shopTypeId=0;
      this.search.memberLevelId=0;
      this.search.roleIdList="";
      this.Initial();
    },
    Initial(){                                                                                   // 初始化
      let self=this
      self.dataList1=[];
      self.dataList2=[];
      self.pData.checked1=[];
      self.pData.checked2=[];

      Api.ShopAllAuth({
        kind:0
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          self.CheckAuth(sj.object, "手机端", 0);
        }else{
          Swal({title:"商家所有权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家所有权限列表请求服务器失败", "", "error")
      })

      Api.ShopAllAuth({
        kind:1
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          self.CheckAuth(sj.object, "PC端", 1);
        }else{
          Swal({title:"商家所有权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家所有权限列表请求服务器失败", "", "error")
      })
    },
    CheckAuth(object, name, index){
      let self=this;
      Api.CheckAuth(
        {
          versionId:self.pData.versionId,
          businessTypeId:self.search.businessTypeId,
          shopTypeId:self.search.shopTypeId,
          memberLevelId:self.search.memberLevelId,
          roleIdList:self.search.roleIdList,
          clientType:index
        }
      ).then(function(sj) {
        sj=PF.JsonFormat(sj.data)
        if(sj.status==0){
          if(sj.object&&sj.object.length!=0){
            for(var i=0;i<sj.object.length;i++){
              self.Arr(sj.object[i], name);
            }
          }
          if(name=="手机端"){
            self.dataList1=object;
          }else if(name=="PC端"){
            self.dataList2=object;
          }
        }else{
          Swal({title:"权限树服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("权限树请求服务器失败", "", "error")
      });
    },
    Arr(object, name){
      let self=this, i=0;
      for(; i<object.childs.length; i++){
        if(object.childs[i].childs!=""){
          self.Arr(object.childs[i], name);
        }else{
          if(name=="手机端"){
            self.pData.checked1.push(object.childs[i].sid);
          }else if(name=="PC端"){
            self.pData.checked2.push(object.childs[i].sid);
          }
        }
      }
    }
  }
}
</script>
