<template>
  <section class="con">
    <figure>
      <figcaption>菜单管理<span class="ft14 gray2">（目前只支持创建三级菜单）</span></figcaption>
      <!-- <div class="crumbs">
        <span>商家管理</span>
        <a>菜单管理</a>
      </div> -->
    </figure>
    <div class="box">
      <el-tabs v-model="pData.activeTab" type="card" @tab-click="handleClick">
        <el-tab-pane label="手机权限" name="firstTab"></el-tab-pane>
        <el-tab-pane label="PC权限" name="secondTab"></el-tab-pane>
      </el-tabs>

      <div class="w35p l">
        <div class="box4">
          <header>
            <button type="button" class="btn mr10" @click="AddMenu('sibling')">新增同级菜单</button>
            <button type="button" class="btn mr10" @click="AddMenu('child')">新增子级菜单</button>
            <button type="button" class="btn" @click="Del">删除</button>
          </header>
          <div class="box4con style">
            <el-tree default-expand-all :expand-on-click-node="false"  :auto-expand-parent="true" node-key="sid"
              :data="data" :props="defaultProps" @node-click="NodeClick">
            </el-tree>
          </div>
        </div>
      </div>

      <div class="w62p l ml3p">
        <div class="box4">
          <header>
            <button type="button" class="btn mr10" @click="Close" v-show="pData.edit==true">取消</button>
            <button type="button" class="btn mr10" @click="Submit" v-show="pData.edit==true">保存</button>
            <button type="button" class="btn" @click="Edit" v-show="pData.edit==false">编辑</button>
          </header>
          <div class="box4con2">
            <div class="form-group mb10" v-show="!pData.kind">
              <label class="w100">菜单ID：</label>
              <span>
                <input type="text" id="sid" value="" oninput="PF.Integer(this)" disabled/>
              </span>
            </div>

            <div class="form-group mb10">
              <label class="w100">菜单名称：</label>
              <span>
                <input type="text" id="name" value="" onfocus="PF.CutString(this,32)" :disabled="!pData.edit"/>
                <em class="notice"><i v-show="error.nameError">{{error.nameError}}</i></em>
              </span>
            </div>

            <div class="form-group mb10">
              <label class="w100">前端路由：</label>
              <span>
                <input type="text" id="route" value="" oninput="PF.English(this)" :disabled="!pData.edit"/>
                <em class="notice"><i v-show="error.routeError">{{error.routeError}}</i></em>
              </span>
            </div>

            <div class="form-group mb10">
              <label class="w100">URL：</label>
              <span>
                <input type="text" id="url" v-model="edit.url" :disabled="!pData.edit"/>
                <em class="notice"><i v-show="error.urlError">{{error.urlError}}</i></em>
              </span>
            </div>

            <div class="form-group mb10">
              <label class="w100">菜单描述：</label>
              <span>
                <textarea class="w300" id="description" onfocus="PF.CutString(this,200)" :disabled="!pData.edit"></textarea>
              </span>
              <div class="ml115">
                <em class="notice">限200个字符或100个汉字<br/><i class="ml20" v-show="error.descriptionError">{{error.descriptionError}}</i></em>
              </div>
            </div>

            <div class="form-group mb10">
              <label class="w100">菜单ICON：</label>
              <span>
                <input type="text" id="icon" value="" oninput="PF.English(this)" :disabled="!pData.edit"/>
              </span>
            </div>

            <div class="form-group mb10">
              <label class="w100">是否外链：</label>
              <span>
                <label class="mr20 mt0"><input type="radio" value="1" class="fnone mr20" name="isOutsideLink" v-model="edit.isOutsideLink" :disabled="!pData.edit"/>是</label>
                <label class="mt0"><input type="radio" value="0" class="fnone mr20" name="isOutsideLink" v-model="edit.isOutsideLink" :disabled="!pData.edit"/>否</label>
              </span>
            </div>

            <div class="form-group mb10">
              <label class="w100">是否控制菜单：</label>
              <span>
                <label class="mr20 mt0"><input type="radio" value="1" class="fnone mr20" name="menuStatus" v-model="edit.menuStatus" :disabled="!pData.edit"/>是</label>
                <label class="mt0"><input type="radio" value="0" class="fnone mr20" name="menuStatus" v-model="edit.menuStatus" :disabled="!pData.edit"/>否</label>
              </span>
            </div>

            <div class="form-group mb10">
              <label class="w100">菜单是否有展开项：</label>
              <span>
                <label class="mr20 mt0"><input type="radio" value="1" class="fnone mr20" name="menuOpen" v-model="edit.menuOpen" :disabled="!pData.edit"/>是</label>
                <label class="mt0"><input type="radio" value="0" class="fnone mr20" name="menuOpen" v-model="edit.menuOpen" :disabled="!pData.edit"/>否</label>
              </span>
            </div>

            <div class="form-group mb10 none">
              <label class="w100">父节点名称：</label>
              <span>
                <input type="text" id="parentNodeName" value="" onfocus="PF.CutString(this, 14)" disabled />
              </span>
            </div>

            <div class="form-group mb10 none">
              <label class="w100">上级菜单名称：</label>
              <span>
                <input type="text" id="parentName" value="" onfocus="PF.CutString(this, 14)" disabled />
              </span>
            </div>

            <div class="form-group mb10">
              <label class="w100">上级菜单ID：</label>
              <span>
                <input type="text" id="parentSid" value="" onfocus="PF.Integer(this)" disabled />
              </span>
            </div>

            <div class="form-group mb10">
              <label class="w100" id="childs">子URL权限：</label>
              <div class="l mw450">
                <span v-for="(d, index) in edit.permissionUrlPoList" :key="d.$index" v-show="edit.permissionUrlPoList!=''">
                  <input type="text" class="w110" placeholder="名称" v-model="d.description" :disabled="!pData.edit" />
                  <input type="text" class="w190" placeholder="URL地址" v-model="d.url" :disabled="!pData.edit" />
                  <a class="mt6 inline-block pointer blue" @click="DelChildMenu(index)">删除</a>
                  <div class="mb10">
                    <em class="notice"><i class="ml0" v-show="error.childsError[index]">{{error.childsError[index]}}</i></em>
                  </div>
                </span>
                <div class="clear"></div>
                <button type="button" class="btn w110" @click="AddChildMenu()" :disabled="!pData.edit">添加url</button>
              </div>
            </div>
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
      pData:{activeTab:"firstTab", edit:false, kind:"", clientType:0},
      data:[],
      defaultProps:{label:"name", children:"childs"},
      error:{nameError:"", routeError:"", urlError:"", descriptionError:"", childsError:[]},
      edit:{},
      copy:{}
    }
  },
  components:{
    "page":Page
  },
  mounted(){
    let self=this;
    self.Initial(true);
  },
  methods:{
    handleClick(tab, event){                                  // 选项卡
      let self=this;
      switch(this.pData.activeTab){
        case "firstTab": self.pData.clientType=0; break
        case "secondTab": self.pData.clientType=1; break
      };

      self.Initial(true);
    },
    NodeClick(data, node, obj){
      this.AuthInfo(data.sid);
    },
    ClearError(){

      this.error={nameError:"", routeError:"", urlError:"", descriptionError:"", childsError:[]};
    },
    Initial(boolean){                                                // 初始化
      let self=this;
      self.data=[];

      Api.ShopAllAuth({
        kind:self.pData.clientType
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          self.data=sj.object;
          if(boolean){
            self.AuthInfo(sj.object[0].childs!="" ? sj.object[0].childs[0].sid:sj.object[0].sid);  
          }
          setTimeout(function(){
            for(let i=0; i<document.querySelectorAll(".el-tree-node__label").length; i++){
              
              document.querySelectorAll(".el-tree-node__label")[i].onclick=function() {
                for(let i=0; i<document.querySelectorAll(".el-tree-node__label").length; i++){
                  document.querySelectorAll(".el-tree-node__label")[i].parentElement.className="el-tree-node__content";
                }
                this.parentElement.className+=" bg-blue";
              }

              document.querySelectorAll(".el-tree-node__content")[i].onclick=function() {
                for(let i=0; i<document.querySelectorAll(".el-tree-node__content").length; i++){
                  document.querySelectorAll(".el-tree-node__content")[i].className="el-tree-node__content";
                }
                this.className+=" bg-blue";
              }
            }
          },500);
        }else{
          Swal({title:"商家所有权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家所有权限列表请求服务器失败", "", "error")
      });
    },
    AuthInfo(sid){
      let self=this;
      Api.AuthInfo({
        sid:sid
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          self.pData.kind="";
          self.pData.edit=false;
          self.edit=Object.assign({}, sj.object);
          document.querySelector("#sid").value=sj.object.sid;
          document.querySelector("#name").value=sj.object.name;
          document.querySelector("#route").value=sj.object.route;
          document.querySelector("#description").value=sj.object.description;
          document.querySelector("#icon").value=sj.object.icon;
          document.querySelector("#parentNodeName").value=sj.object.parentNodeName;
          document.querySelector("#parentName").value=sj.object.parentName;
          document.querySelector("#parentSid").value=sj.object.parentSid;
          self.copy=Object.assign({}, sj.object);
        }else{
          Swal({title:"此权限详情服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("此权限详情请求服务器失败", "", "error")
      })
    },
    AddMenu(kind){
      this.pData.kind=kind;
      this.pData.edit=true;
      this.edit.menuStatus=1;
      this.edit.menuOpen=1;
      this.edit.route="";
      this.edit.url="";
      this.edit.permissionUrlPoList=[];
      document.querySelector("#sid").value="";
      document.querySelector("#name").value="";
      document.querySelector("#route").value="";
      document.querySelector("#description").value="";
      document.querySelector("#icon").value="";
      
      if(kind=="child"){
        this.edit.parentSid=this.edit.sid;
        document.querySelector("#parentSid").value=this.edit.parentSid;
      }
    },
    Edit(){
      this.pData.edit=true;
      this.pData.kind="";
    },
    Del(){
      let self=this;
      Swal({
        title:"删除："+self.edit.name+"?",
        type:"warning",
        showCancelButton:true
      }).then((result)=>{
        if(result.value){
          Api.AuthDelete({
            sid:self.edit.sid
          }).then(function(sj){
            sj=PF.JsonFormat(sj.data);
            if(sj.status==0){
              Swal({title:"删除成功", type:"success", timer:2000});
              self.Initial(true);
            }else{
              Swal({title:"删除权限服务器返回错误", text:sj.errorMsg, type:"error"});
            }
          }).catch(function(error) {
            Swal("删除权限请求服务器失败", "", "error");
          })
        }
      });
    },
    Close(){
      this.pData.edit=false;
      this.edit=Object.assign({}, this.copy);
      document.querySelector("#sid").value=this.copy.sid;
      document.querySelector("#name").value=this.copy.name;
      document.querySelector("#route").value=this.copy.route;
      document.querySelector("#description").value=this.copy.description;
      document.querySelector("#icon").value=this.copy.icon;
    },
    Submit(){
      let self=this;
      self.ClearError();
      self.edit.name=document.querySelector("#name").value;
      self.edit.route=document.querySelector("#route").value;
      self.edit.description=document.querySelector("#description").value;
      self.edit.icon=document.querySelector("#icon").value;

      if(!self.edit.name){self.error.nameError="* 请输入菜单名称"; return PF.GoTo("name");}
      if(!self.edit.route){self.error.routeError="* 请输入前端路由地址"; return PF.GoTo("route");}
      if(!self.edit.url){self.error.urlError="* 请输入链接地址"; return PF.GoTo("url");}
      if(!self.edit.description){self.error.descriptionError="* 请输入描述"; return PF.GoTo("description");}

      if(self.edit.permissionUrlPoList.length!=0){
        for(var i=0; i<self.edit.permissionUrlPoList.length; i++){
          if(!self.edit.permissionUrlPoList[i].url||!self.edit.permissionUrlPoList[i].description){
            self.error.childsError[i]="* 子节点名称或url地址不能为空"; return PF.GoTo("childs");
          }
        }
      }
      if(self.pData.kind){
        Api.AuthCreate({
          name:self.edit.name,
          route:self.edit.route,
          url:self.edit.url,
          description:self.edit.description,
          icon:self.edit.icon,
          isOutsideLink:self.edit.isOutsideLink,
          menuStatus:self.edit.menuStatus,
          menuOpen:self.edit.menuOpen,
          parentNodeName:self.edit.parentNodeName,
          parentName:self.edit.parentName,
          parentSid:self.edit.parentSid,
          kind:self.pData.clientType,
          permissionUrlPoList:self.edit.permissionUrlPoList,
          flag:self.edit.flag,
          sort:self.edit.sort,
          type:self.edit.type
        }).then(function(sj){
          sj=PF.JsonFormat(sj.data);
          if(sj.status==0){
            Swal({title:"保存成功", type:"success", timer:"2000"});
            self.pData.kind="";
            self.pData.edit=false;
            self.Initial(false);
          }else{
            Swal({title:"保存服务器返回错误", text:sj.errorMsg, type:"error"});
          }
        }).catch(function(error) {
          Swal("保存请求服务器失败", "", "error");
        })
      }else if(self.pData.edit){
        Api.AuthUpdate({
          sid:self.edit.sid,
          name:self.edit.name,
          route:self.edit.route,
          url:self.edit.url,
          description:self.edit.description,
          icon:self.edit.icon,
          isOutsideLink:self.edit.isOutsideLink,
          menuStatus:self.edit.menuStatus,
          menuOpen:self.edit.menuOpen,
          parentNodeName:self.edit.parentNodeName,
          parentName:self.edit.parentName,
          parentSid:self.edit.parentSid,
          permissionUrlPoList:self.edit.permissionUrlPoList,
          kind:self.pData.clientType,
          flag:self.edit.flag,
          sort:self.edit.sort,
          type:self.edit.type
        }).then(function(sj){
          sj=PF.JsonFormat(sj.data);
          if(sj.status==0){
            Swal({title:"保存成功", type:"success", timer:"2000"});
            self.pData.kind="";
            self.pData.edit=false;
            document.querySelector(".bg-blue").querySelectorAll(".el-tree-node__label")[0].innerHTML=self.edit.name;
          }else{
            Swal({title:"保存服务器返回错误", text:sj.errorMsg, type:"error"});
          }
        }).catch(function(error) {
          Swal("保存请求服务器失败", "", "error");
        })
      }
    },
    AddChildMenu(){
      if(this.pData.edit==false) return false;
      this.edit.permissionUrlPoList.push({description:"", url:""});
    },
    DelChildMenu(index){
      if(this.pData.edit==false) return false;
      this.edit.permissionUrlPoList.splice(index,1);
    }
  }
}
</script>
