<template>
  <div class="box2" v-show="pData.show">
      <div class="box2con change" v-show="boxShow">
        <h3>业态：{{pData.name}}，功能权限</h3>
        <div class="plane3">
          <el-tabs v-model="pData.activeTab" type="card" @tab-click="handleClick">
            <el-tab-pane label="手机权限" name="firstTab">
                <el-tree show-checkbox default-expand-all :auto-expand-parent="true" node-key="sid"
                  :data="data1" :default-checked-keys="pData.checked1" :props="defaultProps" @check="TreeClick">
                </el-tree>
            </el-tab-pane>
            <el-tab-pane label="PC权限" name="secondTab">
              <el-tree show-checkbox default-expand-all :auto-expand-parent="true" node-key="sid"
                :data="data2" :default-checked-keys="pData.checked2" :props="defaultProps" @check="TreeClick">
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="form-group mb30">
          <button type="button" class="btn w85 mr35" @click="Submit(false)" :disabled="pData.disabled">更新</button>
          <a type="button" class="pointer mr35" @click="Submit(true)" :disabled="pData.disabled">保存</a>
          <a type="button" class="pointer" @click="Close">取消</a>
        </div>
      </div>

      <div class="box2con change" v-if="!boxShow">
        <h3>更新功能权限</h3>
        <div class="text-center blue mb25">权限将更新到最新正在使用的权限版本，是否更新？</div>
        
        <div class="plane4">
          <div class="w45p l ml20">
            <el-tabs v-model="pData.activeTab" type="card">
              <el-tab-pane label="手机权限" name="firstTab">
                  <el-tree show-checkbox default-expand-all :auto-expand-parent="true" node-key="sid"
                    :data="data1" :default-checked-keys="pData.checked1" :props="defaultProps" @check="TreeClick">
                  </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="w45p r mr20">
            <el-tabs v-model="pData.activeTab" type="card">
              <el-tab-pane label="PC权限" name="firstTab">
                <el-tree show-checkbox default-expand-all  :auto-expand-parent="true" node-key="sid"
                  :data="data2" :default-checked-keys="pData.checked2" :props="defaultProps" @check="TreeClick">
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <div class="clear"></div>
        <div class="form-group mb30">
          <button type="button" class="btn w85 mr35 mt20" @click="UpData" :disabled="pData.disabled">立即更新</button>
          <a type="button" class="pointer" @click="Close">取消</a>
        </div>
      </div>
    </div>
</template>
<script>
import * as Api from "@/api/api"
const Swal=require("sweetalert2")

