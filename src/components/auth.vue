<template>
  <div class="box2" v-show="pData.show">
      <div class="box2con change">
        <h3>商家：{{pData.shopName}}&nbsp;&nbsp;功能权限</h3>
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
          <button type="button" class="btn w85 mr55" @click="Submit">保存</button>
          <button type="button" class="btn2 w85" @click="Close">取消</button>
        </div>
      </div>
    </div>
</template>
<script>
import * as Api from "@/api/api"
const Swal=require("sweetalert2")

export default{
  name:"Auth",
  data(){
    return{
      pData:{show:false, activeTab:"firstTab", checked1:[], checked2:[], disabled:false},
      data1:[],
      data2:[],
      defaultProps:{label:"name", children:"childs"},
      saveTree1:[],
      saveTree2:[]
    }
  },
  props:["show", "shop"],
  watch:{
    "show":function(nVal, oVal){
      if(nVal==true){
        this.pData=this.shop;
        this.$set(this.pData,"show", this.show);
        this.$set(this.pData,"activeTab", "firstTab");
        this.$set(this.pData,"checked1", []);
        this.$set(this.pData,"checked2", []);
        this.$set(this.pData,"disabled", false);
        this.saveTree1=[];
        this.saveTree2=[];
        this.Initial();
      }else{
        this.pData.show=this.show;
      }
    }
  },
  methods:{
    TreeClick(data,obj) {
      /*let boolean=false, bool=false, i, allChecked;
      allChecked=(obj.checkedKeys).concat(obj.halfCheckedKeys);
      for(i=0; i<allChecked.length; i++) {
        if(allChecked[i]==data.sid){
          boolean=true;              // 此选项是被勾选的
          break;
        }
      }*/
      if(this.pData.activeTab=="firstTab"){
        this.saveTree1=(obj.checkedKeys).concat(obj.halfCheckedKeys);
        this.pData.checked1=obj.checkedKeys;
        /*for(i=0; i<this.saveTree1.length; i++){
          if(this.saveTree1[i].permissionId==data.sid){     // 在this.saveTree1数组中是存在的
            if(boolean){
              this.saveTree1[i].type=0;     // 增加此权限
            }else{
              this.saveTree1[i].type=1;     // 减少此权限
            }
            bool=true;
            break;
          }
        }

        if(!bool){                   // 在this.saveTree1数组中不存在
          this.saveTree1.push({
            permissionId:data.sid,
            type: boolean==true?0:1
          });
        }*/
      }else{
        this.saveTree2=(obj.checkedKeys).concat(obj.halfCheckedKeys);
        this.pData.checked2=obj.checkedKeys;
        /*for(i=0; i<this.saveTree2.length; i++){
          if(this.saveTree2[i].permissionId==data.sid){     // 在this.saveTree2数组中是存在的
            if(boolean){
              this.saveTree2[i].type=0;     // 增加此权限
            }else{
              this.saveTree2[i].type=1;     // 减少此权限
            }
            bool=true;
            break;
          }
        }

        if(!bool){                   // 在this.saveTree2数组中不存在
          this.saveTree2.push({
            permissionId:data.sid,
            type: boolean==true?0:1
          });
        }*/
      }
    },
    handleClick (tab, event) {                                                      // 选项卡
    },
    Initial(){
      let self=this;
      Api.FindShopCustomAuth({
        shopId:self.pData.shopId,
        clientType:0
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          if(sj.object){
            for(var i=0;i<sj.object.length;i++){      // 基础权限勾选
              self.CustomType(sj.object[i], "手机端");
            }
          }
         // self.ShopCustomAuth("手机端", 0);  // 商家自定义权限勾选
         self.ShopAllAuth("手机端", 0);
          
        }else{
          Swal({title:"商家基础权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家基础权限列表请求服务器失败", "", "error")
      });

      Api.FindShopCustomAuth({
        shopId:self.pData.shopId,
        clientType:1
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          if(sj.object) {
            for(var i=0;i<sj.object.length;i++){      // 基础权限勾选
              self.CustomType(sj.object[i], "PC端");
            }
          }
         // self.ShopCustomAuth("PC端", 1);  // 商家自定义权限勾选
         self.ShopAllAuth("PC端", 1);

        }else{
          Swal({title:"商家基础权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家基础权限列表请求服务器失败", "", "error")
      });
    },

    CustomType(object, name){
      let self=this, i=0;
      for(;i<object.childs.length;i++){
        if(object.childs[i].childs!=""){
          self.CustomType(object.childs[i], name);
        }else{
          if(object.childs[i].customType==null){
            if(name=="手机端"){
              self.pData.checked1.push(object.childs[i].sid);
            }else if(name=="PC端"){
              self.pData.checked2.push(object.childs[i].sid);
            }
          }
        }
      }
    },
    /*ShopCustomAuth(name, index){
      let self=this;
      Api.ShopCustomAuth({
        shopId:self.pData.shopId,
        clientType:index
      }).then(function(sj) {
        sj=PF.JsonFormat(sj.data);

        if(sj.status==0){
          if(sj.object&&sj.object.length!=0){
            var i, j, boolean;

            if(name=="手机端"){
              for(j=0; j<sj.object.length; j++){
                boolean=true;
                for(i=0; i<self.pData.checked1.length; i++){
                  if(sj.object[j].permissionId==self.pData.checked1[i]){
                    if(sj.object[j].type==1){
                      self.pData.checked1[i].splice(i,1);
                    }
                    boolean=false;
                    break;
                  }
                }
                if(boolean){ // boolan 如果未变成false，则表示此权限，不属于基础权限中，已被添加的权限
                  if(sj.object[j].type==0){
                    self.pData.checked1.push(sj.object[j].permissionId);
                  }
                }
              }
            }else if(name=="PC端"){     
              for(j=0; j<sj.object.length; j++){
                boolean=true;
                for(i=0; i<self.pData.checked2.length; i++){
                  if(sj.object[j].permissionId==self.pData.checked2[i]){
                    if(sj.object[j].type==1){
                      self.pData.checked2[i].splice(i,1);
                    }
                    boolean=false;
                    break;
                  }
                }
                if(boolean){ // boolan 如果未变成false，则表示此权限，不属于基础权限中，已被添加的
                  if(sj.object[j].type==0){
                    self.pData.checked2.push(sj.object[j].permissionId);
                  }
                }
              }
            }
          }

          if(name=="手机端"){
            self.ShopAllAuth("手机端", 0);
          }else if(name=="PC端"){
            self.ShopAllAuth("PC端", 1);
          }
        }else{
          Swal({title:"商家自定义权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家自定义权限列表请求服务器失败", "", "error")
      });
    },*/
    ShopAllAuth(name, index){
      let self=this;
      Api.ShopAllAuth({
        kind: index
      }).then(function(sj){
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          if(name=="手机端"){
            self.data1=sj.object;        // 权限树的最终展示在于这句话
          }else if(name=="PC端"){
            self.data2=sj.object;        // 权限树的最终展示在于这句话
          }
        }else{
          Swal({title:"商家所有权限列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家所有权限列表请求服务器失败", "", "error")
      });
    },
    Submit(){
      let self=this, timer="", time=0;
      if(self.pData.disabled){
        return false;
      }
      if(self.pData.checked1.length==0){
        Swal("请选择手机端权限", "", "error");
        return false;
      }
      if(self.pData.checked2.length==0){
        Swal("请选择PC端权限", "", "error");
        return false;
      }
      self.pData.disabled=true;
      if(self.saveTree1.length>0){
        /*for(var i=0; i<self.pData.checked1.length;i++){
          for(var j=0; j<self.saveTree1.length; j++){
            if(self.pData.checked1[i]==self.saveTree1[j].permissionId&&self.saveTree1[j].type==0){
              // 基础权限中，此项已被勾选，所以认为是重复勾选，因此删除。
              self.saveTree1.splice(j,1);
            }
          }
        }*/
        Api.ShopCustomUpdateAuth({
          shopId:self.pData.shopId,
          permissionIdList:self.saveTree1,
          clientType:0
        }).then(function(sj) {
          sj=PF.JsonFormat(sj.data);
          if(sj.status==0){
            time++;
          }else{
            Swal({title:"保存权限服务器返回错误", text:sj.errorMsg, type:"error"});
          }
        }).catch(function(error) {
          Swal("保存权限请求服务器失败", "", "error");
        });
      }else{
        time++;
      }
      if(self.saveTree2.length>0){
        for(var i=0; i<self.pData.checked2.length;i++){
          for(var j=0; j<self.saveTree2.length; j++){
            if(self.pData.checked2[i]==self.saveTree2[j].permissionId&&self.saveTree2[j].type==0){
              // 基础权限中，此项已被勾选，所以认为是重复勾选，因此删除。
              self.saveTree2.splice(j,1);
            }
          }
        }
        Api.ShopCustomUpdateAuth({
          shopId:self.pData.shopId,
          permissionIdList:self.saveTree2,
          clientType:1
        }).then(function(sj) {
          sj=PF.JsonFormat(sj.data);
          if(sj.status==0){
            time++;
          }else{
            Swal({title:"保存权限服务器返回错误", text:sj.errorMsg, type:"error"});
          }
        }).catch(function(error) {
          Swal("保存权限请求服务器失败", "", "error");
        });
      }else{
        time++;
      }

      timer=setInterval(function(){
        if(time>=2){
          clearInterval(timer);
          Swal({
            title:"保存成功",
            text:"2秒后自动关闭",
            type:"success",
            timer:2000
          }).then((result)=>{
            self.pData.disabled=false;
            self.Close();
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
