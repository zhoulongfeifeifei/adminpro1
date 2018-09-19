<template>
  <div class="box2" v-show="pData.show2">
      <div class="box2con change">
        <h3>角色：{{pData.name}}，功能权限</h3>
        <div class="plane3">
          <el-tabs v-model="pData.activeTab" type="card" @tab-click="handleClick">
            <el-tab-pane label="手机权限" name="firstTab"></el-tab-pane>
            <el-tab-pane label="PC权限" name="secondTab"></el-tab-pane>
          </el-tabs>
          <el-tree show-checkbox default-expand-all  :auto-expand-parent="true" node-key="sid"
            :data="data" :default-checked-keys="pData.checked" :props="defaultProps" @check="TreeClick">
          </el-tree>
        </div>
        <div class="form-group mb30">
          <button type="button" class="btn w85 mr55" @click="Submit" :disabled="pData.disabled">确定</button>
          <button type="button" class="btn2 w85" @click="Close">取消</button>
        </div>
      </div>
    </div>
</template>
<script>
import * as Api from "@/api/api"
const Swal=require("sweetalert2")

export default{
  name:"RoleAuth",
  data(){
    return{
      pData:{show2:false, shopId:"", activeTab:"firstTab", checked:[], disabled:false},
      data:[],
      defaultProps:{label:"name", children:"childs"},
      saveTree:""
    }
  },
  props:["show2", "role"],
  watch:{
    "show2":function(nVal, oVal){
      if(nVal==true){
        this.pData=this.role;
        this.$set(this.pData,"show2", this.show2);
        this.$set(this.pData,"clientType", 0);
        this.$set(this.pData,"activeTab", "firstTab");
        this.$set(this.pData,"checked", []);
        this.$set(this.pData,"disabled", false);
        this.handleClick();
      }else{
        this.pData.show2=this.show2;
      }
    }
  },
  methods:{
    TreeClick(data, obj){
      this.saveTree=(obj.checkedKeys).concat(obj.halfCheckedKeys);
    },
    handleClick(tab, event){                                                      // 选项卡
      let self=this;
      switch(this.pData.activeTab){
        case "firstTab": self.pData.clientType=0; break
        case "secondTab": self.pData.clientType=1; break
      };

      Api.ShopAllAuth({
        kind:self.pData.clientType
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          self.AuthTree(sj.object);
        }else{
          Swal({title:"商家所有权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家所有权限列表请求服务器失败", "", "error")
      })
    },
    AuthTree(object){
      let self=this;
      Api.AuthTree({
        id:this.pData.sid,
        permissionType:3,
        clientType:self.pData.clientType
      }).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          if(sj.object&&sj.object.length!=0){
            for(var i=0;i<sj.object.length;i++){
              self.Arr(sj.object[i], name);
            }
          }
          self.data=object;
        }else{
          Swal({title:"角色权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("角色权限列表请求服务器失败", "", "error");
      })
    },
    Arr(object){
      let self=this, i=0;
      for(; i<object.childs.length; i++){
        if(object.childs[i].childs!=""){
          self.Arr(object.childs[i]);
        }else{
          self.pData.checked.push(object.childs[i].sid);
        }
      }
    },
    Submit(){
      let self=this;
      
      if(!this.saveTree.length){
        Swal({ title:"请选择权限", type:"error" })
        return false;
      }

      self.pData.disabled=true;
      
      Api.ShopSubmitAuth({
        id:self.pData.sid,
        permissionIdList:this.saveTree,
        permissionType:3,
        clientType:self.pData.clientType
      }).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          Swal({
            title:"保存成功",
            text:"2秒后自动关闭",
            type:"success",
            timer:2000
          }).then((result)=>{
            self.Close();
          })
        }else{
          Swal({title:"保存权限服务器返回错误", text:sj.errorMsg, type:"error"});
          self.pData.disabled=false;
        }
      }).catch(function(error) {
        Swal("保存权限请求服务器失败", "", "error");
        self.pData.disabled=false;
      })
    },
    Close(){
      this.$emit("Close");
    }
  }
}
</script>