export default{
  name:"BusinessAuth",
  data(){
    return{
      pData:{show:false, activeTab:"firstTab", checked1:[], checked2:[], disabled:false},
      data1:[],
      data2:[],
      defaultProps:{label:"name", children:"childs"},
      saveTree1:"",
      saveTree2:"",
      boxShow:true,
      c1:[],
      c2:[],
    }
  },
  props:["show", "business"],
  watch:{
    "show":function(nVal, oVal){
      if(nVal==true){
        this.boxShow=true;
        this.pData=this.business;
        this.$set(this.pData,"show", this.show);
        this.$set(this.pData,"activeTab", "firstTab");
        this.$set(this.pData,"checked1", []);
        this.$set(this.pData,"checked2", []);
        this.$set(this.pData,"disabled", false);
        this.c1=[];
        this.c2=[];
        this.Initial();
      }else{
        this.pData.show=this.show;
      }
    }
  },
  methods:{
    TreeClick(data, obj){
      if(this.pData.activeTab=="firstTab"){
        this.saveTree1=(obj.checkedKeys).concat(obj.halfCheckedKeys);
        this.pData.checked1=obj.checkedKeys;
      }else{
        this.saveTree2=(obj.checkedKeys).concat(obj.halfCheckedKeys);
        this.pData.checked2=obj.checkedKeys;
      }
    },

    Initial(){
      let self=this;
      Api.ShopAllAuth({
        kind:0
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          self.AuthTree(sj.object, "手机端", 0);
        }else{
          Swal({title:"商家所有权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家所有权限列表请求服务器失败", "", "error")
      });

      Api.ShopAllAuth({
        kind:1
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          self.AuthTree(sj.object,"PC端", 1);
        }else{
          Swal({title:"商家所有权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家所有权限列表请求服务器失败", "", "error")
      });
    },
    handleClick(tab, event){                                                      // 选项卡

    },
    AuthTree(object, name, index){
      let self=this;
      Api.AuthTree({
        id:this.pData.sid,
        permissionType:0,
        clientType:index
      }).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          if(sj.object&&sj.object.length!=0){
            for(var i=0;i<sj.object.length;i++){
              if(name=="手机端"){
                self.c1.push(sj.object[i].sid);
              }else if(name=="PC端"){
                self.c2.push(sj.object[i].sid);
              }
              self.Arr(sj.object[i], name);
            }
          }else{
            if(name=="手机端"){
              self.c1="空值";
            }else if(name=="PC端"){
              self.c2="空值";
            }
          }
          if(name=="手机端"){
            self.data1=object;
          }else if(name=="PC端"){
            self.data2=object;
          }
        }else{
          Swal({title:"业态权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("业态权限列表请求服务器失败", "", "error");
      })
    },
    Arr(object, name){
      let self=this, i=0;
      for(; i<object.childs.length; i++){
        if(object.childs[i].childs!=""){
          self.Arr(object.childs[i], name);
          if(name=="手机端"){
            self.c1.push(object.childs[i].sid);
          }else if(name=="PC端"){
            self.c2.push(object.childs[i].sid);
          }
        }else{
          if(name=="手机端"){
            self.pData.checked1.push(object.childs[i].sid);
            self.c1.push(object.childs[i].sid);
          }else if(name=="PC端"){
            self.pData.checked2.push(object.childs[i].sid);
            self.c2.push(object.childs[i].sid);
          }
        }
      }
    },
    AddDisabled(object){
      let self=this, i=0;
      for(;i<object.childs.length;i++){
        if(object.childs[i].childs!=""){
          object.childs[i].disabled=true;
          self.AddDisabled(object.childs[i]);
        }else{
          object.childs[i].disabled=true;
        }
      }
    },
    UpData(){
      let self=this;
      self.pData.disabled=true;

      Api.UpDataAuth().then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          Swal({title:"更新权限成功", type:"success"});
          self.Close();
        }else{
          Swal({title:"更新权限服务器返回错误", text:sj.errorMsg, type:"error"});
        }
        self.pData.disabled=false;
      }).catch(function(error) {
        Swal("更新权限请求服务器失败", "", "error");
        self.pData.disabled=false;
      });
    },
    Submit(boolean){
      let self=this, timer="", time=0;
      if(self.pData.disabled){
        return false;
      }
      if(self.pData.disabled){
        return false;
      }
      if(self.saveTree1===""&&(self.c1.length==1||!self.c1||self.c1=="空值")){
        Swal("设置手机端权限", "", "error");
        return false;
      }

      if(self.saveTree2===""&&(self.c2.length==1||!self.c2||self.c2=="空值")){
        Swal("设置PC端权限", "", "error");
        return false;
      }

      if(typeof self.saveTree1=="object"&&self.saveTree1.length==0){
        Swal("设置手机端权限", "", "error");
        return false;
      }
      if(typeof self.saveTree2=="object"&&self.saveTree2.length==0){
        Swal("设置PC端权限", "", "error");
        return false;
      }
      self.pData.disabled=true;
      
      Api.ShopSubmitAuth({
        id:self.pData.sid,
        permissionIdList:self.saveTree1?self.saveTree1:self.c1,
        permissionType:0,
        clientType:0
      }).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          time++;
        }else{
          Swal({title:"保存权限服务器返回错误", text:sj.errorMsg, type:"error"});
          self.pData.disabled=false;
        }
      }).catch(function(error) {
        Swal("保存权限请求服务器失败", "", "error");
        self.pData.disabled=false;
      });

      Api.ShopSubmitAuth({
        id:self.pData.sid,
        permissionIdList:self.saveTree2?self.saveTree2:self.c2,
        permissionType:0,
        clientType:1
      }).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          time++;
        }else{
          Swal({title:"保存权限服务器返回错误", text:sj.errorMsg, type:"error"});
          self.pData.disabled=false;
        }
      }).catch(function(error) {
        Swal("保存权限请求服务器失败", "", "error");
        self.pData.disabled=false;
      });

      timer=setInterval(function(){
        if(time==2){
          clearInterval(timer);
          Swal({
            title:"保存成功",
            text:"2秒后自动关闭",
            type:"success",
            timer:2000
          }).then((result)=>{
            self.pData.disabled=false;
            if(boolean){
              self.Close();
            }else{
              var i;
              for(i=0;i<self.data1.length;i++){
                self.AddDisabled(self.data1[i]);
                self.data1[i].disabled=true;
              }
              for(i=0;i<self.data2.length;i++){
                self.AddDisabled(self.data2[i]);
                self.data2[i].disabled=true;
              }
              self.pData.checked1=(self.saveTree1 ? self.pData.checked1.concat(self.saveTree1) : self.pData.checked1);
              self.pData.checked2=(self.saveTree2 ? self.pData.checked2.concat(self.saveTree1) : self.pData.checked2);
              self.boxShow=false;
              self.pData.activeTab="firstTab";
            }
          });
        }
      },500);
    },
    Close(){
      this.$emit("Close");
    }
  }
}
</script>
